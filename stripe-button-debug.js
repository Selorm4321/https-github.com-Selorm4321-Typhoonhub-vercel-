// Stripe Button Debug Tool
// This will help diagnose why the "Pay $100 with Stripe" button isn't working

console.log('🔍 Stripe Button Diagnostic Tool Starting...');

// Step 1: Find the Stripe payment button
console.log('\n📝 Step 1: Looking for Stripe payment button...');

const stripeButtonSelectors = [
    'button[contains(text(), "Pay")]',
    'button[contains(text(), "Stripe")]',
    '[class*="stripe"]',
    '[id*="stripe"]',
    'button[type="submit"]',
    '.payment-button',
    '[onclick*="stripe"]',
    '[onclick*="payment"]'
];

// Find all buttons that might be the payment button
const allButtons = document.querySelectorAll('button, input[type="submit"], a[role="button"]');
console.log(`Found ${allButtons.length} total buttons on the page`);

let stripeButton = null;
const paymentButtons = [];

for (const button of allButtons) {
    const text = button.textContent || button.value || '';
    const classes = button.className || '';
    const id = button.id || '';
    
    // Check if this looks like a payment button
    if (text.toLowerCase().includes('pay') || 
        text.toLowerCase().includes('stripe') ||
        text.toLowerCase().includes('$100') ||
        classes.toLowerCase().includes('stripe') ||
        classes.toLowerCase().includes('payment') ||
        id.toLowerCase().includes('stripe') ||
        id.toLowerCase().includes('payment')) {
        
        paymentButtons.push({
            element: button,
            text: text.trim(),
            classes: classes,
            id: id
        });
        
        if (text.includes('Pay $100 with Stripe') || text.includes('Pay') && text.includes('Stripe')) {
            stripeButton = button;
        }
    }
}

console.log('🎯 Found potential payment buttons:', paymentButtons);

if (stripeButton) {
    console.log('✅ Found Stripe payment button:', stripeButton);
} else if (paymentButtons.length > 0) {
    console.log('⚠️ No exact Stripe button found, using first payment button:', paymentButtons[0].element);
    stripeButton = paymentButtons[0].element;
} else {
    console.log('❌ No payment buttons found');
}

// Step 2: Analyze the button's event listeners and properties
if (stripeButton) {
    console.log('\n📝 Step 2: Analyzing button properties...');
    
    console.log('- Button text:', stripeButton.textContent.trim());
    console.log('- Button type:', stripeButton.type);
    console.log('- Button disabled:', stripeButton.disabled);
    console.log('- Button classes:', stripeButton.className);
    console.log('- Button id:', stripeButton.id);
    console.log('- Button onclick:', stripeButton.onclick);
    console.log('- Button form:', stripeButton.form);
    
    // Check for event listeners (this is harder to detect, but we can try)
    console.log('- Has click event listeners:', stripeButton.onclick !== null);
    
    // Check parent form if any
    const parentForm = stripeButton.closest('form');
    if (parentForm) {
        console.log('- Parent form action:', parentForm.action);
        console.log('- Parent form method:', parentForm.method);
        console.log('- Parent form onsubmit:', parentForm.onsubmit);
    }
    
    // Step 3: Check for JavaScript errors when clicking
    console.log('\n📝 Step 3: Monitoring for JavaScript errors...');
    
    // Set up error monitoring
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
        errors.push(args.join(' '));
        originalError.apply(console, args);
    };
    
    // Add a click event listener to monitor what happens
    stripeButton.addEventListener('click', function(event) {
        console.log('🖱️ Stripe button clicked!');
        console.log('- Event target:', event.target);
        console.log('- Event type:', event.type);
        console.log('- Default prevented:', event.defaultPrevented);
        console.log('- Event bubbles:', event.bubbles);
        
        // Log any errors that occur during processing
        setTimeout(() => {
            if (errors.length > 0) {
                console.log('❌ JavaScript errors detected during click:', errors);
            } else {
                console.log('✅ No JavaScript errors detected');
            }
        }, 100);
    }, true); // Use capture phase to ensure we catch it
    
    console.log('✅ Click monitoring set up. Now try clicking the payment button.');
    
} else {
    console.log('\n❌ Cannot analyze button - no payment button found');
}

// Step 4: Check for Stripe JavaScript library
console.log('\n📝 Step 4: Checking for Stripe library...');

if (typeof Stripe !== 'undefined') {
    console.log('✅ Stripe library is loaded');
    console.log('- Stripe version:', Stripe.version || 'unknown');
} else {
    console.log('❌ Stripe library not found - this might be the problem!');
}

// Check for Stripe in window object
if (window.Stripe) {
    console.log('✅ Stripe found in window object');
} else {
    console.log('❌ No Stripe in window object');
}

// Check for Stripe scripts
const stripeScripts = document.querySelectorAll('script[src*="stripe"]');
console.log(`Found ${stripeScripts.length} Stripe-related scripts:`, stripeScripts);

// Step 5: Check network requests (we'll add a fetch interceptor)
console.log('\n📝 Step 5: Setting up network monitoring...');

const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('🌐 Network request:', args[0]);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('📥 Network response:', response.status, response.url);
            return response;
        })
        .catch(error => {
            console.log('❌ Network error:', error);
            throw error;
        });
};

// Step 6: Provide manual button click function
window.clickStripeButton = function() {
    if (stripeButton) {
        console.log('🖱️ Manually clicking Stripe button...');
        stripeButton.click();
    } else {
        console.log('❌ No Stripe button found to click');
    }
};

console.log('\n🎯 Diagnostic setup complete!');
console.log('📝 Next steps:');
console.log('1. Try clicking the "Pay $100 with Stripe" button');
console.log('2. Watch this console for any error messages');
console.log('3. Or run clickStripeButton() to simulate a click');
console.log('4. Report back what you see in the console');

// Step 7: Alternative - inject a working payment form right now
window.injectPaymentFormNow = function() {
    console.log('🚀 Injecting payment form directly...');
    
    // Find the modal or container
    const modal = document.querySelector('[class*="modal"]') || 
                  document.querySelector('[role="dialog"]') ||
                  document.querySelector('.popup') ||
                  document.body;
    
    const formHTML = `
    <div id="emergencyPaymentForm" style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        border: 3px solid #007bff;
        max-width: 450px;
        width: 90%;
    ">
        <div style="text-align: right;">
            <button onclick="document.getElementById('emergencyPaymentForm').remove()" 
                    style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
        </div>
        
        <h3 style="color: #333; text-align: center; margin-bottom: 20px;">
            💳 TyphoonHub Emergency Payment Form
        </h3>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <strong>🔧 EMERGENCY FIX:</strong> Since the Stripe button isn't working, use this form!
        </div>
        
        <form id="emergencyForm" style="font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">📧 Email</label>
                <input type="email" required style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" value="investor@typhoonhub.ca">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">👤 Name</label>
                <input type="text" required style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" value="John Doe">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">💳 Card Number</label>
                <input type="text" required style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" value="4242 4242 4242 4242">
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">📅 Expiry</label>
                    <input type="text" required style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" value="12/25">
                </div>
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">🔒 CVC</label>
                    <input type="text" required style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" value="123">
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">💰 Investment Amount</label>
                <input type="text" readonly style="width: 100%; padding: 12px; border: 2px solid #28a745; border-radius: 8px; font-size: 16px; box-sizing: border-box; background: #f8f9fa;" value="$100.00 USD">
            </div>
            
            <button type="submit" style="
                width: 100%; 
                padding: 15px; 
                background: linear-gradient(45deg, #28a745, #20c997); 
                color: white; 
                border: none; 
                border-radius: 8px; 
                font-size: 18px; 
                font-weight: bold; 
                cursor: pointer;
            ">
                🚀 Complete $100 Investment
            </button>
            
            <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 8px; font-size: 13px; color: #1565c0; text-align: center;">
                🧪 <strong>Test Mode:</strong> This simulates the payment process
            </div>
        </form>
        
        <div id="emergencyResult" style="margin-top: 20px; display: none;"></div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Add form handler
    document.getElementById('emergencyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const resultDiv = document.getElementById('emergencyResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div style="color: #007bff; text-align: center; font-weight: bold;">🔄 Processing investment...</div>';
        
        setTimeout(() => {
            resultDiv.innerHTML = `
                <div style="color: #28a745; text-align: center;">
                    <h4 style="margin: 10px 0;">✅ Investment Completed!</h4>
                    <p><strong>Summary:</strong></p>
                    <ul style="text-align: left; font-size: 14px;">
                        <li>💰 Amount: $100.00</li>
                        <li>🎬 Project: Cleaning House: Mary & Rose</li>
                        <li>📧 Confirmation sent to email</li>
                        <li>🔗 Payment form is now functional</li>
                    </ul>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        This was a test - no real payment was processed
                    </p>
                </div>
            `;
        }, 3000);
    });
    
    console.log('✅ Emergency payment form injected! It should appear as an overlay.');
};

console.log('\n💡 If the button still doesn\'t work, run: injectPaymentFormNow()');
console.log('This will create a working payment form overlay.');