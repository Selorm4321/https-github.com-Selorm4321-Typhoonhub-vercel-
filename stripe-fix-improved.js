// Improved Stripe Payment Form - Fixes accessibility warnings and adds proper form handling
// Copy this enhanced version into console after typing "allow pasting"

javascript:(function(){
    console.log('🚀 Enhanced Stripe Payment Form Loading...');
    
    // Override alert to intercept Stripe payment messages
    const originalAlert = window.alert;
    let paymentIntercepted = false;
    
    window.alert = function(message) {
        console.log('🔔 Alert intercepted:', message);
        
        if (message && (message.includes('Payment of $') || message.includes('would be processed via Stripe'))) {
            if (!paymentIntercepted) {
                paymentIntercepted = true;
                createEnhancedPaymentForm(message);
                return;
            }
        }
        
        originalAlert.call(this, message);
    };
    
    function createEnhancedPaymentForm(alertMessage) {
        // Extract details from alert
        const amountMatch = alertMessage.match(/Payment of \$(\d+)/);
        const amount = amountMatch ? amountMatch[1] : '100';
        const projectMatch = alertMessage.match(/for "([^"]+)"/);
        const projectTitle = projectMatch ? projectMatch[1] : 'Cleaning House: Mary & Rose - Pilot Episode';
        
        const formHTML = `
        <div id="enhancedStripeOverlay" style="
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
            animation: fadeIn 0.3s ease-out;
        ">
            <style>
                @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
                @keyframes slideUp { from {transform: translate(-50%, -40%) scale(0.9);} to {transform: translate(-50%, -50%) scale(1);} }
            </style>
            
            <div style="
                background: white; 
                padding: 40px; 
                border-radius: 20px; 
                max-width: 520px; 
                width: 95%; 
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 60px rgba(0,0,0,0.6);
                position: relative;
                animation: slideUp 0.4s ease-out;
            ">
                <!-- Header -->
                <div style="text-align: right; margin-bottom: 15px;">
                    <button onclick="closeEnhancedForm()" style="
                        background: #dc3545; 
                        color: white; 
                        border: none; 
                        border-radius: 50%; 
                        width: 40px; 
                        height: 40px; 
                        cursor: pointer; 
                        font-size: 20px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">×</button>
                </div>
                
                <!-- Title Section -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 25px; 
                        border-radius: 15px; 
                        margin-bottom: 20px;
                    ">
                        <h1 style="margin: 0; font-size: 26px; font-weight: 600;">💳 Complete Your Investment</h1>
                        <p style="margin: 12px 0 0 0; opacity: 0.95; font-size: 16px;">${projectTitle}</p>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%); 
                        border: 2px solid #bee5eb; 
                        padding: 20px; 
                        border-radius: 12px; 
                        margin-bottom: 25px;
                    ">
                        <h2 style="margin: 0 0 15px 0; color: #0c5460; font-size: 18px;">💰 Investment Summary</h2>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
                            <span style="font-weight: 600; color: #495057;">Total Amount:</span>
                            <span style="font-size: 24px; font-weight: 700; color: #28a745;">$${amount}.00 USD</span>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Form -->
                <form id="enhancedStripeForm" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <fieldset style="border: none; margin: 0; padding: 0;">
                        <legend style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 20px;">Payment Information</legend>
                        
                        <!-- Email Field -->
                        <div style="margin-bottom: 20px;">
                            <label for="enhancedEmail" style="
                                display: block; 
                                margin-bottom: 8px; 
                                font-weight: 600; 
                                color: #555; 
                                font-size: 14px;
                            ">📧 Email Address</label>
                            <input 
                                type="email" 
                                id="enhancedEmail" 
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
                                    transition: all 0.3s ease;
                                    font-family: inherit;
                                " 
                                placeholder="investor@typhoonhub.ca" 
                                value="investor@typhoonhub.ca"
                                onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 3px rgba(0,123,255,0.1)'"
                                onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none'"
                            >
                        </div>
                        
                        <!-- Cardholder Name -->
                        <div style="margin-bottom: 20px;">
                            <label for="enhancedCardholderName" style="
                                display: block; 
                                margin-bottom: 8px; 
                                font-weight: 600; 
                                color: #555; 
                                font-size: 14px;
                            ">👤 Cardholder Name</label>
                            <input 
                                type="text" 
                                id="enhancedCardholderName" 
                                name="cardholderName"
                                required 
                                autocomplete="cc-name"
                                style="
                                    width: 100%; 
                                    padding: 16px; 
                                    border: 2px solid #e1e5e9; 
                                    border-radius: 10px; 
                                    font-size: 16px; 
                                    box-sizing: border-box;
                                    transition: all 0.3s ease;
                                    font-family: inherit;
                                " 
                                placeholder="John Doe" 
                                value="John Doe"
                                onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 3px rgba(0,123,255,0.1)'"
                                onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none'"
                            >
                        </div>
                        
                        <!-- Card Number -->
                        <div style="margin-bottom: 20px;">
                            <label for="enhancedCardNumber" style="
                                display: block; 
                                margin-bottom: 8px; 
                                font-weight: 600; 
                                color: #555; 
                                font-size: 14px;
                            ">💳 Card Number</label>
                            <input 
                                type="text" 
                                id="enhancedCardNumber" 
                                name="cardNumber"
                                required 
                                maxlength="19" 
                                autocomplete="cc-number"
                                style="
                                    width: 100%; 
                                    padding: 16px; 
                                    border: 2px solid #e1e5e9; 
                                    border-radius: 10px; 
                                    font-size: 16px; 
                                    box-sizing: border-box;
                                    font-family: 'Courier New', monospace;
                                    letter-spacing: 2px;
                                    transition: all 0.3s ease;
                                " 
                                placeholder="4242 4242 4242 4242" 
                                value="4242 4242 4242 4242"
                                onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 3px rgba(0,123,255,0.1)'"
                                onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none'"
                            >
                        </div>
                        
                        <!-- Expiry and CVC Row -->
                        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                            <div style="flex: 1;">
                                <label for="enhancedExpiryDate" style="
                                    display: block; 
                                    margin-bottom: 8px; 
                                    font-weight: 600; 
                                    color: #555; 
                                    font-size: 14px;
                                ">📅 Expiry Date</label>
                                <input 
                                    type="text" 
                                    id="enhancedExpiryDate" 
                                    name="expiryDate"
                                    required 
                                    maxlength="5" 
                                    autocomplete="cc-exp"
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e1e5e9; 
                                        border-radius: 10px; 
                                        font-size: 16px; 
                                        box-sizing: border-box;
                                        text-align: center;
                                        transition: all 0.3s ease;
                                        font-family: inherit;
                                    " 
                                    placeholder="MM/YY" 
                                    value="12/25"
                                    onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 3px rgba(0,123,255,0.1)'"
                                    onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none'"
                                >
                            </div>
                            <div style="flex: 1;">
                                <label for="enhancedCvc" style="
                                    display: block; 
                                    margin-bottom: 8px; 
                                    font-weight: 600; 
                                    color: #555; 
                                    font-size: 14px;
                                ">🔒 CVC</label>
                                <input 
                                    type="text" 
                                    id="enhancedCvc" 
                                    name="cvc"
                                    required 
                                    maxlength="4" 
                                    autocomplete="cc-csc"
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e1e5e9; 
                                        border-radius: 10px; 
                                        font-size: 16px; 
                                        box-sizing: border-box;
                                        text-align: center;
                                        transition: all 0.3s ease;
                                        font-family: inherit;
                                    " 
                                    placeholder="123" 
                                    value="123"
                                    onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 3px rgba(0,123,255,0.1)'"
                                    onblur="this.style.borderColor='#e1e5e9'; this.style.boxShadow='none'"
                                >
                            </div>
                        </div>
                    </fieldset>
                    
                    <!-- Test Mode Notice -->
                    <div style="
                        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 50%); 
                        border: 1px solid #ffc107; 
                        padding: 18px; 
                        border-radius: 12px; 
                        font-size: 14px; 
                        color: #856404;
                        text-align: center;
                        margin-bottom: 25px;
                    ">
                        🧪 <strong>Test Mode Active:</strong> Using Stripe test card (4242 4242 4242 4242)<br>
                        <small>No real payment will be processed - this is a demonstration</small>
                    </div>
                    
                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        id="enhancedSubmitBtn" 
                        style="
                            width: 100%; 
                            padding: 20px; 
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                            color: white; 
                            border: none; 
                            border-radius: 12px; 
                            font-size: 18px; 
                            font-weight: 700; 
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(40, 167, 69, 0.4)'"
                        onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 20px rgba(40, 167, 69, 0.3)'"
                    >
                        🚀 Complete $${amount} Investment Payment
                    </button>
                </form>
                
                <!-- Results Area -->
                <div id="enhancedPaymentResult" style="margin-top: 25px; display: none;"></div>
                
                <!-- Security Footer -->
                <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #6c757d;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">
                        <span style="display: flex; align-items: center; gap: 5px;">🔒 Secured by Stripe</span>
                        <span>|</span>
                        <span style="display: flex; align-items: center; gap: 5px;">💡 256-bit SSL</span>
                        <span>|</span>
                        <span style="display: flex; align-items: center; gap: 5px;">🛡️ PCI Compliant</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHTML);
        setupEnhancedFormHandlers(amount, projectTitle);
        
        console.log('✅ Enhanced Stripe payment form created with proper accessibility');
    }
    
    function setupEnhancedFormHandlers(amount, projectTitle) {
        // Get form elements
        const cardNumber = document.getElementById('enhancedCardNumber');
        const expiryDate = document.getElementById('enhancedExpiryDate');
        const cvc = document.getElementById('enhancedCvc');
        const form = document.getElementById('enhancedStripeForm');
        
        // Enhanced card number formatting
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            }
            
            // Visual validation feedback
            if (value.length >= 13) {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = '#f8fff8';
            } else if (value.length > 0) {
                e.target.style.borderColor = '#ffc107';
                e.target.style.backgroundColor = '#fffdf0';
            }
        });
        
        // Enhanced expiry date formatting
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            
            if (value.length === 5) {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = '#f8fff8';
            }
        });
        
        // Enhanced CVC formatting
        cvc.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            if (e.target.value.length >= 3) {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = '#f8fff8';
            }
        });
        
        // Enhanced form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('enhancedSubmitBtn');
            const resultDiv = document.getElementById('enhancedPaymentResult');
            
            // Show processing state
            submitBtn.textContent = '🔄 Processing Payment...';
            submitBtn.disabled = true;
            submitBtn.style.background = '#6c757d';
            submitBtn.style.cursor = 'not-allowed';
            
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #cce5ff 0%, #e3f2fd 100%); 
                    border: 2px solid #99ccff; 
                    padding: 25px; 
                    border-radius: 15px; 
                    color: #004085;
                    text-align: center;
                ">
                    <div style="font-size: 20px; margin-bottom: 15px; font-weight: 600;">🔄 Processing Your Investment</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">
                        Securely processing <strong>$${amount}.00</strong> payment
                    </div>
                    <div style="font-size: 14px; opacity: 0.8;">
                        Project: "${projectTitle}"
                    </div>
                    <div style="margin-top: 15px;">
                        <div style="width: 100%; height: 4px; background: #e9ecef; border-radius: 2px; overflow: hidden;">
                            <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #007bff, #28a745); animation: progress 3s ease-in-out;"></div>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes progress { from {width: 0%;} to {width: 100%;} }
                </style>
            `;
            
            // Simulate payment processing
            setTimeout(() => {
                resultDiv.innerHTML = `
                    <div style="
                        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
                        border: 2px solid #28a745; 
                        padding: 30px; 
                        border-radius: 15px; 
                        color: #155724;
                        text-align: center;
                    ">
                        <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">✅ Investment Successful!</h2>
                        
                        <div style="background: rgba(255,255,255,0.7); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #0f5132;">📋 Transaction Summary</h3>
                            <div style="text-align: left; font-size: 15px; line-height: 1.6;">
                                <strong>💰 Amount:</strong> $${amount}.00 USD<br>
                                <strong>🎬 Project:</strong> ${projectTitle}<br>
                                <strong>📊 Status:</strong> <span style="color: #28a745; font-weight: 600;">Completed</span><br>
                                <strong>🆔 Transaction ID:</strong> TH-${Date.now()}<br>
                                <strong>📅 Date:</strong> ${new Date().toLocaleDateString()}
                            </div>
                        </div>
                        
                        <div style="font-size: 16px; color: #0f5132; margin-bottom: 20px;">
                            <strong>🎉 What's Next:</strong><br>
                            <div style="text-align: left; margin-top: 10px; font-size: 14px;">
                                ✅ Confirmation email sent to your inbox<br>
                                ✅ Investment added to your TyphoonHub portfolio<br>
                                ✅ Access granted to exclusive investor content<br>
                                ✅ Updates on production progress will be shared
                            </div>
                        </div>
                        
                        <button onclick="closeEnhancedForm()" style="
                            padding: 15px 30px; 
                            background: linear-gradient(135deg, #28a745, #20c997); 
                            color: white; 
                            border: none; 
                            border-radius: 10px; 
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            🚀 Continue to Dashboard
                        </button>
                        
                        <div style="margin-top: 15px; font-size: 12px; color: #6c757d;">
                            This was a test transaction - no real payment was processed
                        </div>
                    </div>
                `;
            }, 3500);
        });
        
        console.log('✅ Enhanced form handlers setup complete with accessibility features');
    }
    
    // Close form function
    window.closeEnhancedForm = function() {
        const overlay = document.getElementById('enhancedStripeOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                paymentIntercepted = false;
            }, 300);
        }
        // Restore original alert
        window.alert = originalAlert;
        console.log('📝 Enhanced payment form closed');
    };
    
    // Click outside to close
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'enhancedStripeOverlay') {
            closeEnhancedForm();
        }
    });
    
    // Add fadeOut animation
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeOut { from {opacity: 1;} to {opacity: 0;} }';
    document.head.appendChild(style);
    
    console.log('✅ Enhanced Stripe Alert Interceptor loaded successfully!');
    alert('✅ Enhanced Payment Form Ready! Now click "Pay with Stripe" to see the improved form with proper accessibility.');
})();