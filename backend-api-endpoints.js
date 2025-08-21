// Backend API Endpoints for Production Payment System
// These need to be implemented on your server (Node.js/Express example)

// Required dependencies:
// npm install stripe @paypal/checkout-server-sdk express cors helmet dotenv

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['https://typhoonhub.ca', 'https://www.typhoonhub.ca'], // Your domain
    credentials: true
}));
app.use(express.json());

// PayPal Environment Setup
const Environment = process.env.NODE_ENV === 'production' 
    ? paypal.core.LiveEnvironment 
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    )
);

// Database connection (replace with your database)
// This is a placeholder - implement with your preferred database
const database = {
    async createInvestment(data) {
        // Implement your database logic here
        console.log('Creating investment:', data);
        return { id: 'inv_' + Date.now(), ...data };
    },
    
    async updateInvestment(id, data) {
        // Implement your database logic here
        console.log('Updating investment:', id, data);
        return { id, ...data };
    },
    
    async getInvestment(id) {
        // Implement your database logic here
        console.log('Getting investment:', id);
        return { id, status: 'pending' };
    }
};

// ===== STRIPE ENDPOINTS =====

// Create Stripe Payment Intent
app.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', projectTitle, customerEmail, customerName } = req.body;
        
        // Validate input
        if (!amount || amount < 100) { // Minimum $1.00
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        if (!projectTitle) {
            return res.status(400).json({ error: 'Project title is required' });
        }
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currency,
            metadata: {
                projectTitle: projectTitle,
                customerEmail: customerEmail || '',
                customerName: customerName || '',
                type: 'investment'
            },
            description: `Investment in ${projectTitle}`,
            receipt_email: customerEmail || undefined,
        });
        
        // Create investment record in database
        const investment = await database.createInvestment({
            paymentIntentId: paymentIntent.id,
            amount: amount / 100, // Convert back to dollars
            projectTitle: projectTitle,
            customerEmail: customerEmail,
            customerName: customerName,
            paymentMethod: 'stripe',
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        
        console.log('✅ Payment intent created:', paymentIntent.id);
        
        res.json({
            clientSecret: paymentIntent.client_secret,
            investmentId: investment.id
        });
        
    } catch (error) {
        console.error('❌ Stripe payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Webhook Handler
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('✅ Payment succeeded:', paymentIntent.id);
            
            // Update investment status in database
            await database.updateInvestment(paymentIntent.metadata.investmentId, {
                status: 'completed',
                transactionId: paymentIntent.id,
                completedAt: new Date().toISOString()
            });
            
            // Send confirmation email (implement your email service)
            await sendConfirmationEmail(paymentIntent);
            
            break;
            
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('❌ Payment failed:', failedPayment.id);
            
            // Update investment status
            await database.updateInvestment(failedPayment.metadata.investmentId, {
                status: 'failed',
                failedAt: new Date().toISOString(),
                failureReason: failedPayment.last_payment_error?.message || 'Unknown error'
            });
            
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
});

// ===== PAYPAL ENDPOINTS =====

// Create PayPal Order
app.post('/api/paypal/create-order', async (req, res) => {
    try {
        const { amount, projectTitle, customerEmail } = req.body;
        
        // Validate input
        if (!amount || amount < 1) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        if (!projectTitle) {
            return res.status(400).json({ error: 'Project title is required' });
        }
        
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount.toString()
                },
                description: `Investment in ${projectTitle}`,
                custom_id: `typhoonhub_${Date.now()}`
            }],
            payer: {
                email_address: customerEmail || undefined
            }
        });
        
        const order = await paypalClient.execute(request);
        
        // Create investment record in database
        const investment = await database.createInvestment({
            paypalOrderId: order.result.id,
            amount: parseFloat(amount),
            projectTitle: projectTitle,
            customerEmail: customerEmail,
            paymentMethod: 'paypal',
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        
        console.log('✅ PayPal order created:', order.result.id);
        
        res.json({
            orderId: order.result.id,
            investmentId: investment.id
        });
        
    } catch (error) {
        console.error('❌ PayPal order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Capture PayPal Payment
app.post('/api/paypal/capture-order', async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }
        
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        
        const capture = await paypalClient.execute(request);
        
        // Update investment status in database
        const investment = await database.updateInvestment(capture.result.purchase_units[0].custom_id, {
            status: 'completed',
            transactionId: capture.result.id,
            completedAt: new Date().toISOString()
        });
        
        // Send confirmation email
        await sendConfirmationEmail({
            id: capture.result.id,
            amount: capture.result.purchase_units[0].amount.value,
            customer_email: capture.result.payer.email_address,
            metadata: {
                projectTitle: investment.projectTitle
            }
        });
        
        console.log('✅ PayPal payment captured:', capture.result.id);
        
        res.json({
            captureId: capture.result.id,
            status: capture.result.status
        });
        
    } catch (error) {
        console.error('❌ PayPal capture error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== INVESTMENT ENDPOINTS =====

// Create Investment Record
app.post('/api/investments/create', async (req, res) => {
    try {
        const investment = await database.createInvestment(req.body);
        
        console.log('✅ Investment record created:', investment.id);
        res.json(investment);
        
    } catch (error) {
        console.error('❌ Investment creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Investment Details
app.get('/api/investments/:id', async (req, res) => {
    try {
        const investment = await database.getInvestment(req.params.id);
        
        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }
        
        res.json(investment);
        
    } catch (error) {
        console.error('❌ Investment fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===== EMAIL SERVICE =====

async function sendConfirmationEmail(paymentData) {
    try {
        // Implement your email service here (SendGrid, AWS SES, etc.)
        console.log('📧 Sending confirmation email for payment:', paymentData.id);
        
        const emailData = {
            to: paymentData.customer_email || paymentData.metadata?.customerEmail,
            subject: `Investment Confirmation - ${paymentData.metadata?.projectTitle}`,
            html: `
                <h2>🎉 Investment Confirmed!</h2>
                <p>Thank you for your investment in <strong>${paymentData.metadata?.projectTitle}</strong></p>
                <p><strong>Transaction ID:</strong> ${paymentData.id}</p>
                <p><strong>Amount:</strong> $${paymentData.amount || (paymentData.amount_received / 100)}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <hr>
                <p>You'll receive updates on the project's progress and gain access to exclusive investor content.</p>
                <p>Questions? Contact us at support@typhoonhub.ca</p>
            `
        };
        
        // Example with SendGrid:
        // await sgMail.send(emailData);
        
        console.log('✅ Confirmation email sent');
        
    } catch (error) {
        console.error('❌ Email sending failed:', error);
    }
}

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        services: {
            stripe: !!process.env.STRIPE_SECRET_KEY,
            paypal: !!process.env.PAYPAL_CLIENT_ID,
            database: true // Check your database connection
        }
    });
});

// ===== ERROR HANDLING =====

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Payment API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;