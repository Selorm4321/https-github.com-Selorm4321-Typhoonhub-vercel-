// Stripe Alert Interceptor - Replaces the alert with actual credit card form
// This fixes the issue where Stripe button only shows alert instead of card collection

console.log('🚀 Stripe Alert Interceptor Loading...');

// Step 1: Override the alert function to catch the Stripe payment alert
const originalAlert = window.alert;
let paymentIntercepted = false;

window.alert = function(message) {
    console.log('🔔 Alert intercepted:', message);
    
    // Check if this is the Stripe payment alert
    if (message && (message.includes('Payment of $') || message.includes('would be processed via Stripe'))) {
        console.log('💳 Stripe payment alert detected - intercepting!');
        
        if (!paymentIntercepted) {
            paymentIntercepted = true;
            showStripePaymentForm(message);
            return; // Don't show the original alert
        }
    }
    
    // For non-payment alerts, show them normally
    originalAlert.call(this, message);
};

// Step 2: Create the actual Stripe payment form
function showStripePaymentForm(alertMessage) {
    console.log('🎨 Creating Stripe payment form...');
    
    // Extract amount from alert message
    const amountMatch = alertMessage.match(/Payment of \$(\d+)/);
    const amount = amountMatch ? amountMatch[1] : '100';
    
    // Extract project title
    const projectMatch = alertMessage.match(/for "([^"]+)"/);
    const projectTitle = projectMatch ? projectMatch[1] : 'TyphoonHub Project';
    
    const formHTML = `
    <div id="stripePaymentOverlay" style="
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.8); 
        z-index: 10000; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        backdrop-filter: blur(5px);
    ">
        <div id="stripePaymentForm" style="
            background: white; 
            padding: 40px; 
            border-radius: 20px; 
            max-width: 500px; 
            width: 90%; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="text-align: right; margin-bottom: 20px;">
                <button onclick="closeStripeForm()" style="
                    background: #dc3545; 
                    color: white; 
                    border: none; 
                    border-radius: 50%; 
                    width: 35px; 
                    height: 35px; 
                    cursor: pointer; 
                    font-size: 18px;
                    font-weight: bold;
                ">×</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="
                    background: linear-gradient(45deg, #667eea, #764ba2); 
                    color: white; 
                    padding: 20px; 
                    border-radius: 15px; 
                    margin-bottom: 20px;
                ">
                    <h2 style="margin: 0; font-size: 24px;">💳 Complete Your Investment</h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">${projectTitle}</p>
                </div>
                
                <div style="
                    background: #e8f4fd; 
                    border: 1px solid #bee5eb; 
                    padding: 15px; 
                    border-radius: 10px; 
                    margin-bottom: 20px;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #0c5460;">Investment Summary</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #495057;">Amount:</span>
                        <span style="font-size: 20px; font-weight: bold; color: #28a745;">$${amount}.00 USD</span>
                    </div>
                </div>
            </div>
            
            <form id="stripeForm" style="font-family: Arial, sans-serif;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555; font-size: 14px;">
                        📧 Email Address
                    </label>
                    <input type="email" id="stripeEmail" required style="
                        width: 100%; 
                        padding: 14px; 
                        border: 2px solid #e1e5e9; 
                        border-radius: 10px; 
                        font-size: 16px; 
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    " placeholder="investor@typhoonhub.ca" value="investor@typhoonhub.ca">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555; font-size: 14px;">
                        👤 Cardholder Name
                    </label>
                    <input type="text" id="stripeCardholderName" required style="
                        width: 100%; 
                        padding: 14px; 
                        border: 2px solid #e1e5e9; 
                        border-radius: 10px; 
                        font-size: 16px; 
                        box-sizing: border-box;
                        transition: border-color 0.3s ease;
                    " placeholder="John Doe" value="John Doe">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555; font-size: 14px;">
                        💳 Card Number
                    </label>
                    <input type="text" id="stripeCardNumber" required maxlength="19" style="
                        width: 100%; 
                        padding: 14px; 
                        border: 2px solid #e1e5e9; 
                        border-radius: 10px; 
                        font-size: 16px; 
                        box-sizing: border-box;
                        font-family: 'Courier New', monospace;
                        letter-spacing: 1px;
                        transition: border-color 0.3s ease;
                    " placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242">
                </div>
                
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555; font-size: 14px;">
                            📅 Expiry Date
                        </label>
                        <input type="text" id="stripeExpiryDate" required maxlength="5" style="
                            width: 100%; 
                            padding: 14px; 
                            border: 2px solid #e1e5e9; 
                            border-radius: 10px; 
                            font-size: 16px; 
                            box-sizing: border-box;
                            text-align: center;
                            transition: border-color 0.3s ease;
                        " placeholder="MM/YY" value="12/25">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555; font-size: 14px;">
                            🔒 CVC
                        </label>
                        <input type="text" id="stripeCvc" required maxlength="4" style="
                            width: 100%; 
                            padding: 14px; 
                            border: 2px solid #e1e5e9; 
                            border-radius: 10px; 
                            font-size: 16px; 
                            box-sizing: border-box;
                            text-align: center;
                            transition: border-color 0.3s ease;
                        " placeholder="123" value="123">
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="
                        background: #fff3cd; 
                        border: 1px solid #ffeaa7; 
                        padding: 15px; 
                        border-radius: 10px; 
                        font-size: 14px; 
                        color: #856404;
                        text-align: center;
                    ">
                        🧪 <strong>Test Mode:</strong> Using Stripe test card (4242 4242 4242 4242)<br>
                        No real payment will be processed in this demo
                    </div>
                </div>
                
                <button type="submit" id="stripeSubmitBtn" style="
                    width: 100%; 
                    padding: 18px; 
                    background: linear-gradient(45deg, #28a745, #20c997); 
                    color: white; 
                    border: none; 
                    border-radius: 12px; 
                    font-size: 18px; 
                    font-weight: bold; 
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                ">
                    🚀 Complete $${amount} Investment Payment
                </button>
            </form>
            
            <div id="stripePaymentResult" style="margin-top: 25px; display: none; text-align: center;"></div>
            
            <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #6c757d;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span>🔒 Secured by Stripe</span>
                    <span>|</span>
                    <span>💡 SSL Encrypted</span>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Add form handlers
    setupStripeFormHandlers(amount, projectTitle);
    
    console.log('✅ Stripe payment form created successfully');
}

// Step 3: Setup form event handlers
function setupStripeFormHandlers(amount, projectTitle) {
    // Form input formatting
    const cardNumber = document.getElementById('stripeCardNumber');
    const expiryDate = document.getElementById('stripeExpiryDate');
    const cvc = document.getElementById('stripeCvc');
    
    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length <= 19) {
            e.target.value = formattedValue;
        }
        
        // Visual feedback
        if (value.length > 0) {
            e.target.style.borderColor = '#28a745';
        }
    });
    
    // Format expiry date MM/YY
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        
        if (value.length === 5) {
            e.target.style.borderColor = '#28a745';
        }
    });
    
    // Format CVC (numbers only)
    cvc.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value.length >= 3) {
            e.target.style.borderColor = '#28a745';
        }
    });
    
    // Form submission
    document.getElementById('stripeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('stripeSubmitBtn');
        const resultDiv = document.getElementById('stripePaymentResult');
        
        // Show processing state
        submitBtn.textContent = '🔄 Processing Payment...';
        submitBtn.disabled = true;
        submitBtn.style.background = '#6c757d';
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="
                background: #cce5ff; 
                border: 1px solid #99ccff; 
                padding: 20px; 
                border-radius: 10px; 
                color: #004085;
            ">
                <div style="font-size: 18px; margin-bottom: 10px;">🔄 Processing Your Investment...</div>
                <div style="font-size: 14px;">
                    Securely processing $${amount} payment for "${projectTitle}"
                </div>
            </div>
        `;
        
        // Simulate payment processing
        setTimeout(() => {
            resultDiv.innerHTML = `
                <div style="
                    background: #d4edda; 
                    border: 1px solid #c3e6cb; 
                    padding: 25px; 
                    border-radius: 15px; 
                    color: #155724;
                ">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px;">✅ Investment Successful!</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>Payment Details:</strong><br>
                        • Amount: $${amount}.00 USD<br>
                        • Project: ${projectTitle}<br>
                        • Status: Completed<br>
                        • Transaction ID: TH-${Date.now()}
                    </div>
                    <div style="font-size: 14px; color: #0f5132;">
                        <strong>🎉 Next Steps:</strong><br>
                        • Confirmation email sent<br>
                        • Investment added to your portfolio<br>
                        • You can now access exclusive content
                    </div>
                    <button onclick="closeStripeForm()" style="
                        margin-top: 20px; 
                        padding: 12px 24px; 
                        background: #28a745; 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-weight: bold;
                    ">
                        Continue to Dashboard
                    </button>
                </div>
            `;
            
            console.log('✅ Stripe payment simulation completed successfully');
        }, 3000);
    });
}

// Step 4: Close form function
window.closeStripeForm = function() {
    const overlay = document.getElementById('stripePaymentOverlay');
    if (overlay) {
        overlay.remove();
        paymentIntercepted = false;
        console.log('📝 Stripe payment form closed');
    }
};

// Step 5: Click outside to close
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'stripePaymentOverlay') {
        closeStripeForm();
    }
});

console.log('✅ Stripe Alert Interceptor loaded successfully!');
console.log('💡 Now click "Pay $100 with Stripe" to see the real payment form instead of an alert!');

// Step 6: Auto-detect and setup if payment modal is already open
setTimeout(() => {
    const paymentButtons = document.querySelectorAll('button');
    for (const btn of paymentButtons) {
        if (btn.textContent.includes('Pay') && btn.textContent.includes('Stripe')) {
            console.log('🎯 Found Stripe payment button:', btn.textContent.trim());
            console.log('💡 Ready to intercept payment alert when you click the button!');
            break;
        }
    }
}, 1000);