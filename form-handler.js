// Form validation and submission handler
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                pattern: /^\(\d{3}\)\s\d{3}-\d{4}$/,
                message: 'Please enter a valid phone number (XXX) XXX-XXXX'
            },
            eventDate: {
                validator: this.validateEventDate,
                message: 'Event date must be in the future'
            },
            deadline: {
                validator: this.validateDeadline,
                message: 'Delivery deadline must be at least 30 days from today and before event date'
            },
            totalQuantity: {
                validator: this.validateQuantity,
                message: 'Minimum order quantity is 72 pieces'
            },
            logoUpload: {
                validator: this.validateLogoUpload,
                message: 'Please upload a valid file (JPEG, PNG, GIF, SVG, or PDF) under 10MB'
            }
        };
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupRealTimeValidation();
        this.setupFormSubmission();
    }
    
    setupRealTimeValidation() {
        // Real-time validation for all form fields
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Validate on blur for better UX
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            // Clear validation styling on input
            field.addEventListener('input', () => {
                this.clearFieldValidation(field);
            });
            
            // Special handling for specific field types
            if (field.type === 'email') {
                field.addEventListener('input', () => {
                    this.debounce(() => this.validateField(field), 500)();
                });
            }
            
            if (field.id === 'phone') {
                field.addEventListener('input', () => {
                    this.formatPhoneNumber(field);
                });
            }
            
            if (field.id === 'totalQuantity') {
                field.addEventListener('input', () => {
                    this.validateQuantityField(field);
                });
            }
        });
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });
    }
    
    validateField(field) {
        const fieldName = field.name || field.id;
        const rule = this.validationRules[fieldName];
        
        if (!rule) return true;
        
        let isValid = true;
        let message = '';
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }
        // Check pattern validation
        else if (rule.pattern && !rule.pattern.test(field.value)) {
            isValid = false;
            message = rule.message;
        }
        // Check custom validator
        else if (rule.validator && !rule.validator.call(this, field)) {
            isValid = false;
            message = rule.message;
        }
        
        this.showFieldValidation(field, isValid, message);
        return isValid;
    }
    
    validateEventDate(field) {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return selectedDate > today;
    }
    
    validateDeadline(field) {
        const deadlineDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Must be at least 30 days from today
        const minDate = new Date(today);
        minDate.setDate(minDate.getDate() + 30);
        
        if (deadlineDate < minDate) {
            return false;
        }
        
        // Must be before event date
        const eventDateField = this.form.querySelector('#eventDate');
        if (eventDateField && eventDateField.value) {
            const eventDate = new Date(eventDateField.value);
            return deadlineDate <= eventDate;
        }
        
        return true;
    }
    
    validateQuantity(field) {
        const quantity = parseInt(field.value);
        return !isNaN(quantity) && quantity >= 72;
    }
    
    validateLogoUpload(field) {
        if (!field.files || field.files.length === 0) {
            return true; // Optional field
        }
        
        const file = field.files[0];
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB (increased for PDFs)
        
        return validTypes.includes(file.type) && file.size <= maxSize;
    }
    
    validateQuantityField(field) {
        const quantity = parseInt(field.value);
        
        if (isNaN(quantity)) {
            this.showFieldValidation(field, false, 'Please enter a valid number');
            return false;
        }
        
        if (quantity < 72) {
            this.showFieldValidation(field, false, 'Minimum order quantity is 72 pieces');
            return false;
        }
        
        if (quantity > 10000) {
            this.showFieldValidation(field, false, 'Please contact us directly for orders over 10,000 pieces');
            return false;
        }
        
        this.showFieldValidation(field, true, '');
        return true;
    }
    
    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        field.value = value;
    }
    
    showFieldValidation(field, isValid, message) {
        // Remove existing validation styling
        this.clearFieldValidation(field);
        
        // Add validation styling
        if (isValid) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    clearFieldValidation(field) {
        field.classList.remove('valid', 'invalid');
        
        // Remove error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    validateAllFields() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let allValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    validateProductSelection() {
        const selectedProducts = this.form.querySelectorAll('input[name="selected_products[]"]:checked');
        return selectedProducts.length > 0;
    }
    
    async handleSubmission() {
        // Validate all fields
        const fieldsValid = this.validateAllFields();
        const productsSelected = this.validateProductSelection();
        
        if (!fieldsValid) {
            this.showMessage('Please correct the errors before submitting.', 'error');
            return;
        }
        
        if (!productsSelected) {
            this.showMessage('Please select at least one product.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        try {
            // Prepare form data
            const formData = this.prepareFormData();
            
            // Submit form (replace with actual endpoint)
            const result = await this.submitForm(formData);
            
            if (result.success) {
                this.handleSuccessfulSubmission();
            } else {
                this.handleSubmissionError(result.message);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError('An error occurred while submitting your request. Please try again.');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    prepareFormData() {
        const formData = new FormData(this.form);
        const data = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like selected products)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Calculate estimated pricing
        const selectedProducts = this.form.querySelectorAll('input[name="selected_products[]"]:checked');
        const quantity = parseInt(data.totalQuantity) || 72;
        let estimatedTotal = 0;
        
        const productPrices = {
            'perform-ace-black': 30, 'perform-ace-navy': 30, 'perform-ace-white': 30,
            'waffle-hoodie': 40, 'q-zip-pro': 35, 'good-girl-black': 30,
            'good-girl-navy': 30, 'good-girl-hoodie': 40, 'magnetic-towel': 20,
            'ball-marker': 15, 'bluetooth-speaker': 50, 'bag-tag': 12
        };
        
        selectedProducts.forEach(checkbox => {
            const price = productPrices[checkbox.value] || 0;
            estimatedTotal += price * quantity;
        });
        
        data.estimatedTotal = estimatedTotal;
        data.selectedProductCount = selectedProducts.length;
        
        return data;
    }
    
    async submitForm(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                // Log data for development
                console.log('Form submission data:', data);
                
                // Simulate successful submission
                resolve({ success: true, orderId: 'ORD-' + Date.now() });
                
                // For actual implementation, use:
                // fetch('/api/submit-order', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // }).then(response => response.json())
            }, 2000);
        });
    }
    
    handleSuccessfulSubmission() {
        // Clear saved progress
        localStorage.removeItem('customOrderFormProgress');
        
        // Show success message
        this.showMessage(
            'Thank you! Your custom order requirements have been submitted successfully. Our team will contact you within 24 hours to discuss your project.',
            'success'
        );
        
        // Reset form and redirect to top
        setTimeout(() => {
            this.resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
        
        // Send tracking event (if analytics is set up)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'custom_order_form'
            });
        }
    }
    
    handleSubmissionError(message) {
        this.showMessage(message || 'An error occurred. Please try again.', 'error');
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear validation styling
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearFieldValidation(field);
        });
        
        // Reset product selection
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset form steps
        const resetEvent = new CustomEvent('formReset');
        this.form.dispatchEvent(resetEvent);
        
        // Update selection summary
        const summaryElement = document.getElementById('selection-summary');
        if (summaryElement) {
            summaryElement.textContent = '0 products selected';
            summaryElement.style.background = 'rgba(239, 68, 68, 0.1)';
            summaryElement.style.color = '#EF4444';
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Insert at top of form
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        // Auto-remove after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Additional CSS for validation styling
const validationStyles = `
    .field-error {
        color: #EF4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
        font-size: 0.75rem;
    }
    
    .form-group input.invalid,
    .form-group select.invalid,
    .form-group textarea.invalid {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input.valid,
    .form-group select.valid,
    .form-group textarea.valid {
        border-color: #22C55E;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
    
    .form-message {
        margin-bottom: 1.5rem;
        border-radius: 8px;
        padding: 1rem;
        animation: slideDown 0.3s ease;
    }
    
    .form-message-success {
        background: #F0FDF4;
        border: 1px solid #22C55E;
        color: #166534;
    }
    
    .form-message-error {
        background: #FEF2F2;
        border: 1px solid #EF4444;
        color: #991B1B;
    }
    
    .form-message-info {
        background: #F0F9FF;
        border: 1px solid #3B82F6;
        color: #1E40AF;
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .message-icon {
        font-weight: bold;
        font-size: 1.1rem;
    }
    
    .message-text {
        flex: 1;
    }
    
    .message-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .message-close:hover {
        opacity: 1;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject validation styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = validationStyles;
    document.head.appendChild(style);
    
    // Initialize form handler
    new FormHandler('customOrderForm');
});