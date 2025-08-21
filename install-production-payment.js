// Production Payment System Installer
// Run this to quickly set up production payments on TyphoonHub

javascript:(function(){
    console.log('🚀 Installing Production Payment System...');
    
    // Check if already installed
    if (window.productionPaymentSystem) {
        console.log('⚠️ Production payment system already installed');
        if (confirm('Production payment system is already installed. Reinstall?')) {
            delete window.productionPaymentSystem;
        } else {
            return;
        }
    }
    
    // Configuration check
    const config = {
        stripe: {
            publishableKey: 'pk_live_YOUR_STRIPE_KEY_HERE', // ⚠️ REPLACE WITH REAL KEY
            apiEndpoint: 'https://typhoonhub.ca/api/stripe/create-payment-intent'
        },
        paypal: {
            clientId: 'YOUR_PAYPAL_CLIENT_ID_HERE', // ⚠️ REPLACE WITH REAL CLIENT ID
            environment: 'production'
        }
    };
    
    // Validate configuration
    if (config.stripe.publishableKey.includes('YOUR_STRIPE_KEY_HERE')) {
        alert('❌ ERROR: You must update the Stripe publishable key in the code before using production mode!\\n\\nReplace "pk_live_YOUR_STRIPE_KEY_HERE" with your actual Stripe live key.');
        return;
    }
    
    if (config.paypal.clientId.includes('YOUR_PAYPAL_CLIENT_ID_HERE')) {
        alert('❌ ERROR: You must update the PayPal client ID in the code before using production mode!\\n\\nReplace "YOUR_PAYPAL_CLIENT_ID_HERE" with your actual PayPal live client ID.');
        return;
    }
    
    // Warning about production mode
    if (!confirm('⚠️ PRODUCTION MODE WARNING\\n\\nThis will enable REAL payment processing with actual money charges.\\n\\nAre you sure you want to continue?\\n\\n✅ Backend API is deployed\\n✅ Database is configured\\n✅ Stripe/PayPal accounts are verified\\n✅ You have tested with small amounts')) {
        console.log('🛑 Installation cancelled by user');
        return;
    }
    
    // Load production system
    console.log('📥 Loading production payment system...');
    
    // Create production payment system
    class ProductionPaymentInstaller {
        constructor() {
            this.isInstalled = false;
            this.config = config;
        }
        
        async install() {
            try {
                console.log('🔄 Installing production payment system...');
                
                // Load required scripts
                await this.loadRequiredScripts();
                
                // Initialize payment providers
                await this.initializePaymentProviders();
                
                // Setup payment interceptor
                this.setupProductionInterceptor();
                
                this.isInstalled = true;
                console.log('✅ Production payment system installed successfully!');
                
                this.showInstallationSuccess();
                
            } catch (error) {
                console.error('❌ Installation failed:', error);
                alert('❌ Installation failed: ' + error.message + '\\n\\nCheck console for details.');
            }
        }
        
        async loadRequiredScripts() {
            console.log('📦 Loading payment provider scripts...');
            
            // Load Stripe.js
            if (!window.Stripe) {
                await this.loadScript('https://js.stripe.com/v3/');
                console.log('✅ Stripe.js loaded');
            }
            
            // Load PayPal SDK
            if (!window.paypal) {
                const paypalSrc = `https://www.paypal.com/sdk/js?client-id=${this.config.paypal.clientId}&currency=USD&components=buttons`;
                await this.loadScript(paypalSrc);
                console.log('✅ PayPal SDK loaded');
            }
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
                script.onerror = () => reject(new Error(`Failed to load ${src}`));
                document.head.appendChild(script);
            });
        }
        
        async initializePaymentProviders() {
            console.log('🔧 Initializing payment providers...');
            
            // Initialize Stripe
            this.stripe = Stripe(this.config.stripe.publishableKey);
            console.log('✅ Stripe initialized with live key');
            
            // PayPal is initialized when SDK loads
            this.paypal = window.paypal;
            console.log('✅ PayPal initialized');
        }
        
        setupProductionInterceptor() {
            console.log('🎯 Setting up production payment interceptor...');
            
            const originalAlert = window.alert;
            const self = this;
            
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
            
            console.log('✅ Production interceptor activated');
        }
        
        showProductionPaymentForm(amount, projectTitle, paymentMethod) {
            console.log(`💳 Showing production ${paymentMethod} form for $${amount}`);
            
            const isStripe = paymentMethod === 'stripe';
            const isPayPal = paymentMethod === 'paypal';
            
            const formHTML = `
            <div id="productionPaymentModal" style="
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(0,0,0,0.95); 
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
                    box-shadow: 0 30px 80px rgba(0,0,0,0.8);
                    position: relative;
                ">
                    <!-- Close Button -->
                    <button onclick="document.getElementById('productionPaymentModal').remove()" style="
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
                    ">×</button>
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="
                            background: ${isStripe ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)'}; 
                            color: white; 
                            padding: 30px; 
                            border-radius: 15px; 
                            margin-bottom: 25px;
                        ">
                            <h1 style="margin: 0; font-size: 28px;">
                                ${isStripe ? '💳 Stripe' : '🅿️ PayPal'} Live Payment
                            </h1>
                            <p style="margin: 15px 0 5px 0; font-size: 16px;">
                                ${projectTitle}
                            </p>
                            <div style="font-size: 32px; font-weight: 800; margin-top: 20px;">
                                $${amount}.00 USD
                            </div>
                        </div>
                        
                        <div style="
                            background: #fff3cd; 
                            border: 2px solid #ffc107; 
                            padding: 20px; 
                            border-radius: 12px;
                            margin-bottom: 25px;
                        ">
                            <div style="color: #856404; font-weight: 600; font-size: 16px;">
                                🚨 LIVE PAYMENT MODE
                            </div>
                            <div style="font-size: 14px; color: #856404; margin-top: 5px;">
                                Real money will be charged • No refunds without contacting support
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Form Container -->
                    <div id="paymentFormContainer">
                        ${isStripe ? this.createLiveStripeForm(amount) : this.createLivePayPalForm(amount)}
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
                        🔒 PCI DSS Compliant • 🛡️ SSL Secured • 🌐 Live Processing
                    </div>
                </div>
            </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', formHTML);
            
            // Initialize payment method
            if (isStripe) {
                this.initializeLiveStripeForm(amount, projectTitle);
            } else {
                this.initializeLivePayPalForm(amount, projectTitle);
            }
        }
        
        createLiveStripeForm(amount) {
            return `
                <form id="liveStripeForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">📧 Email</label>
                        <input type="email" id="liveStripeEmail" required style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" placeholder="your@email.com">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">👤 Full Name</label>
                        <input type="text" id="liveStripeName" required style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" placeholder="John Doe">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">💳 Card Information</label>
                        <div id="liveStripeCardElement" style="padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; background: white;"></div>
                        <div id="liveStripeCardErrors" style="color: #dc3545; font-size: 14px; margin-top: 8px; display: none;"></div>
                    </div>
                    
                    <button type="submit" id="liveStripeSubmitBtn" style="
                        width: 100%; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                        color: white; 
                        border: none; 
                        border-radius: 12px; 
                        font-size: 18px; 
                        font-weight: 700; 
                        cursor: pointer;
                    ">💳 Pay $${amount}.00 Now</button>
                </form>
                
                <div id="liveStripeResult" style="margin-top: 25px; display: none;"></div>
            `;
        }
        
        createLivePayPalForm(amount) {
            return `
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">📧 Email (Optional)</label>
                    <input type="email" id="livePayPalEmail" style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" placeholder="your@email.com">
                </div>
                
                <div id="livePayPalButtonContainer" style="margin-bottom: 20px;"></div>
                <div id="livePayPalResult" style="margin-top: 25px; display: none;"></div>
            `;
        }
        
        initializeLiveStripeForm(amount, projectTitle) {
            const elements = this.stripe.elements();
            const cardElement = elements.create('card');
            cardElement.mount('#liveStripeCardElement');
            
            cardElement.on('change', ({error}) => {
                const displayError = document.getElementById('liveStripeCardErrors');
                if (error) {
                    displayError.textContent = error.message;
                    displayError.style.display = 'block';
                } else {
                    displayError.style.display = 'none';
                }
            });
            
            document.getElementById('liveStripeForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('💳 Processing live Stripe payment...');
                
                const submitBtn = document.getElementById('liveStripeSubmitBtn');
                const resultDiv = document.getElementById('liveStripeResult');
                
                submitBtn.disabled = true;
                submitBtn.textContent = '🔄 Processing Payment...';
                
                try {
                    // Create payment intent
                    const response = await fetch(this.config.stripe.apiEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: amount * 100,
                            currency: 'usd',
                            projectTitle: projectTitle,
                            customerEmail: document.getElementById('liveStripeEmail').value,
                            customerName: document.getElementById('liveStripeName').value
                        })
                    });
                    
                    const {clientSecret, error} = await response.json();
                    if (error) throw new Error(error);
                    
                    // Confirm payment
                    const {error: stripeError, paymentIntent} = await this.stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: document.getElementById('liveStripeName').value,
                                email: document.getElementById('liveStripeEmail').value
                            }
                        }
                    });
                    
                    if (stripeError) throw new Error(stripeError.message);
                    
                    if (paymentIntent.status === 'succeeded') {
                        this.showLivePaymentSuccess(resultDiv, paymentIntent.id, amount, projectTitle, 'Stripe');
                    }
                    
                } catch (error) {
                    console.error('❌ Live payment failed:', error);
                    this.showLivePaymentError(resultDiv, error.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = `💳 Pay $${amount}.00 Now`;
                }
            });
        }
        
        initializeLivePayPalForm(amount, projectTitle) {
            this.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: amount.toString(), currency_code: 'USD' },
                            description: `Investment in ${projectTitle}`
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log('✅ Live PayPal payment captured:', order.id);
                    
                    const resultDiv = document.getElementById('livePayPalResult');
                    this.showLivePaymentSuccess(resultDiv, order.id, amount, projectTitle, 'PayPal');
                },
                onError: (err) => {
                    console.error('❌ Live PayPal error:', err);
                    const resultDiv = document.getElementById('livePayPalResult');
                    this.showLivePaymentError(resultDiv, 'PayPal payment failed');
                },
                style: { layout: 'vertical', color: 'blue', shape: 'rect', height: 55 }
            }).render('#livePayPalButtonContainer');
        }
        
        showLivePaymentSuccess(resultDiv, transactionId, amount, projectTitle, method) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="background: #d4edda; border: 2px solid #28a745; padding: 30px; border-radius: 15px; text-align: center;">
                    <h2 style="color: #155724; margin: 0 0 20px 0;">✅ Payment Successful!</h2>
                    <div style="background: rgba(255,255,255,0.8); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <strong>Transaction ID:</strong> ${transactionId}<br>
                        <strong>Amount:</strong> $${amount}.00 USD<br>
                        <strong>Method:</strong> ${method}<br>
                        <strong>Project:</strong> ${projectTitle}
                    </div>
                    <p style="color: #155724;">Confirmation email will be sent shortly.</p>
                    <button onclick="document.getElementById('productionPaymentModal').remove()" style="
                        padding: 15px 30px; 
                        background: #28a745; 
                        color: white; 
                        border: none; 
                        border-radius: 10px; 
                        cursor: pointer;
                        font-weight: 600;
                    ">Continue</button>
                </div>
            `;
        }
        
        showLivePaymentError(resultDiv, errorMessage) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="background: #f8d7da; border: 2px solid #dc3545; padding: 25px; border-radius: 15px; text-align: center;">
                    <h3 style="color: #721c24; margin: 0 0 15px 0;">❌ Payment Failed</h3>
                    <p style="color: #721c24; margin: 0 0 20px 0;">${errorMessage}</p>
                    <button onclick="location.reload()" style="
                        padding: 12px 20px; 
                        background: #dc3545; 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer;
                    ">Try Again</button>
                </div>
            `;
        }
        
        showInstallationSuccess() {
            const successHTML = `
            <div id="installationSuccess" style="
                position: fixed; 
                top: 20px; 
                right: 20px; 
                background: #d4edda; 
                border: 2px solid #28a745; 
                padding: 20px; 
                border-radius: 15px; 
                z-index: 10001;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <button onclick="document.getElementById('installationSuccess').remove()" style="
                    position: absolute; 
                    top: 10px; 
                    right: 10px; 
                    background: none; 
                    border: none; 
                    font-size: 20px; 
                    cursor: pointer;
                ">×</button>
                
                <h3 style="color: #155724; margin: 0 0 15px 0;">🎉 Production Payment System Installed!</h3>
                <div style="color: #155724; font-size: 14px; line-height: 1.6;">
                    <strong>✅ Live Mode Active</strong><br>
                    • Real payments will be processed<br>
                    • Stripe and PayPal are connected<br>
                    • Ready for production use<br><br>
                    
                    <strong>Next:</strong> Click "Pay with Stripe" or "Pay with PayPal" to test!
                </div>
            </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', successHTML);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                const successDiv = document.getElementById('installationSuccess');
                if (successDiv) successDiv.remove();
            }, 10000);
        }
    }
    
    // Install the system
    const installer = new ProductionPaymentInstaller();
    installer.install().then(() => {
        window.productionPaymentSystem = installer;
        console.log('🎉 Production payment system ready for use!');
    }).catch(console.error);
    
})();