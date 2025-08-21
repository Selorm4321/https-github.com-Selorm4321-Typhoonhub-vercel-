# 🚀 Production Payment System Deployment Guide

This guide will help you deploy the TyphoonHub payment system with real Stripe and PayPal integration.

## 📋 Prerequisites

### Required Accounts & Services
1. **Stripe Account** (https://stripe.com)
   - Business verification completed
   - Live API keys obtained
   - Webhook endpoints configured

2. **PayPal Business Account** (https://developer.paypal.com)
   - Business verification completed
   - Live API credentials obtained
   - App created in PayPal Developer Console

3. **Database** (PostgreSQL, MySQL, or MongoDB)
   - Production database instance
   - Connection credentials ready

4. **Server/Hosting** (Vercel, Netlify, AWS, etc.)
   - Node.js runtime support
   - Environment variables support
   - HTTPS enabled

## 🔧 Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
npm install stripe @paypal/checkout-server-sdk express cors helmet dotenv
```

### 1.2 Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your production credentials:

```bash
# CRITICAL: Use LIVE credentials for production
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### 1.3 Deploy Backend API
Deploy `backend-api-endpoints.js` to your server:

**Vercel Deployment:**
```bash
npm install -g vercel
vercel --prod
```

**Traditional Server:**
```bash
node backend-api-endpoints.js
```

## 🎯 Step 2: Frontend Integration

### 2.1 Update Configuration
In `production-payment-system.js`, update the configuration:

```javascript
const PAYMENT_CONFIG = {
    stripe: {
        publishableKey: 'pk_live_YOUR_ACTUAL_STRIPE_KEY', // ⚠️ Replace this
        apiEndpoint: 'https://your-api-domain.com/api/stripe/create-payment-intent'
    },
    paypal: {
        clientId: 'YOUR_ACTUAL_PAYPAL_CLIENT_ID', // ⚠️ Replace this
        environment: 'production' // ⚠️ Change from 'sandbox'
    }
};
```

### 2.2 Deploy Frontend
Upload the updated files to your TyphoonHub website.

## 🔒 Step 3: Security Setup

### 3.1 Stripe Webhooks
1. Go to https://dashboard.stripe.com/webhooks
2. Create endpoint: `https://your-api-domain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 3.2 CORS Configuration
Ensure your API only accepts requests from your domain:
```javascript
app.use(cors({
    origin: ['https://typhoonhub.ca', 'https://www.typhoonhub.ca']
}));
```

### 3.3 HTTPS Requirements
- ⚠️ **CRITICAL**: All payment processing MUST use HTTPS
- Both frontend and backend must have valid SSL certificates
- Test with real browser (not localhost)

## 💳 Step 4: Payment Method Setup

### 4.1 Stripe Live Mode
1. **Complete Stripe onboarding**:
   - Business verification
   - Bank account verification
   - Tax information
   
2. **Test with real cards**:
   - Use your own credit card for testing
   - Process small amounts ($1-5) for testing
   - Refund test transactions

3. **Webhook testing**:
   - Use Stripe CLI for local testing
   - Verify webhook events are processed correctly

### 4.2 PayPal Live Mode
1. **Business verification**:
   - Complete PayPal business account verification
   - Link business bank account
   
2. **App configuration**:
   - Create live app in PayPal Developer Console
   - Configure return URLs
   - Set up webhook notifications

## 📊 Step 5: Database Setup

### 5.1 Database Schema
Create tables for investments:

```sql
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    project_title TEXT NOT NULL,
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    metadata JSONB
);
```

### 5.2 Database Connection
Update the database configuration in your backend:

```javascript
// Example with PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
});
```

## 📧 Step 6: Email Integration

### 6.1 SendGrid Setup (Recommended)
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(paymentData) {
    const msg = {
        to: paymentData.customer_email,
        from: 'noreply@typhoonhub.ca',
        subject: 'Investment Confirmation',
        html: '...' // Your email template
    };
    
    await sgMail.send(msg);
}
```

## 🧪 Step 7: Testing Process

### 7.1 Pre-Launch Testing
1. **Stripe Testing**:
   ```bash
   # Test with real cards (small amounts)
   # Process $1.00 test investment
   # Verify webhook reception
   # Test refund process
   ```

2. **PayPal Testing**:
   - Test with real PayPal account
   - Verify order creation and capture
   - Test different funding sources

3. **Database Testing**:
   - Verify investment records are created
   - Test email notifications
   - Check data integrity

### 7.2 Load Testing
```bash
# Test concurrent payments
# Simulate high traffic
# Verify system stability
```

## 🚀 Step 8: Go Live Checklist

### Before Launch:
- [ ] All API keys are LIVE (not test/sandbox)
- [ ] Webhooks are properly configured
- [ ] Database is production-ready
- [ ] Email service is configured
- [ ] HTTPS is enabled everywhere
- [ ] Error monitoring is setup (Sentry recommended)
- [ ] Payment flows tested with real money
- [ ] Refund process tested
- [ ] Customer support contact is ready

### Launch Day:
- [ ] Monitor payment transactions closely
- [ ] Check webhook deliveries
- [ ] Verify email notifications
- [ ] Monitor error logs
- [ ] Test customer support flow

## 🔧 Step 9: Monitoring & Maintenance

### 9.1 Monitoring Setup
```javascript
// Add monitoring to your endpoints
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
```

### 9.2 Error Tracking
```bash
npm install @sentry/node
```

### 9.3 Regular Maintenance
- Monitor failed payments
- Review webhook logs
- Update dependencies regularly
- Backup database regularly
- Monitor fraud patterns

## ⚠️ Important Notes

### Security Warnings:
- **NEVER** commit API keys to version control
- **ALWAYS** use HTTPS in production
- **VALIDATE** all input data
- **SANITIZE** database queries
- **MONITOR** for suspicious activity

### Compliance:
- Ensure PCI DSS compliance
- Follow data protection regulations (GDPR, etc.)
- Maintain audit logs
- Regular security reviews

### Support:
- Set up customer support for payment issues
- Document refund procedures
- Train staff on payment troubleshooting
- Maintain incident response procedures

## 📞 Support Contacts

- **Stripe Support**: https://support.stripe.com
- **PayPal Support**: https://developer.paypal.com/support
- **Technical Issues**: Create issues in this repository

---

## 🎉 Congratulations!

Your TyphoonHub payment system is now ready for production! 

Remember to:
- Start with small test transactions
- Monitor closely during first week
- Have customer support ready
- Keep this documentation updated

Good luck with your film investment platform! 🎬💰