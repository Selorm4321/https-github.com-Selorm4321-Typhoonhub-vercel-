/**
 * TyphoonHub Stripe Payment Integration Debugger
 * Use this to identify and fix payment modal issues
 */

class PaymentDebugger {
    constructor() {
        this.logs = [];
        this.stripe = null;
        this.elements = null;
        this.currentModal = null;
    }

    // Initialize debugging
    init() {
        console.log('🔍 TyphoonHub Payment Debugger Started');
        this.setupEventListeners();
        this.checkStripeConfiguration();
        this.findPaymentModals();
        this.monitorNetworkRequests();
    }

    // Check if Stripe is properly configured
    checkStripeConfiguration() {
        console.log('🔧 Checking Stripe Configuration...');
        
        // Check if Stripe is loaded
        if (typeof window.Stripe === 'undefined') {
            this.logError('❌ Stripe.js not loaded. Add: <script src="https://js.stripe.com/v3/"></script>');
            return false;
        }

        // Check for Stripe public key
        const stripeElements = document.querySelectorAll('[data-stripe-key]');
        if (stripeElements.length === 0) {
            this.logWarning('⚠️ No Stripe public key found. Check data-stripe-key attribute or environment variables.');
        }

        // Check for common Stripe initialization patterns
        if (window.stripe) {
            this.stripe = window.stripe;
            this.logSuccess('✅ Stripe instance found');
        } else {
            this.logWarning('⚠️ No global Stripe instance found');
        }

        return true;
    }

    // Find and analyze payment modals
    findPaymentModals() {
        console.log('🔍 Searching for payment modals...');
        
        const modalSelectors = [
            '.payment-modal',
            '.investment-modal', 
            '[data-modal="payment"]',
            '[data-testid*="payment"]',
            '.modal:has([data-stripe])',
            '.dialog:has(form)',
            '[role="dialog"]:has(input[type="text"])'
        ];

        modalSelectors.forEach(selector => {
            const modals = document.querySelectorAll(selector);
            if (modals.length > 0) {
                this.logSuccess(`✅ Found ${modals.length} modal(s) with selector: ${selector}`);
                modals.forEach((modal, index) => {
                    this.analyzeModal(modal, `${selector}-${index}`);
                });
            }
        });

        // Check for stuck processing states
        this.checkProcessingStates();
    }

    // Analyze individual modal for issues
    analyzeModal(modal, identifier) {
        console.log(`🔍 Analyzing modal: ${identifier}`);

        // Check for form elements
        const forms = modal.querySelectorAll('form');
        const inputs = modal.querySelectorAll('input');
        const buttons = modal.querySelectorAll('button');

        this.logInfo(`📋 Modal ${identifier}:`);
        this.logInfo(`   - Forms: ${forms.length}`);
        this.logInfo(`   - Inputs: ${inputs.length}`);
        this.logInfo(`   - Buttons: ${buttons.length}`);

        // Check for Stripe elements
        const stripeElements = modal.querySelectorAll('.StripeElement, [data-stripe-element]');
        if (stripeElements.length > 0) {
            this.logSuccess(`   ✅ Found ${stripeElements.length} Stripe elements`);
        }

        // Check for event listeners
        buttons.forEach((button, index) => {
            const hasListener = this.hasEventListener(button);
            this.logInfo(`   - Button ${index}: "${button.textContent.trim()}" - Listener: ${hasListener ? '✅' : '❌'}`);
        });

        // Store reference for debugging
        this.currentModal = modal;
    }

    // Check for stuck processing states
    checkProcessingStates() {
        const processingSelectors = [
            '[data-processing="true"]',
            '.processing',
            '.loading',
            'button:disabled:contains("Processing")',
            '[aria-busy="true"]'
        ];

        processingSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                this.logWarning(`⚠️ Found ${elements.length} stuck processing element(s): ${selector}`);
                elements.forEach(el => {
                    this.logInfo(`   Stuck element: ${el.tagName} - "${el.textContent.trim()}"`);
                });
            }
        });
    }

    // Monitor network requests for API failures
    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = function(...args) {
            const url = args[0];
            
            return originalFetch.apply(this, args)
                .then(response => {
                    if (url.includes('stripe') || url.includes('payment') || url.includes('invest')) {
                        if (!response.ok) {
                            self.logError(`❌ Payment API Error: ${response.status} - ${url}`);
                        } else {
                            self.logSuccess(`✅ Payment API Success: ${response.status} - ${url}`);
                        }
                    }
                    return response;
                })
                .catch(error => {
                    if (url.includes('stripe') || url.includes('payment') || url.includes('invest')) {
                        self.logError(`❌ Payment API Failed: ${error.message} - ${url}`);
                    }
                    throw error;
                });
        };
    }

    // Setup event listeners for debugging
    setupEventListeners() {
        // Listen for payment form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (this.isPaymentForm(form)) {
                this.logInfo('💳 Payment form submitted');
                this.debugFormSubmission(form, e);
            }
        });

        // Listen for button clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && this.isPaymentButton(button)) {
                this.logInfo(`🖱️ Payment button clicked: "${button.textContent.trim()}"`);
                this.debugButtonClick(button, e);
            }
        });

        // Listen for Stripe events
        document.addEventListener('stripe-error', (e) => {
            this.logError(`❌ Stripe Error: ${e.detail.message}`);
        });
    }

    // Check if form is payment-related
    isPaymentForm(form) {
        const paymentIndicators = [
            'payment', 'stripe', 'invest', 'checkout', 'billing'
        ];
        
        const formHTML = form.innerHTML.toLowerCase();
        return paymentIndicators.some(indicator => formHTML.includes(indicator));
    }

    // Check if button is payment-related
    isPaymentButton(button) {
        const buttonText = button.textContent.toLowerCase();
        const paymentTerms = [
            'invest', 'pay', 'purchase', 'checkout', 'process', 'submit'
        ];
        
        return paymentTerms.some(term => buttonText.includes(term));
    }

    // Debug form submission
    debugFormSubmission(form, event) {
        console.log('🔍 Debugging form submission...');
        
        // Check form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        this.logInfo('📋 Form data:', data);
        
        // Check for required fields
        const requiredInputs = form.querySelectorAll('input[required]');
        let hasErrors = false;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                this.logError(`❌ Required field empty: ${input.name || input.type}`);
                hasErrors = true;
            }
        });
        
        if (hasErrors) {
            this.logWarning('⚠️ Form has validation errors');
        }
    }

    // Debug button click
    debugButtonClick(button, event) {
        console.log('🔍 Debugging button click...');
        
        // Check button state
        if (button.disabled) {
            this.logWarning('⚠️ Button is disabled');
        }
        
        // Check for processing state
        if (button.textContent.toLowerCase().includes('processing')) {
            this.logWarning('⚠️ Button appears to be stuck in processing state');
            this.fixStuckButton(button);
        }
    }

    // Fix stuck processing button
    fixStuckButton(button) {
        this.logInfo('🔧 Attempting to fix stuck button...');
        
        // Remove processing state
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.classList.remove('processing', 'loading');
        
        // Reset button text
        const originalText = button.getAttribute('data-original-text') || 'Try Again';
        button.textContent = originalText;
        
        this.logSuccess('✅ Button reset attempted');
    }

    // Utility methods for consistent logging
    logError(message) {
        console.error(message);
        this.logs.push({ type: 'error', message, timestamp: new Date() });
    }

    logWarning(message) {
        console.warn(message);
        this.logs.push({ type: 'warning', message, timestamp: new Date() });
    }

    logSuccess(message) {
        console.log(`%c${message}`, 'color: green');
        this.logs.push({ type: 'success', message, timestamp: new Date() });
    }

    logInfo(message) {
        console.log(message);
        this.logs.push({ type: 'info', message, timestamp: new Date() });
    }

    // Check if element has event listeners (approximate)
    hasEventListener(element) {
        // This is a simplified check - real implementation would be more complex
        return element.onclick !== null || 
               element.addEventListener !== Element.prototype.addEventListener ||
               element.outerHTML.includes('onclick');
    }

    // Generate debug report
    generateReport() {
        console.log('📊 Generating Payment Debug Report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            stripeLoaded: typeof window.Stripe !== 'undefined',
            logs: this.logs,
            modalsFound: document.querySelectorAll('[role="dialog"], .modal').length,
            formsFound: document.querySelectorAll('form').length,
            recommendations: this.getRecommendations()
        };

        console.table(report);
        return report;
    }

    // Get debugging recommendations
    getRecommendations() {
        const recommendations = [];

        if (typeof window.Stripe === 'undefined') {
            recommendations.push('Load Stripe.js library');
        }

        if (this.logs.filter(log => log.type === 'error').length > 0) {
            recommendations.push('Fix API endpoint errors');
        }

        if (document.querySelectorAll('[data-processing="true"]').length > 0) {
            recommendations.push('Reset stuck processing states');
        }

        return recommendations;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.paymentDebugger = new PaymentDebugger();
        window.paymentDebugger.init();
    });
} else {
    window.paymentDebugger = new PaymentDebugger();
    window.paymentDebugger.init();
}

// Expose utility functions for manual debugging
window.debugPayments = () => window.paymentDebugger.generateReport();
window.fixStuckPayments = () => {
    // Find and fix all stuck buttons
    document.querySelectorAll('button[disabled]').forEach(button => {
        if (button.textContent.toLowerCase().includes('processing')) {
            window.paymentDebugger.fixStuckButton(button);
        }
    });
};

console.log('🚀 TyphoonHub Payment Debugger loaded. Use debugPayments() or fixStuckPayments() in console.');