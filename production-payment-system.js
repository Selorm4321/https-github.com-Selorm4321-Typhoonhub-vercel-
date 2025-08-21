// Production Payment System - Real Stripe and PayPal Integration
// Replace the test system with actual payment processing

console.log('🚀 Production Payment System Loading...');

// Production Payment Configuration
const PAYMENT_CONFIG = {
    stripe: {
        // NOTE: Replace with your actual Stripe publishable key
        publishableKey: 'pk_live_YOUR_STRIPE_PUBLISHABLE_KEY_HERE', // Replace with real key
        apiEndpoint: '/api/stripe/create-payment-intent',
        confirmEndpoint: '/api/stripe/confirm-payment'
    },
    paypal: {
        // NOTE: Replace with your actual PayPal client ID
        clientId: 'YOUR_PAYPAL_CLIENT_ID_HERE', // Replace with real client ID
        environment: 'production', // 'sandbox' for testing, 'production' for live
        apiEndpoint: '/api/paypal/create-order',
        captureEndpoint: '/api/paypal/capture-order'
    },
    api: {
        baseUrl: 'https://typhoonhub.ca', // Your domain
        investmentEndpoint: '/api/investments/create',
        confirmationEndpoint: '/api/investments/confirm'
    }
};

// Production Payment System Class
class ProductionPaymentSystem {
    constructor() {
        this.stripe = null;
        this.paypal = null;
        this.currentPaymentIntent = null;
        this.currentPayPalOrder = null;
        this.isInitialized = false;
    }

    async initialize() {
        console.log('🔄 Initializing production payment system...');
        
        try {
            // Initialize Stripe
            await this.initializeStripe();
            
            // Initialize PayPal
            await this.initializePayPal();
            
            this.isInitialized = true;
            console.log('✅ Production payment system initialized successfully');
            
            // Override the existing alert interceptor
            this.setupPaymentInterceptor();
            
        } catch (error) {
            console.error('❌ Failed to initialize payment system:', error);
            throw error;
        }
    }

    async initializeStripe() {
        // Load Stripe.js if not already loaded
        if (!window.Stripe) {
            await this.loadScript('https://js.stripe.com/v3/');
        }
        
        // Initialize Stripe with publishable key
        this.stripe = Stripe(PAYMENT_CONFIG.stripe.publishableKey);
        console.log('✅ Stripe initialized');
    }

    async initializePayPal() {
        // Load PayPal SDK if not already loaded
        if (!window.paypal) {
            const paypalSrc = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=USD&components=buttons,funding-eligibility`;
            await this.loadScript(paypalSrc);
        }
        
        this.paypal = window.paypal;
        console.log('✅ PayPal initialized');
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupPaymentInterceptor() {
        const originalAlert = window.alert;
        let self = this;
        
        window.alert = function(message) {
            if (message && (
                message.includes('Payment of $') || 
                message.includes('would be processed via Stripe') ||
                message.includes('would be processed via PayPal')
            )) {
                // Extract payment details
                const amountMatch = message.match(/Payment of \\$(\\d+)/);
                const amount = amountMatch ? parseInt(amountMatch[1]) : 100;
                const projectMatch = message.match(/for "([^"]+)"/);
                const projectTitle = projectMatch ? projectMatch[1] : 'TyphoonHub Investment';
                
                // Determine payment method
                const isPayPal = message.includes('PayPal');
                const paymentMethod = isPayPal ? 'paypal' : 'stripe';
                
                // Show production payment form
                self.showProductionPaymentForm(amount, projectTitle, paymentMethod);
                return;
            }
            
            // Show non-payment alerts normally
            originalAlert.call(this, message);
        };
    }

    showProductionPaymentForm(amount, projectTitle, paymentMethod) {
        const formHTML = `
        <div id="productionPaymentOverlay" style="
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.9); 
            z-index: 10000; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            backdrop-filter: blur(10px);
        ">
            <div style="
                background: white; 
                padding: 40px; 
                border-radius: 20px; 
                max-width: 600px; 
                width: 95%; 
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 30px 80px rgba(0,0,0,0.7);
            ">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); 
                        color: white; 
                        padding: 30px; 
                        border-radius: 15px; 
                        margin-bottom: 25px;
                    ">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">
                            ${paymentMethod === 'paypal' ? '🅿️ PayPal' : '💳 Stripe'} Payment
                        </h1>
                        <p style="margin: 15px 0 5px 0; font-size: 16px; opacity: 0.9;">
                            ${projectTitle}
                        </p>
                        <div style="
                            background: rgba(255,255,255,0.1); 
                            padding: 15px; 
                            border-radius: 10px; 
                            margin-top: 20px;
                        ">
                            <div style="font-size: 32px; font-weight: 800; color: #4CAF50;">
                                $${amount}.00 USD
                            </div>
                            <div style="font-size: 14px; opacity: 0.8; margin-top: 5px;">
                                Investment Amount
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%); 
                        border: 2px solid #4CAF50; 
                        padding: 20px; 
                        border-radius: 12px;
                        margin-bottom: 25px;
                    ">
                        <div style="color: #2e7d2e; font-weight: 600;">
                            🔴 LIVE PAYMENT MODE ACTIVE
                        </div>
                        <div style="font-size: 14px; color: #555; margin-top: 5px;">
                            Real payments will be processed • Funds will be charged
                        </div>
                    </div>
                </div>
                
                <!-- Payment Method Specific Content -->
                <div id="paymentMethodContainer">
                    ${paymentMethod === 'paypal' ? this.createPayPalContainer(amount) : this.createStripeContainer(amount)}
                </div>
                
                <!-- Security Footer -->
                <div style="
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 1px solid #e9ecef; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #6c757d;
                ">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
                        <span style="display: flex; align-items: center; gap: 5px;">🔒 SSL Secured</span>
                        <span style="display: flex; align-items: center; gap: 5px;">🛡️ PCI Compliant</span>
                        <span style="display: flex; align-items: center; gap: 5px;">🌐 Global Processing</span>
                        <span style="display: flex; align-items: center; gap: 5px;">💼 Business Verified</span>
                    </div>
                </div>
                
                <!-- Close Button -->
                <button onclick="productionPaymentSystem.closePaymentForm()" style="
                    position: absolute; 
                    top: 15px; 
                    right: 15px; 
                    background: #dc3545; 
                    color: white; 
                    border: none; 
                    border-radius: 50%; 
                    width: 45px; 
                    height: 45px; 
                    cursor: pointer; 
                    font-size: 22px;
                    font-weight: bold;
                ">×</button>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHTML);
        
        // Initialize payment method specific functionality
        if (paymentMethod === 'paypal') {
            this.initializePayPalButtons(amount, projectTitle);
        } else {
            this.initializeStripeElements(amount, projectTitle);
        }
    }

    createStripeContainer(amount) {
        return `
            <div id="stripeContainer">
                <form id="stripePaymentForm">
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                            📧 Email Address
                        </label>
                        <input 
                            type="email" 
                            id="stripeEmail" 
                            name="email" 
                            required 
                            autocomplete="email"
                            style="
                                width: 100%; 
                                padding: 16px; 
                                border: 2px solid #e1e5e9; 
                                border-radius: 10px; 
                                font-size: 16px; 
                                box-sizing: border-box;
                                transition: border-color 0.3s ease;
                            "
                            placeholder="investor@example.com"
                        >
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                            👤 Full Name
                        </label>
                        <input 
                            type="text" 
                            id="stripeName" 
                            name="name" 
                            required 
                            autocomplete="name"
                            style="
                                width: 100%; 
                                padding: 16px; 
                                border: 2px solid #e1e5e9; 
                                border-radius: 10px; 
                                font-size: 16px; 
                                box-sizing: border-box;
                                transition: border-color 0.3s ease;
                            "
                            placeholder="John Doe"
                        >
                    </div>
                    
                    <!-- Stripe Elements will be inserted here -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                            💳 Card Information
                        </label>
                        <div id="stripeCardElement" style="
                            padding: 16px; 
                            border: 2px solid #e1e5e9; 
                            border-radius: 10px; 
                            background: #f8f9fa;
                        ">
                            <!-- Stripe Card Element will be mounted here -->
                        </div>
                        <div id="stripeCardErrors" style="
                            color: #dc3545; 
                            font-size: 14px; 
                            margin-top: 8px; 
                            display: none;
                        "></div>
                    </div>
                    
                    <button 
                        type="submit" 
                        id="stripeSubmitButton" 
                        style="
                            width: 100%; 
                            padding: 20px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            border: none; 
                            border-radius: 12px; 
                            font-size: 18px; 
                            font-weight: 700; 
                            cursor: pointer;
                            transition: all 0.3s ease;
                        "
                    >
                        💳 Pay $${amount}.00 with Stripe
                    </button>
                </form>
                
                <div id="stripePaymentResult" style="margin-top: 25px; display: none;"></div>
            </div>
        `;
    }

    createPayPalContainer(amount) {
        return `
            <div id="paypalContainer">
                <div style="
                    background: #fff3cd; 
                    border: 1px solid #ffc107; 
                    padding: 20px; 
                    border-radius: 12px; 
                    margin-bottom: 25px;
                    text-align: center;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #856404;">
                        🅿️ PayPal Secure Payment
                    </h3>
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        Click the PayPal button below to complete your payment securely
                    </p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        📧 Email Address (Optional)
                    </label>
                    <input 
                        type="email" 
                        id="paypalEmail" 
                        name="email" 
                        autocomplete="email"
                        style="
                            width: 100%; 
                            padding: 16px; 
                            border: 2px solid #e1e5e9; 
                            border-radius: 10px; 
                            font-size: 16px; 
                            box-sizing: border-box;
                        "
                        placeholder="investor@example.com"
                    >
                </div>
                
                <!-- PayPal Buttons will be rendered here -->
                <div id="paypalButtonContainer" style="margin-bottom: 25px;"></div>
                
                <div id="paypalPaymentResult" style="margin-top: 25px; display: none;"></div>
            </div>
        `;
    }

    async initializeStripeElements(amount, projectTitle) {
        console.log('🔄 Initializing Stripe Elements...');
        
        const elements = this.stripe.elements();
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });
        
        cardElement.mount('#stripeCardElement');
        
        // Handle real-time validation errors from the card Element
        cardElement.on('change', ({error}) => {
            const displayError = document.getElementById('stripeCardErrors');
            if (error) {
                displayError.textContent = error.message;
                displayError.style.display = 'block';
            } else {
                displayError.style.display = 'none';
            }
        });
        
        // Handle form submission
        const form = document.getElementById('stripePaymentForm');
        form.addEventListener('submit', (event) => this.handleStripeSubmit(event, cardElement, amount, projectTitle));
        
        console.log('✅ Stripe Elements initialized');
    }

    async handleStripeSubmit(event, cardElement, amount, projectTitle) {
        event.preventDefault();
        
        const submitButton = document.getElementById('stripeSubmitButton');
        const resultDiv = document.getElementById('stripePaymentResult');
        
        // Disable submit button and show loading
        submitButton.disabled = true;
        submitButton.textContent = '🔄 Processing Payment...';
        
        try {
            // Step 1: Create Payment Intent on server
            console.log('🔄 Creating payment intent...');
            const response = await fetch(PAYMENT_CONFIG.stripe.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount * 100, // Stripe uses cents
                    currency: 'usd',
                    projectTitle: projectTitle,
                    customerEmail: document.getElementById('stripeEmail').value,
                    customerName: document.getElementById('stripeName').value
                }),
            });
            
            const {clientSecret, error: serverError} = await response.json();
            
            if (serverError) {
                throw new Error(serverError);
            }
            
            // Step 2: Confirm Payment with Stripe
            console.log('🔄 Confirming payment with Stripe...');
            const {error: stripeError, paymentIntent} = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: document.getElementById('stripeName').value,
                        email: document.getElementById('stripeEmail').value,
                    },
                }
            });
            
            if (stripeError) {
                throw new Error(stripeError.message);
            }
            
            // Step 3: Handle successful payment
            if (paymentIntent.status === 'succeeded') {
                console.log('✅ Payment successful!', paymentIntent.id);
                
                // Record investment in database
                await this.recordInvestment(paymentIntent.id, amount, projectTitle, 'stripe');
                
                // Show success message
                this.showSuccessMessage(resultDiv, paymentIntent.id, amount, projectTitle, 'Stripe');
            }
            
        } catch (error) {
            console.error('❌ Payment failed:', error);
            this.showErrorMessage(resultDiv, error.message);
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = `💳 Pay $${amount}.00 with Stripe`;
        }
    }

    initializePayPalButtons(amount, projectTitle) {
        console.log('🔄 Initializing PayPal buttons...');
        
        this.paypal.Buttons({
            createOrder: (data, actions) => {
                console.log('🔄 Creating PayPal order...');
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toString(),
                            currency_code: 'USD'
                        },
                        description: `Investment in ${projectTitle}`,
                        custom_id: `typhoonhub_investment_${Date.now()}`
                    }]
                });
            },
            
            onApprove: async (data, actions) => {
                console.log('🔄 PayPal payment approved, capturing...');
                
                try {
                    const order = await actions.order.capture();
                    console.log('✅ PayPal payment captured:', order.id);
                    
                    // Record investment in database
                    await this.recordInvestment(order.id, amount, projectTitle, 'paypal');
                    
                    // Show success message
                    const resultDiv = document.getElementById('paypalPaymentResult');
                    this.showSuccessMessage(resultDiv, order.id, amount, projectTitle, 'PayPal');
                    
                } catch (error) {
                    console.error('❌ PayPal capture failed:', error);
                    const resultDiv = document.getElementById('paypalPaymentResult');
                    this.showErrorMessage(resultDiv, 'Payment capture failed. Please try again.');
                }
            },
            
            onError: (err) => {
                console.error('❌ PayPal error:', err);
                const resultDiv = document.getElementById('paypalPaymentResult');
                this.showErrorMessage(resultDiv, 'PayPal payment failed. Please try again.');
            },
            
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
                height: 55
            }
        }).render('#paypalButtonContainer');
        
        console.log('✅ PayPal buttons initialized');
    }

    async recordInvestment(transactionId, amount, projectTitle, paymentMethod) {
        console.log('🔄 Recording investment in database...');
        
        try {
            const response = await fetch(PAYMENT_CONFIG.api.investmentEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionId: transactionId,
                    amount: amount,
                    projectTitle: projectTitle,
                    paymentMethod: paymentMethod,
                    timestamp: new Date().toISOString(),
                    customerEmail: document.getElementById(paymentMethod + 'Email')?.value || '',
                    customerName: document.getElementById('stripeName')?.value || ''
                }),
            });
            
            const result = await response.json();
            console.log('✅ Investment recorded:', result);
            
        } catch (error) {
            console.error('⚠️ Failed to record investment:', error);
            // Don't throw error - payment was successful even if recording failed
        }
    }

    showSuccessMessage(resultDiv, transactionId, amount, projectTitle, paymentMethod) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                border: 2px solid #28a745; 
                padding: 30px; 
                border-radius: 15px; 
                color: #155724;
                text-align: center;
            ">
                <h2 style="margin: 0 0 20px 0; font-size: 24px;">✅ Payment Successful!</h2>
                
                <div style="
                    background: rgba(255,255,255,0.8); 
                    padding: 20px; 
                    border-radius: 10px; 
                    margin-bottom: 20px;
                    text-align: left;
                ">
                    <h3 style="margin: 0 0 15px 0; color: #0f5132;">📋 Transaction Details</h3>
                    <div style="font-size: 15px; line-height: 1.8;">
                        <strong>💰 Amount:</strong> $${amount}.00 USD<br>
                        <strong>🎬 Project:</strong> ${projectTitle}<br>
                        <strong>💳 Payment Method:</strong> ${paymentMethod}<br>
                        <strong>🆔 Transaction ID:</strong> ${transactionId}<br>
                        <strong>📅 Date:</strong> ${new Date().toLocaleDateString()}<br>
                        <strong>⏰ Time:</strong> ${new Date().toLocaleTimeString()}
                    </div>
                </div>
                
                <div style="margin-bottom: 25px; color: #0f5132;">
                    <h3 style="margin: 0 0 15px 0;">🎉 What Happens Next</h3>
                    <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                        ✅ <strong>Confirmation Email:</strong> Receipt sent to your email<br>
                        ✅ <strong>Investment Recorded:</strong> Added to your TyphoonHub portfolio<br>
                        ✅ <strong>Exclusive Access:</strong> Investor-only content now available<br>
                        ✅ <strong>Updates:</strong> Production progress notifications enabled<br>
                        ✅ <strong>Community:</strong> Access to investor Discord channel
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="productionPaymentSystem.closePaymentForm()" style="
                        padding: 15px 25px; 
                        background: linear-gradient(135deg, #28a745, #20c997); 
                        color: white; 
                        border: none; 
                        border-radius: 10px; 
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">🚀 Go to Dashboard</button>
                    
                    <button onclick="window.open('mailto:support@typhoonhub.ca?subject=Investment Confirmation - ${transactionId}', '_blank')" style="
                        padding: 15px 25px; 
                        background: #6c757d; 
                        color: white; 
                        border: none; 
                        border-radius: 10px; 
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                    ">📧 Contact Support</button>
                </div>
            </div>
        `;
    }

    showErrorMessage(resultDiv, errorMessage) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="
                background: #f8d7da; 
                border: 2px solid #dc3545; 
                padding: 25px; 
                border-radius: 15px; 
                color: #721c24;
                text-align: center;
            ">
                <h3 style="margin: 0 0 15px 0;">❌ Payment Failed</h3>
                <p style="margin: 0 0 20px 0; font-size: 16px;">
                    ${errorMessage}
                </p>
                <div style="font-size: 14px; margin-bottom: 20px;">
                    <strong>💡 Common Solutions:</strong><br>
                    • Check your card details and try again<br>
                    • Ensure you have sufficient funds<br>
                    • Contact your bank if the issue persists<br>
                    • Try a different payment method
                </div>
                <button onclick="location.reload()" style="
                    padding: 12px 20px; 
                    background: #dc3545; 
                    color: white; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-weight: 600;
                ">🔄 Try Again</button>
            </div>
        `;
    }

    closePaymentForm() {
        const overlay = document.getElementById('productionPaymentOverlay');
        if (overlay) {
            overlay.remove();
        }
        console.log('📝 Production payment form closed');
    }
}

// Initialize the production payment system
const productionPaymentSystem = new ProductionPaymentSystem();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        productionPaymentSystem.initialize().catch(console.error);
    });
} else {
    productionPaymentSystem.initialize().catch(console.error);
}

// Export for global access
window.productionPaymentSystem = productionPaymentSystem;

console.log('✅ Production Payment System loaded and ready for initialization');