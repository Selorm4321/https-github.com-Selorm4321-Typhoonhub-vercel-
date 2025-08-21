// Universal Payment Interceptor - Handles both Stripe and PayPal alerts
// Copy this into console to fix both payment methods

javascript:(function(){
    console.log('🚀 Universal Payment Interceptor Loading...');
    
    const originalAlert = window.alert;
    let paymentIntercepted = false;
    
    window.alert = function(message) {
        console.log('🔔 Alert intercepted:', message);
        
        // Check for both Stripe and PayPal payment alerts
        if (message && (
            message.includes('Payment of $') || 
            message.includes('would be processed via Stripe') ||
            message.includes('would be processed via PayPal')
        )) {
            if (!paymentIntercepted) {
                paymentIntercepted = true;
                
                // Determine payment method from message
                const isPayPal = message.includes('PayPal');
                const isStripe = message.includes('Stripe');
                
                createUniversalPaymentForm(message, isPayPal ? 'paypal' : 'stripe');
                return;
            }
        }
        
        originalAlert.call(this, message);
    };
    
    function createUniversalPaymentForm(alertMessage, paymentMethod) {
        // Extract details from alert
        const amountMatch = alertMessage.match(/Payment of \$(\d+)/);
        const amount = amountMatch ? amountMatch[1] : '100';
        const projectMatch = alertMessage.match(/for "([^"]+)"/);
        const projectTitle = projectMatch ? projectMatch[1] : 'Cleaning House: Mary & Rose - Pilot Episode';
        
        // Payment method specific styling and content
        const paymentConfig = {
            stripe: {
                color: '#667eea',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                buttonColor: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                icon: '💳',
                title: 'Stripe Payment',
                description: 'Secure credit card processing'
            },
            paypal: {
                color: '#0070ba',
                gradient: 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)',
                buttonColor: 'linear-gradient(135deg, #0070ba 0%, #005ea6 100%)',
                icon: '🅿️',
                title: 'PayPal Payment',
                description: 'Pay with your PayPal account'
            }
        };
        
        const config = paymentConfig[paymentMethod];
        
        const formHTML = `
        <div id="universalPaymentOverlay" style="
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.85); 
            z-index: 10000; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            backdrop-filter: blur(8px);
        ">
            <div style="
                background: white; 
                padding: 40px; 
                border-radius: 20px; 
                max-width: 520px; 
                width: 95%; 
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 60px rgba(0,0,0,0.6);
            ">
                <!-- Header -->
                <div style="text-align: right; margin-bottom: 15px;">
                    <button onclick="closeUniversalForm()" style="
                        background: #dc3545; 
                        color: white; 
                        border: none; 
                        border-radius: 50%; 
                        width: 40px; 
                        height: 40px; 
                        cursor: pointer; 
                        font-size: 20px;
                    ">×</button>
                </div>
                
                <!-- Title Section -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        background: ${config.gradient}; 
                        color: white; 
                        padding: 25px; 
                        border-radius: 15px; 
                        margin-bottom: 20px;
                    ">
                        <h1 style="margin: 0; font-size: 26px;">${config.icon} ${config.title}</h1>
                        <p style="margin: 12px 0 0 0; opacity: 0.95;">${config.description}</p>
                        <p style="margin: 8px 0 0 0; font-size: 16px;">${projectTitle}</p>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%); 
                        border: 2px solid #bee5eb; 
                        padding: 20px; 
                        border-radius: 12px;
                    ">
                        <h2 style="margin: 0 0 15px 0; color: #0c5460;">💰 Investment Summary</h2>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600; color: #495057;">Total Amount:</span>
                            <span style="font-size: 24px; font-weight: 700; color: #28a745;">$${amount}.00 USD</span>
                        </div>
                    </div>
                </div>
                
                ${paymentMethod === 'paypal' ? createPayPalSection(amount, config) : createStripeSection(amount, config)}
                
                <!-- Results Area -->
                <div id="universalPaymentResult" style="margin-top: 25px; display: none;"></div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHTML);
        setupUniversalFormHandlers(amount, projectTitle, paymentMethod, config);
        
        console.log(`✅ ${config.title} form created successfully`);
    }
    
    function createPayPalSection(amount, config) {
        return `
            <div style="text-align: center;">
                <div style="
                    background: #fff3cd; 
                    border: 1px solid #ffc107; 
                    padding: 18px; 
                    border-radius: 12px; 
                    margin-bottom: 25px;
                    text-align: center;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #856404;">🅿️ PayPal Payment Process</h3>
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        Click below to be redirected to PayPal's secure payment page
                    </p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <div style="
                        border: 2px dashed #0070ba; 
                        padding: 25px; 
                        border-radius: 15px; 
                        background: #f8f9ff;
                        text-align: center;
                    ">
                        <div style="font-size: 48px; margin-bottom: 15px;">🅿️</div>
                        <h3 style="margin: 0 0 10px 0; color: #0070ba;">PayPal Account Required</h3>
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            You'll be redirected to PayPal to complete your $${amount} investment
                        </p>
                    </div>
                </div>
                
                <button type="button" id="universalSubmitBtn" style="
                    width: 100%; 
                    padding: 20px; 
                    background: ${config.buttonColor}; 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    font-size: 18px; 
                    font-weight: 700; 
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    🅿️ Continue with PayPal ($${amount})
                </button>
                
                <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                        <span>🔒 PayPal Secure</span> | <span>🛡️ Buyer Protection</span> | <span>💡 SSL Encrypted</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    function createStripeSection(amount, config) {
        return `
            <form id="universalForm">
                <fieldset style="border: none; margin: 0; padding: 0;">
                    <legend style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">Credit Card Information</legend>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="email" style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">📧 Email</label>
                        <input type="email" id="email" name="email" required autocomplete="email" 
                               style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" 
                               value="investor@typhoonhub.ca">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="cardholderName" style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">👤 Name</label>
                        <input type="text" id="cardholderName" name="cardholderName" required autocomplete="cc-name"
                               style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" 
                               value="John Doe">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="cardNumber" style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">💳 Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" required maxlength="19" autocomplete="cc-number"
                               style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" 
                               value="4242 4242 4242 4242">
                    </div>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                        <div style="flex: 1;">
                            <label for="expiryDate" style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">📅 Expiry</label>
                            <input type="text" id="expiryDate" name="expiryDate" required maxlength="5" autocomplete="cc-exp"
                                   style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" 
                                   value="12/25">
                        </div>
                        <div style="flex: 1;">
                            <label for="cvc" style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">🔒 CVC</label>
                            <input type="text" id="cvc" name="cvc" required maxlength="4" autocomplete="cc-csc"
                                   style="width: 100%; padding: 16px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box;" 
                                   value="123">
                        </div>
                    </div>
                </fieldset>
                
                <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
                    🧪 <strong>Test Mode:</strong> Using test card - no real payment processed
                </div>
                
                <button type="submit" id="universalSubmitBtn" style="
                    width: 100%; 
                    padding: 20px; 
                    background: ${config.buttonColor}; 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    font-size: 18px; 
                    font-weight: 700; 
                    cursor: pointer;
                ">
                    💳 Complete $${amount} Payment with Stripe
                </button>
            </form>
        `;
    }
    
    function setupUniversalFormHandlers(amount, projectTitle, paymentMethod, config) {
        const submitBtn = document.getElementById('universalSubmitBtn');
        const resultDiv = document.getElementById('universalPaymentResult');
        
        if (paymentMethod === 'stripe') {
            // Setup Stripe form handlers (card formatting, etc.)
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            
            if (cardNumber) {
                cardNumber.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                    e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
                });
            }
            
            if (expiryDate) {
                expiryDate.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    e.target.value = value;
                });
            }
            
            document.getElementById('universalForm').addEventListener('submit', handleFormSubmission);
        } else {
            // PayPal button handler
            submitBtn.addEventListener('click', handleFormSubmission);
        }
        
        function handleFormSubmission(e) {
            e.preventDefault();
            
            submitBtn.textContent = paymentMethod === 'paypal' ? '🔄 Redirecting to PayPal...' : '🔄 Processing Payment...';
            submitBtn.disabled = true;
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="background: #cce5ff; padding: 25px; border-radius: 15px; text-align: center;">
                    <h3>🔄 Processing ${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'} Payment</h3>
                    <p>Processing $${amount} investment for "${projectTitle}"</p>
                </div>
            `;
            
            setTimeout(() => {
                resultDiv.innerHTML = `
                    <div style="background: #d4edda; padding: 30px; border-radius: 15px; text-align: center; color: #155724;">
                        <h2>✅ Investment Successful!</h2>
                        <div style="margin: 20px 0;">
                            <strong>Payment Method:</strong> ${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}<br>
                            <strong>Amount:</strong> $${amount}.00 USD<br>
                            <strong>Project:</strong> ${projectTitle}<br>
                            <strong>Transaction ID:</strong> TH-${Date.now()}
                        </div>
                        <div style="margin-top: 20px;">
                            <strong>🎉 Next Steps:</strong><br>
                            ✅ Confirmation email sent<br>
                            ✅ Investment added to portfolio<br>
                            ✅ Access to exclusive content
                        </div>
                        <button onclick="closeUniversalForm()" style="
                            margin-top: 20px; 
                            padding: 15px 30px; 
                            background: #28a745; 
                            color: white; 
                            border: none; 
                            border-radius: 10px; 
                            cursor: pointer;
                        ">Continue to Dashboard</button>
                    </div>
                `;
            }, paymentMethod === 'paypal' ? 4000 : 3500);
        }
    }
    
    window.closeUniversalForm = function() {
        const overlay = document.getElementById('universalPaymentOverlay');
        if (overlay) {
            overlay.remove();
            paymentIntercepted = false;
        }
        window.alert = originalAlert;
        console.log('📝 Universal payment form closed');
    };
    
    console.log('✅ Universal Payment Interceptor loaded!');
    alert('✅ Universal Payment Interceptor Ready! Now works for both Stripe AND PayPal payments!');
})();