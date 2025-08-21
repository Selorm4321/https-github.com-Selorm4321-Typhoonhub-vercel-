// TyphoonHub Console Fix - Multiple Execution Methods
// Use this if the browser console is not responding to pasted code

console.log('🔧 TyphoonHub Console Fix Starting...');

// Method 1: Immediate Execution
(function() {
    console.log('📝 Method 1: Immediate execution attempt');
    
    // Check if we can access basic DOM
    if (typeof document === 'undefined') {
        console.error('❌ Document not available');
        return false;
    }
    
    console.log('✅ Document is available');
    
    // Check if we're on the right page
    const currentURL = window.location.href;
    console.log('🌐 Current URL:', currentURL);
    
    // Look for payment modal
    const modal = document.querySelector('[data-modal="investment"]') || 
                  document.querySelector('.modal') || 
                  document.querySelector('[class*="modal"]') ||
                  document.querySelector('[id*="modal"]');
    
    if (modal) {
        console.log('✅ Payment modal found:', modal);
        return true;
    } else {
        console.log('⚠️ Payment modal not found. Available elements:');
        console.log('- Modals with class containing "modal":', document.querySelectorAll('[class*="modal"]').length);
        console.log('- Elements with id containing "modal":', document.querySelectorAll('[id*="modal"]').length);
        console.log('- Investment elements:', document.querySelectorAll('[data-modal="investment"]').length);
        return false;
    }
})();

// Method 2: Delayed Execution (in case page is still loading)
setTimeout(function() {
    console.log('📝 Method 2: Delayed execution attempt (1 second)');
    
    // Try to inject the form
    const modal = document.querySelector('[data-modal="investment"]') || 
                  document.querySelector('.modal') || 
                  document.querySelector('[class*="modal"]') ||
                  document.querySelector('[id*="modal"]');
    
    if (modal && !modal.querySelector('#paymentForm')) {
        console.log('🚀 Attempting to inject payment form...');
        injectPaymentForm(modal);
    }
}, 1000);

// Method 3: Event-based execution (when DOM is ready)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📝 Method 3: DOMContentLoaded execution');
        attemptFormInjection();
    });
} else {
    console.log('📝 Method 3: DOM already ready, executing immediately');
    attemptFormInjection();
}

// Method 4: Manual trigger function
window.fixTyphoonHubPayment = function() {
    console.log('📝 Method 4: Manual trigger function called');
    attemptFormInjection();
};

// Main form injection function
function injectPaymentForm(modal) {
    console.log('💉 Injecting payment form into modal:', modal);
    
    // Check if form already exists
    if (modal.querySelector('#paymentForm')) {
        console.log('⚠️ Payment form already exists');
        return;
    }
    
    // Create the form HTML
    const formHTML = `
    <div id="paymentFormContainer" style="padding: 20px; background: rgba(255,255,255,0.95); border-radius: 15px; margin: 15px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-bottom: 20px; text-align: center; font-family: Arial, sans-serif;">💳 Complete Your Investment</h3>
        
        <form id="paymentForm" style="max-width: 400px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">📧 Email Address</label>
                <input type="email" id="email" required 
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                       placeholder="your@email.com">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">👤 Cardholder Name</label>
                <input type="text" id="cardholderName" required 
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                       placeholder="John Doe">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">💳 Card Number</label>
                <input type="text" id="cardNumber" required maxlength="19" 
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                       placeholder="4242 4242 4242 4242">
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">📅 Expiry</label>
                    <input type="text" id="expiryDate" required maxlength="5" 
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                           placeholder="12/25">
                </div>
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">🔒 CVC</label>
                    <input type="text" id="cvc" required maxlength="4" 
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                           placeholder="123">
                </div>
            </div>
            
            <button type="submit" 
                    style="width: 100%; padding: 15px; background: linear-gradient(45deg, #28a745, #20c997); color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; box-sizing: border-box;"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)';"
                    onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='none';">
                🚀 Complete Investment Payment
            </button>
            
            <div style="margin-top: 15px; padding: 12px; background: #e3f2fd; border-radius: 8px; font-size: 13px; color: #1565c0; text-align: center;">
                🧪 <strong>Test Mode:</strong> Use card 4242 4242 4242 4242, any future date, any CVC
            </div>
        </form>
        
        <div id="paymentResult" style="margin-top: 20px; padding: 15px; border-radius: 8px; display: none; text-align: center;"></div>
    </div>
    `;
    
    // Hide the "Processing..." message
    const processingMsg = modal.querySelector('p');
    if (processingMsg && processingMsg.textContent.includes('Processing')) {
        processingMsg.style.display = 'none';
        console.log('📝 Hidden processing message');
    }
    
    // Find the best place to insert the form
    const modalBody = modal.querySelector('.modal-body') || 
                      modal.querySelector('[class*="content"]') || 
                      modal.querySelector('[class*="body"]') || 
                      modal;
    
    // Insert the form
    modalBody.insertAdjacentHTML('beforeend', formHTML);
    console.log('✅ Payment form HTML inserted');
    
    // Add form validation and formatting
    setupFormValidation();
    console.log('✅ Form validation setup complete');
    
    // Add form submission handler
    setupFormSubmission();
    console.log('✅ Form submission handler setup complete');
    
    console.log('🎉 Payment form injection complete!');
}

function setupFormValidation() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvc = document.getElementById('cvc');
    
    if (!cardNumber || !expiryDate || !cvc) {
        console.error('❌ Form fields not found for validation setup');
        return;
    }
    
    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length <= 19) {
            e.target.value = formattedValue;
        }
    });
    
    // Format expiry date MM/YY
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Format CVC (numbers only)
    cvc.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    console.log('✅ Input formatters added');
}

function setupFormSubmission() {
    const form = document.getElementById('paymentForm');
    if (!form) {
        console.error('❌ Payment form not found for submission setup');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted, processing payment...');
        
        const resultDiv = document.getElementById('paymentResult');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<div style="color: #007bff; font-weight: bold;">🔄 Processing payment...</div>';
            
            // Simulate payment processing
            setTimeout(() => {
                resultDiv.innerHTML = `
                    <div style="color: #28a745;">
                        <h4 style="margin: 0 0 10px 0;">✅ Payment Form Working!</h4>
                        <p style="margin: 5px 0; font-size: 14px;"><strong>Next Steps:</strong></p>
                        <ul style="text-align: left; margin: 10px 0; padding-left: 20px; font-size: 14px;">
                            <li>✅ Form fields are now functional</li>
                            <li>🔗 Connect to real Stripe API</li>
                            <li>🚀 Deploy to production environment</li>
                        </ul>
                        <p style="font-size: 12px; color: #666; margin-top: 15px;">This is a test transaction - no real payment was processed.</p>
                    </div>
                `;
                console.log('✅ Payment simulation complete');
            }, 2000);
        }
    });
    
    console.log('✅ Form submission handler added');
}

function attemptFormInjection() {
    console.log('🔍 Attempting to find payment modal...');
    
    // Try multiple selectors to find the modal
    const selectors = [
        '[data-modal="investment"]',
        '.modal',
        '[class*="modal"]',
        '[id*="modal"]',
        '[class*="popup"]',
        '[id*="popup"]',
        '[class*="dialog"]',
        '[id*="dialog"]'
    ];
    
    let modal = null;
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.log(`Found ${elements.length} elements with selector: ${selector}`);
            // Try to find one that's visible or contains payment-related content
            for (const element of elements) {
                if (element.offsetParent !== null || element.textContent.toLowerCase().includes('invest') || element.textContent.toLowerCase().includes('payment')) {
                    modal = element;
                    console.log('✅ Found likely payment modal:', modal);
                    break;
                }
            }
            if (modal) break;
        }
    }
    
    if (modal) {
        injectPaymentForm(modal);
    } else {
        console.log('⚠️ No payment modal found. Available elements:');
        console.log('- All elements with class containing "modal":', document.querySelectorAll('[class*="modal"]').length);
        console.log('- All elements with id containing "modal":', document.querySelectorAll('[id*="modal"]').length);
        console.log('- All elements with "investment" in data-modal:', document.querySelectorAll('[data-modal="investment"]').length);
        
        console.log('💡 To manually fix:');
        console.log('1. Open the investment modal first');
        console.log('2. Then run: fixTyphoonHubPayment()');
    }
}

// Console diagnostic functions
window.debugConsole = function() {
    console.log('🔍 Console Diagnostic Report:');
    console.log('- JavaScript execution: ✅ Working');
    console.log('- Document access: ✅ Available');
    console.log('- Current URL:', window.location.href);
    console.log('- Page title:', document.title);
    console.log('- DOM ready state:', document.readyState);
    console.log('- Available modals:', document.querySelectorAll('[class*="modal"], [id*="modal"]').length);
    
    return 'Console diagnostic complete';
};

// Final execution attempt
console.log('🎯 TyphoonHub Console Fix loaded successfully!');
console.log('💡 Available functions:');
console.log('- fixTyphoonHubPayment() - Manually inject payment form');
console.log('- debugConsole() - Run diagnostic check');
console.log('📝 If console is not responding, try the bookmarklet method instead.');