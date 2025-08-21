// DevTools Method - Use this in browser console if bookmarklet fails
// Instructions: Copy and paste this entire code into the browser console and press Enter

(function() {
    console.log('🚀 TyphoonHub Payment Form Injector (DevTools Method)');
    
    // Step 1: Check if we're in the right place
    console.log('🔍 Step 1: Environment check');
    console.log('- Current URL:', window.location.href);
    console.log('- Page title:', document.title);
    
    // Step 2: Find any modal or popup
    console.log('🔍 Step 2: Finding modal elements');
    
    const selectors = [
        '[data-modal="investment"]',
        '.modal',
        '[class*="modal"]',
        '[id*="modal"]',
        '[class*="popup"]',
        '[id*="popup"]',
        '[role="dialog"]',
        '[class*="dialog"]'
    ];
    
    let targetModal = null;
    
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`- Found ${elements.length} elements for selector: ${selector}`);
        
        if (elements.length > 0) {
            // Check each element to see if it's visible or contains relevant content
            for (const element of elements) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                const hasInvestText = element.textContent.toLowerCase().includes('invest') || 
                                    element.textContent.toLowerCase().includes('payment') ||
                                    element.textContent.toLowerCase().includes('stripe');
                
                console.log(`  - Element ${element.tagName} visible: ${isVisible}, has invest text: ${hasInvestText}`);
                
                if (isVisible || hasInvestText) {
                    targetModal = element;
                    console.log('✅ Found target modal:', element);
                    break;
                }
            }
        }
        
        if (targetModal) break;
    }
    
    // Step 3: If no modal found, look for any container with payment-related content
    if (!targetModal) {
        console.log('🔍 Step 3: Looking for payment content containers');
        const allElements = document.querySelectorAll('*');
        
        for (const element of allElements) {
            const text = element.textContent || '';
            if (text.includes('Processing') || text.includes('Pay ') || text.includes('Stripe')) {
                console.log('📝 Found element with payment text:', element);
                console.log('  - Text content:', text.substring(0, 100));
                console.log('  - Classes:', element.className);
                console.log('  - ID:', element.id);
                
                // Use the parent container if this is just text
                targetModal = element.closest('[class*="modal"]') || 
                             element.closest('[id*="modal"]') || 
                             element.closest('.popup') || 
                             element.parentElement;
                
                if (targetModal) {
                    console.log('✅ Using parent container as modal:', targetModal);
                    break;
                }
            }
        }
    }
    
    // Step 4: Inject the form if we found a target
    if (targetModal) {
        console.log('🚀 Step 4: Injecting payment form');
        
        // Check if form already exists
        if (targetModal.querySelector('#paymentForm')) {
            console.log('⚠️ Payment form already exists');
            alert('✅ Payment form already exists in the modal!');
            return;
        }
        
        // Create the form HTML
        const formHTML = `
        <div id="paymentFormContainer" style="
            padding: 20px; 
            background: rgba(255,255,255,0.98); 
            border-radius: 15px; 
            margin: 15px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 2px solid #007bff;
        ">
            <h3 style="color: #333; margin-bottom: 20px; text-align: center; font-family: Arial, sans-serif;">
                💳 TyphoonHub Payment Form (INJECTED)
            </h3>
            
            <div style="background: #e8f4fd; padding: 10px; border-radius: 8px; margin-bottom: 15px; text-align: center; color: #0056b3;">
                <strong>🎉 SUCCESS!</strong> Credit card form has been injected into the modal!
            </div>
            
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
                           placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242">
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">📅 Expiry</label>
                        <input type="text" id="expiryDate" required maxlength="5" 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                               placeholder="12/25" value="12/25">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; color: #555; font-weight: bold; font-size: 14px;">🔒 CVC</label>
                        <input type="text" id="cvc" required maxlength="4" 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box;" 
                               placeholder="123" value="123">
                    </div>
                </div>
                
                <button type="submit" 
                        style="width: 100%; padding: 15px; background: linear-gradient(45deg, #28a745, #20c997); color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; box-sizing: border-box;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.3)';"
                        onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='none';">
                    🚀 Complete Investment Payment
                </button>
                
                <div style="margin-top: 15px; padding: 12px; background: #e3f2fd; border-radius: 8px; font-size: 13px; color: #1565c0; text-align: center;">
                    🧪 <strong>Test Mode:</strong> Form pre-filled with test data - ready to submit!
                </div>
            </form>
            
            <div id="paymentResult" style="margin-top: 20px; padding: 15px; border-radius: 8px; display: none; text-align: center;"></div>
        </div>
        `;
        
        // Hide any processing messages
        const processingElements = targetModal.querySelectorAll('*');
        for (const element of processingElements) {
            if (element.textContent && element.textContent.includes('Processing')) {
                element.style.display = 'none';
                console.log('📝 Hidden processing message:', element);
            }
        }
        
        // Insert the form
        targetModal.insertAdjacentHTML('beforeend', formHTML);
        console.log('✅ Form HTML inserted');
        
        // Add form handlers
        const form = document.getElementById('paymentForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('📝 Form submitted');
                
                const resultDiv = document.getElementById('paymentResult');
                if (resultDiv) {
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = '<div style="color: #007bff; font-weight: bold;">🔄 Processing payment...</div>';
                    
                    setTimeout(() => {
                        resultDiv.innerHTML = `
                            <div style="color: #28a745;">
                                <h4 style="margin: 0 0 10px 0;">✅ Payment Form is Working!</h4>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Success Steps Completed:</strong></p>
                                <ul style="text-align: left; margin: 10px 0; padding-left: 20px; font-size: 14px;">
                                    <li>✅ Form injection successful</li>
                                    <li>✅ Form validation working</li>
                                    <li>✅ Form submission handling active</li>
                                    <li>🔗 Ready for real Stripe API integration</li>
                                </ul>
                                <p style="font-size: 12px; color: #666; margin-top: 15px;">This was a test - no real payment was processed.</p>
                            </div>
                        `;
                        console.log('✅ Payment simulation complete');
                    }, 2000);
                }
            });
            console.log('✅ Form submission handler added');
        }
        
        // Add input formatting
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvc = document.getElementById('cvc');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
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
        
        if (cvc) {
            cvc.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
        
        console.log('✅ Input formatters added');
        
        alert('🎉 SUCCESS! Payment form has been injected into the modal. Scroll down to see the credit card fields!');
        
    } else {
        console.log('❌ No suitable modal found');
        alert('❌ Could not find the payment modal. Make sure the investment modal is open first.');
        
        // Show debug info
        console.log('🔍 Debug: Available elements that might be relevant:');
        const debugElements = document.querySelectorAll('div, section, article');
        for (const element of debugElements) {
            if (element.textContent && element.textContent.toLowerCase().includes('invest')) {
                console.log('- Element with "invest" text:', element);
            }
        }
    }
})();

console.log('🎯 DevTools injection script loaded. If you see this message, copy and paste the entire script above into the console.');