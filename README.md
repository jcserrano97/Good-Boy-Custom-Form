# Custom Golf Apparel Order Form

A professional, responsive landing page for custom golf apparel orders with integrated EmailJS functionality.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Product Selection**: Visual product grid with Good Boy Custom images
- **Multi-Step Form**: 5-step process for collecting client requirements
- **EmailJS Integration**: Automatic email notifications with order summaries
- **Custom Polo Options**: Special fields for fully custom polo specifications
- **Form Validation**: Real-time validation and error handling
- **Progress Saving**: Saves form progress in browser localStorage

## Files

- `index.html` - Main landing page
- `styles.css` - All styling and responsive design
- `script.js` - Form functionality and interactions
- `form-handler.js` - Form validation and submission handling
- `email-service.js` - EmailJS integration and email formatting

## EmailJS Configuration

The form is configured to send emails via EmailJS with the following settings:
- **Service ID**: service_x8s8g1n
- **Template ID**: template_7h0oc59
- **Public Key**: Lk6wYcIWNme8YlRH1

## Deployment

This is a static website that can be deployed to any web hosting service:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any web server

## Email Template Variables

The EmailJS template should include these variables:
- `{{contact_name}}`, `{{email}}`, `{{phone}}`, `{{company}}`
- `{{event_name}}`, `{{event_date}}`, `{{delivery_deadline}}`
- `{{selected_products}}`, `{{custom_polo_specs}}`
- `{{total_quantity}}`, `{{estimated_total}}`
- `{{submission_date}}`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with some feature degradation)

## Contact

For technical support or customization requests, please contact the development team.