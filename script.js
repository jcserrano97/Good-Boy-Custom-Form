// Multi-step form functionality and product selection
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('customOrderForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const submitButton = document.querySelector('.btn-submit');
    
    let currentStep = 1;
    const totalSteps = formSteps.length;

    // Product data
    const products = {
        'perform-ace-black': { name: 'Perform-ACE Midnight Black Polo', price: 30, category: 'Men\'s Apparel' },
        'perform-ace-navy': { name: 'Perform-ACE Solid Navy Polo', price: 30, category: 'Men\'s Apparel' },
        'perform-ace-white': { name: 'Perform-ACE White Polo', price: 30, category: 'Men\'s Apparel' },
        'waffle-hoodie': { name: 'Waffle Hoodie', price: 40, category: 'Men\'s Apparel' },
        'q-zip-pro': { name: 'Q-Zip Pro', price: 35, category: 'Men\'s Apparel' },
        'mens-custom-polo': { name: 'Fully Custom Men\'s Polo', price: 'Quote', category: 'Men\'s Apparel', custom: true },
        'good-girl-black': { name: 'Good Girl Black Polo', price: 30, category: 'Ladies Apparel' },
        'good-girl-navy': { name: 'Good Girl Navy Polo', price: 30, category: 'Ladies Apparel' },
        'good-girl-hoodie': { name: 'Good Girl Waffle Hoodie', price: 40, category: 'Ladies Apparel' },
        'ladies-custom-polo': { name: 'Fully Custom Ladies Polo', price: 'Quote', category: 'Ladies Apparel', custom: true },
        'magnetic-towel': { name: 'Magnetic Towel', price: 20, category: 'Golf Accessories' },
        'ball-marker': { name: 'Ball Marker', price: 15, category: 'Golf Accessories' },
        'bluetooth-speaker': { name: 'Bluetooth Speaker', price: 50, category: 'Golf Accessories' },
        'bag-tag': { name: 'Bag Tag', price: 12, category: 'Golf Accessories' }
    };

    // Initialize form
    showStep(1);
    setupEventListeners();
    
    // Mobile navigation
    setupMobileNav();
    
    // Product selection functionality
    setupProductSelection();
    
    // Logo upload functionality
    setupLogoUpload();

    function setupEventListeners() {
        // Next button functionality
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (validateCurrentStep()) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgressBar();
                        saveFormProgress();
                    }
                }
            });
        });

        // Previous button functionality
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (currentStep > 1) {
                    currentStep--;
                    showStep(currentStep);
                    updateProgressBar();
                }
            });
        });

        // Form submission
        form.addEventListener('submit', handleFormSubmission);
        
        // Auto-save form data
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', saveFormProgress);
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Quantity validation
        const quantityInput = document.getElementById('totalQuantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', function() {
                const value = parseInt(this.value);
                if (value < 72) {
                    this.setCustomValidity('Minimum order quantity is 72 pieces');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
    }

    function setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    function setupProductSelection() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                const checkbox = this.querySelector('input[type="checkbox"]');
                const wasChecked = checkbox.checked;
                
                // Toggle checkbox state
                checkbox.checked = !wasChecked;
                
                // Update visual state
                this.classList.toggle('selected', checkbox.checked);
                
                // Update selection summary
                updateSelectionSummary();
                
                // Check if custom polo field should be shown
                toggleCustomPoloField();
                
                // Save progress
                saveFormProgress();
                
                // Add visual feedback
                if (checkbox.checked) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }
            });
            
            // Prevent label click from double-triggering
            const label = card.querySelector('label');
            if (label) {
                label.addEventListener('click', function(e) {
                    e.preventDefault();
                });
            }
        });
    }

    function updateSelectionSummary() {
        const selectedCheckboxes = document.querySelectorAll('input[name="selected_products[]"]:checked');
        const count = selectedCheckboxes.length;
        const summaryElement = document.getElementById('selection-summary');
        
        if (summaryElement) {
            summaryElement.textContent = `${count} product${count !== 1 ? 's' : ''} selected`;
            
            if (count > 0) {
                summaryElement.style.background = 'rgba(2, 115, 78, 0.1)';
                summaryElement.style.color = '#02734E';
            } else {
                summaryElement.style.background = 'rgba(239, 68, 68, 0.1)';
                summaryElement.style.color = '#EF4444';
            }
        }
        
        // Update estimated total if on review step
        if (currentStep === 5) {
            updateOrderSummary();
        }
    }

    function toggleCustomPoloField() {
        const customPoloSelected = document.querySelector('input[value="mens-custom-polo"]:checked') || 
                                  document.querySelector('input[value="ladies-custom-polo"]:checked');
        const customPoloDetails = document.getElementById('customPoloDetails');
        
        if (customPoloDetails) {
            if (customPoloSelected) {
                customPoloDetails.style.display = 'block';
                // Add required attribute when visible
                const textarea = customPoloDetails.querySelector('textarea');
                if (textarea) {
                    textarea.setAttribute('required', 'required');
                }
            } else {
                customPoloDetails.style.display = 'none';
                // Remove required attribute when hidden
                const textarea = customPoloDetails.querySelector('textarea');
                if (textarea) {
                    textarea.removeAttribute('required');
                    textarea.value = ''; // Clear the field
                }
            }
        }
    }

    function setupLogoUpload() {
        const logoUpload = document.getElementById('logoUpload');
        const logoPreview = document.getElementById('logoPreview');
        
        if (logoUpload && logoPreview) {
            logoUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                
                if (file) {
                    // Validate file type
                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
                    
                    if (!validTypes.includes(file.type)) {
                        alert('Please upload a valid file (JPEG, PNG, GIF, SVG, or PDF)');
                        this.value = '';
                        return;
                    }
                    
                    // No size limit needed for Google Drive uploads
                    // Just show file size info for very large files (>50MB)
                    if (file.size > 50 * 1024 * 1024) {
                        console.warn('Very large file detected:', file.name, file.size);
                    }
                    
                    // Create preview based on file type
                    if (file.type === 'application/pdf') {
                        // PDF preview
                        logoPreview.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <div style="font-size: 2rem;">📄</div>
                                <div>
                                    <div style="font-weight: 600; color: #333;">${file.name}</div>
                                    <div style="font-size: 0.85rem; color: #666;">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #02734E;">✓ PDF ready - will be uploaded to Google Drive during form submission</p>
                        `;
                    } else {
                        // Image preview
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            logoPreview.innerHTML = `
                                <img src="${e.target.result}" alt="Logo Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #02734E;">✓ Logo ready - will be uploaded to Google Drive during form submission</p>
                            `;
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });
        }
    }

    function showStep(stepNumber) {
        // Hide all steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update step-specific content
        if (stepNumber === 5) {
            updateOrderSummary();
        }
        
        // Scroll to form
        const formSection = document.querySelector('.form-section');
        if (formSection && stepNumber > 1) {
            formSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#EF4444';
                isValid = false;
                
                // Reset border color on input
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        // Special validation for step 2 (product selection)
        if (currentStep === 2) {
            const selectedProducts = document.querySelectorAll('input[name="selected_products[]"]:checked');
            if (selectedProducts.length === 0) {
                alert('Please select at least one product to continue.');
                return false;
            }
        }
        
        // Special validation for step 4 (quantity)
        if (currentStep === 4) {
            const quantityInput = document.getElementById('totalQuantity');
            if (quantityInput && parseInt(quantityInput.value) < 72) {
                quantityInput.style.borderColor = '#EF4444';
                alert('Minimum order quantity is 72 pieces.');
                return false;
            }
        }
        
        if (!isValid) {
            alert('Please fill in all required fields.');
        }
        
        return isValid;
    }

    function updateOrderSummary() {
        const orderSummary = document.getElementById('orderSummary');
        if (!orderSummary) return;
        
        // Get form data
        const formData = new FormData(form);
        const selectedProducts = document.querySelectorAll('input[name="selected_products[]"]:checked');
        
        let summaryHTML = '<h4>Order Summary</h4>';
        
        // Contact Information
        summaryHTML += `
            <div class="summary-section">
                <h5>Contact Information</h5>
                <p><strong>Name:</strong> ${formData.get('contactName') || 'Not provided'}</p>
                <p><strong>Email:</strong> ${formData.get('email') || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${formData.get('phone') || 'Not provided'}</p>
                <p><strong>Company:</strong> ${formData.get('company') || 'Not provided'}</p>
            </div>
        `;
        
        // Event Information
        summaryHTML += `
            <div class="summary-section">
                <h5>Event Information</h5>
                <p><strong>Event Name:</strong> ${formData.get('eventName') || 'Not provided'}</p>
                <p><strong>Event Date:</strong> ${formData.get('eventDate') || 'Not provided'}</p>
                <p><strong>Delivery Deadline:</strong> ${formData.get('deadline') || 'Not provided'}</p>
            </div>
        `;
        
        // Selected Products
        if (selectedProducts.length > 0) {
            summaryHTML += '<div class="summary-section"><h5>Selected Products</h5><div class="selected-products">';
            
            let totalEstimate = 0;
            const quantity = parseInt(formData.get('totalQuantity')) || 72;
            
            selectedProducts.forEach(checkbox => {
                const productId = checkbox.value;
                const product = products[productId];
                
                if (product) {
                    summaryHTML += `
                        <div class="selected-product">
                            <span>${product.name}</span>
                        </div>
                    `;
                }
            });
            
            summaryHTML += '</div>';
            summaryHTML += '</div>';
        }
        
        // Customization Details
        const customizationDetails = formData.get('customizationDetails');
        const logoPosition = formData.get('logoPosition');
        const logoColors = formData.get('logoColors');
        const customPoloSpecs = formData.get('customPoloSpecs');
        
        if (customizationDetails || logoPosition || logoColors || customPoloSpecs) {
            summaryHTML += `
                <div class="summary-section">
                    <h5>Customization Requirements</h5>
                    ${logoPosition ? `<p><strong>Logo Position:</strong> ${logoPosition}</p>` : ''}
                    ${logoColors ? `<p><strong>Logo Colors:</strong> ${logoColors}</p>` : ''}
                    ${customizationDetails ? `<p><strong>Details:</strong> ${customizationDetails}</p>` : ''}
                    ${customPoloSpecs ? `<p><strong>Custom Polo Specifications:</strong><br>${customPoloSpecs.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `;
        }
        
        // Quantity and Sizing
        const totalQuantity = formData.get('totalQuantity');
        const sizingBreakdown = formData.get('sizingBreakdown');
        const specialRequests = formData.get('specialRequests');
        
        summaryHTML += `
            <div class="summary-section">
                <h5>Quantity & Sizing</h5>
                <p><strong>Total Quantity:</strong> ${totalQuantity || 'Not provided'} pieces</p>
                ${sizingBreakdown ? `<p><strong>Size Breakdown:</strong> ${sizingBreakdown}</p>` : ''}
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
            </div>
        `;
        
        orderSummary.innerHTML = summaryHTML;
    }

    function saveFormProgress() {
        try {
            const formData = new FormData(form);
            const data = {};
            
            // Save form fields
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
            
            // Save current step
            data._currentStep = currentStep;
            
            localStorage.setItem('customOrderFormProgress', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save form progress:', error);
        }
    }

    function loadFormProgress() {
        try {
            const saved = localStorage.getItem('customOrderFormProgress');
            if (saved) {
                const data = JSON.parse(saved);
                
                // Restore form fields
                Object.keys(data).forEach(key => {
                    if (key === '_currentStep') return;
                    
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                            field.checked = values.includes(field.value);
                            
                            // Update product card visual state
                            const productCard = field.closest('.product-card');
                            if (productCard) {
                                productCard.classList.toggle('selected', field.checked);
                            }
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                // Restore current step
                if (data._currentStep) {
                    currentStep = data._currentStep;
                    showStep(currentStep);
                    updateProgressBar();
                }
                
                // Update selection summary
                updateSelectionSummary();
            }
        } catch (error) {
            console.warn('Could not load form progress:', error);
        }
    }

    async function handleFormSubmission(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.textContent = 'Sending...';
        
        try {
            // Collect form data
            const formData = new FormData(form);
            
            // Send email via EmailJS
            const result = await emailService.sendOrderEmail(formData);
            
            if (result.success) {
                // Clear saved progress
                localStorage.removeItem('customOrderFormProgress');
                
                // Show success message with note about attachment if needed
                let message = 'Thank you! Your custom order requirements have been sent successfully. Our team will contact you within 24 hours.';
                if (result.note) {
                    message += ' Note: ' + result.note + ' - please email your logo separately.';
                }
                
                emailService.showMessage(message, 'success');
                
                // Reset form after short delay
                setTimeout(() => {
                    form.reset();
                    currentStep = 1;
                    showStep(1);
                    updateProgressBar();
                    updateSelectionSummary();
                    toggleCustomPoloField();
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 3000);
                
            } else {
                // Show error message
                emailService.showMessage(
                    'There was an error sending your request. Please try again or contact us directly.',
                    'error'
                );
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            emailService.showMessage(
                'There was an error sending your request. Please try again or contact us directly.',
                'error'
            );
        } finally {
            // Reset loading state
            submitButton.classList.remove('loading');
            submitButton.textContent = 'Submit My Requirements';
        }
    }

    // Initialize Google Drive service
    initializeGoogleDrive();
    
    // Load saved progress on page load
    loadFormProgress();
    
    // Update selection summary on load
    updateSelectionSummary();
    
    // Check custom polo field on load
    toggleCustomPoloField();
    
    async function initializeGoogleDrive() {
        try {
            console.log('Initializing Google Drive service...');
            const initialized = await googleDriveService.init();
            if (initialized) {
                console.log('Google Drive service ready');
            } else {
                console.warn('Google Drive service initialization failed');
            }
        } catch (error) {
            console.warn('Google Drive service error:', error);
        }
    }
});

// Utility functions
function formatPhoneNumber(input) {
    // Remove all non-numeric characters
    let value = input.value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    input.value = value;
}

// Add phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .step, .trust-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});