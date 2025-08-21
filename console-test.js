// Simple Console Test - Use this to verify console is working
console.log('🧪 Console Test Starting...');

// Test 1: Basic console functionality
console.log('✅ Test 1 Passed: Basic console.log works');

// Test 2: Variable assignment
let testVar = 'Console is working!';
console.log('✅ Test 2 Passed: Variable assignment -', testVar);

// Test 3: DOM access
if (typeof document !== 'undefined') {
    console.log('✅ Test 3 Passed: Document is accessible');
    console.log('  - Page title:', document.title);
    console.log('  - Current URL:', window.location.href);
} else {
    console.log('❌ Test 3 Failed: Document not accessible');
}

// Test 4: Function execution
function testFunction() {
    return 'Function execution successful';
}
console.log('✅ Test 4 Passed:', testFunction());

// Test 5: Simple DOM query
const bodyElement = document.querySelector('body');
if (bodyElement) {
    console.log('✅ Test 5 Passed: DOM query successful');
} else {
    console.log('❌ Test 5 Failed: DOM query failed');
}

console.log('🎉 Console Test Complete - All basic functions working!');
console.log('💡 If you see this message, your console is working properly.');