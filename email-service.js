// EmailJS Configuration and Service
class EmailService {
    constructor() {
        this.PUBLIC_KEY = 'Lk6wYcIWNme8YlRH1';
        this.SERVICE_ID = 'service_x8s8g1n';
        this.TEMPLATE_ID = 'template_7h0oc59';
        
        // Initialize EmailJS
        this.init();
    }
    
    init() {
        try {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS library not loaded');
                return false;
            }
            
            // Initialize EmailJS with public key
            emailjs.init(this.PUBLIC_KEY);
            console.log('EmailJS initialized successfully');
            return true;
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
            return false;
        }
    }
    
    async sendOrderEmail(formData) {
        try {
            console.log('Starting email send process...');
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS library not available');
            }
            
            // Prepare email data
            console.log('Preparing email data...');
            const emailData = await this.prepareEmailData(formData);
            
            // Log attachment info (without the full base64 data for readability)
            const logData = { ...emailData };
            if (logData.logo_attachment) {
                logData.logo_attachment = `[Base64 data - ${logData.logo_attachment.length} characters]`;
            }
            console.log('Email data prepared:', logData);
            
            // Send email via EmailJS
            console.log('Sending email via EmailJS...');
            console.log('Service ID:', this.SERVICE_ID);
            console.log('Template ID:', this.TEMPLATE_ID);
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailData
            );
            
            console.log('Email sent successfully:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('Email sending failed:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                text: error.text,
                stack: error.stack
            });
            
            // Common EmailJS error analysis
            if (error.status === 400) {
                console.error('Bad Request - Possible issues:');
                console.error('- Template variables don\'t match template');
                console.error('- File attachment too large');
                console.error('- Invalid base64 data');
            } else if (error.status === 402) {
                console.error('Payment Required - EmailJS account limits exceeded');
            } else if (error.status === 422) {
                console.error('Unprocessable Entity - Template or service configuration issue');
            }
            
            // No need to retry without attachment since we're using Google Drive links now
            
            return { success: false, error };
        }
    }

    
    async prepareEmailData(formData) {
        // Get selected products information
        const selectedProducts = document.querySelectorAll('input[name="selected_products[]"]:checked');
        let selectedProductsList = '';
        let totalEstimate = 0;
        const quantity = parseInt(formData.get('totalQuantity')) || 72;
        
        // Product data for pricing
        const products = {
            'perform-ace-black': { name: 'Perform-ACE Midnight Black Polo', price: 30 },
            'perform-ace-navy': { name: 'Perform-ACE Solid Navy Polo', price: 30 },
            'perform-ace-white': { name: 'Perform-ACE White Polo', price: 30 },
            'waffle-hoodie': { name: 'Waffle Hoodie', price: 40 },
            'q-zip-pro': { name: 'Q-Zip Pro', price: 35 },
            'mens-custom-polo': { name: 'Fully Custom Men\'s Polo', price: 'Quote', custom: true },
            'good-girl-black': { name: 'Good Girl Black Polo', price: 30 },
            'good-girl-navy': { name: 'Good Girl Navy Polo', price: 30 },
            'good-girl-hoodie': { name: 'Good Girl Waffle Hoodie', price: 40 },
            'ladies-custom-polo': { name: 'Fully Custom Ladies Polo', price: 'Quote', custom: true },
            'magnetic-towel': { name: 'Magnetic Towel', price: 20 },
            'ball-marker': { name: 'Ball Marker', price: 15 },
            'bluetooth-speaker': { name: 'Bluetooth Speaker', price: 50 },
            'bag-tag': { name: 'Bag Tag', price: 12 }
        };
        
        // Build selected products list
        selectedProducts.forEach((checkbox, index) => {
            const productId = checkbox.value;
            const product = products[productId];
            
            if (product) {
                if (product.custom) {
                    selectedProductsList += `• ${product.name} - Custom Quote Required\n`;
                } else {
                    const productTotal = product.price * quantity;
                    totalEstimate += productTotal;
                    selectedProductsList += `• ${product.name} - $${product.price}.00 × ${quantity} = $${productTotal.toLocaleString()}\n`;
                }
            }
        });
        
        // Handle logo upload to Google Drive
        let logoInfo = '';
        let logoFileName = '';
        let driveUploadResult = null;
        const logoUpload = document.getElementById('logoUpload');
        
        if (logoUpload && logoUpload.files && logoUpload.files[0]) {
            const file = logoUpload.files[0];
            logoFileName = file.name;
            
            try {
                console.log('Uploading logo file to Google Drive:', file.name, 'Size:', file.size);
                
                // Get customer info for file naming
                const customerName = formData.get('contactName') || 'Customer';
                const eventName = formData.get('eventName') || 'Event';
                
                // Upload to Google Drive
                driveUploadResult = await googleDriveService.uploadFile(file, customerName, eventName);
                
                if (driveUploadResult.success) {
                    logoInfo = `File uploaded to Google Drive: ${driveUploadResult.viewLink}`;
                    console.log('Logo file uploaded to Google Drive successfully');
                } else {
                    logoInfo = `File upload failed: ${driveUploadResult.error}`;
                    console.warn('Google Drive upload failed:', driveUploadResult.error);
                }
            } catch (error) {
                console.warn('Could not upload logo file:', error);
                logoInfo = `File upload error: ${error.message}`;
            }
        }
        
        // Format submission date
        const submissionDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        
        // Prepare email template data
        const emailData = {
            // Contact Information
            contact_name: formData.get('contactName') || 'Not provided',
            email: formData.get('email') || 'Not provided',
            phone: formData.get('phone') || 'Not provided',
            company: formData.get('company') || 'Not provided',
            
            // Event Details
            event_name: formData.get('eventName') || 'Not provided',
            event_date: formData.get('eventDate') || 'Not provided',
            delivery_deadline: formData.get('deadline') || 'Not provided',
            
            // Product Selection
            selected_products: selectedProductsList || 'No products selected',
            product_count: selectedProducts.length,
            
            // Customization
            logo_position: formData.get('logoPosition') || 'Not specified',
            logo_colors: formData.get('logoColors') || 'Not specified',
            customization_details: formData.get('customizationDetails') || 'Not provided',
            custom_polo_specs: formData.get('customPoloSpecs') || '',
            
            // Quantities
            total_quantity: formData.get('totalQuantity') || 'Not provided',
            sizing_breakdown: formData.get('sizingBreakdown') || 'Not provided',
            special_requests: formData.get('specialRequests') || 'None',
            
            // Totals and metadata
            estimated_total: totalEstimate > 0 ? totalEstimate.toLocaleString() : 'Custom Quote Required',
            submission_date: submissionDate,
            has_custom_polo: formData.get('customPoloSpecs') ? 'yes' : 'no',
            
            // Logo upload information
            logo_filename: logoFileName || 'No logo uploaded',
            logo_info: logoInfo || 'No logo uploaded',
            logo_drive_link: driveUploadResult?.viewLink || '',
            has_logo: logoFileName ? 'yes' : 'no',
            drive_upload_success: driveUploadResult?.success ? 'yes' : 'no'
        };
        
        return emailData;
    }
    
    // Helper method to convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // Test EmailJS connection
    async testConnection() {
        try {
            console.log('Testing EmailJS connection...');
            
            const testData = {
                test_message: 'EmailJS connection test',
                timestamp: new Date().toISOString()
            };
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                testData
            );
            
            console.log('EmailJS test successful:', response);
            return { success: true, response };
        } catch (error) {
            console.error('EmailJS test failed:', error);
            return { success: false, error };
        }
    }

    // Helper method to show user feedback
    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `email-message email-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Insert at top of form
        const form = document.getElementById('customOrderForm');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
            
            // Auto-remove success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 5000);
            }
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Initialize email service
const emailService = new EmailService();