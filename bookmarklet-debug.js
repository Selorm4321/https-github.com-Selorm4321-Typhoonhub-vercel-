// Bookmarklet Debug Tool - Test each step individually
// Copy and paste these one by one in the browser console to debug

// TEST 1: Basic JavaScript execution
console.log('🧪 TEST 1: JavaScript execution test');
alert('✅ JavaScript is working!');

// TEST 2: Check current page
console.log('🧪 TEST 2: Current page check');
console.log('Current URL:', window.location.href);
console.log('Page title:', document.title);
console.log('Is investment page?', window.location.href.includes('investment'));

// TEST 3: Look for modal elements
console.log('🧪 TEST 3: Modal detection');
const modal1 = document.querySelector('[data-modal="investment"]');
const modal2 = document.querySelector('.modal');
const modal3 = document.querySelector('[class*="modal"]');
const modal4 = document.querySelector('[id*="modal"]');

console.log('Modal with data-modal="investment":', modal1);
console.log('Modal with class="modal":', modal2);
console.log('Modal with class containing "modal":', modal3);
console.log('Modal with id containing "modal":', modal4);

// Show all elements that might be modals
const allModals = document.querySelectorAll('[class*="modal"], [id*="modal"], [data-modal]');
console.log('All potential modal elements:', allModals);

// TEST 4: Check for any popup/dialog elements
console.log('🧪 TEST 4: Other popup elements');
const popups = document.querySelectorAll('[class*="popup"], [class*="dialog"], [role="dialog"]');
console.log('Popup/dialog elements:', popups);

// TEST 5: Look for Stripe-related elements
console.log('🧪 TEST 5: Stripe elements');
const stripeElements = document.querySelectorAll('[class*="stripe"], [id*="stripe"], [class*="payment"]');
console.log('Stripe/payment elements:', stripeElements);

// TEST 6: Check DOM structure around investment content
console.log('🧪 TEST 6: Investment content');
const investElements = document.querySelectorAll('*');
const investContent = Array.from(investElements).filter(el => 
    el.textContent && (
        el.textContent.includes('Invest') || 
        el.textContent.includes('Payment') || 
        el.textContent.includes('Stripe') ||
        el.textContent.includes('Processing')
    )
);
console.log('Elements with investment/payment text:', investContent);

console.log('🎯 Debug complete! Check the console output above.');