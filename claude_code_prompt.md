# Claude Code Prompt: Custom Golf Apparel Landing Page

Create a professional, responsive landing page for a custom golf apparel business with an integrated client data collection form. The design should be inspired by Good Boy Custom's aesthetic - clean, modern, and golf-focused.

## Design Requirements

### Visual Design
- **Color Scheme**: Primary navy blue (#1B365D), white, charcoal gray (#374151), with accent colors in golf green (#22C55E)
- **Typography**: Clean, professional fonts (Inter or similar for headings, system fonts for body)
- **Layout**: Modern, responsive design that works on desktop, tablet, and mobile
- **Imagery**: Golf-themed hero section with professional golf course or equipment imagery

### Page Structure

#### 1. Header Section
- Company logo placeholder (customizable)
- Navigation menu: Home, Products, Process, Contact
- Professional tagline: "Branded Golf Apparel, Customized Solutions"

#### 2. Hero Section
- Compelling headline: "Custom Golf Apparel That Makes Your Event Unforgettable"
- Subheadline highlighting quality and professionalism
- Primary CTA button: "Start Customizing"
- Golf course background image (use a professional stock image or CSS gradient)

#### 3. Product Showcase
Create a grid showing product categories with hover effects:
- **Men's Apparel** (Polos, Quarter-Zips, Hoodies)
- **Ladies Apparel** (Polos, Pullovers, Athletic Wear)
- **Golf Accessories** (Towels, Ball Markers, Divot Tools)
- **Headwear** (Caps, Visors, Beanies)

#### 4. Process Section
5-step process visualization (similar to Good Boy Custom):
1. **Submit Your Requirements** - Use our detailed form
2. **Design Consultation** - Our team contacts you within 24 hours
3. **Mockup Review** - Review and approve your custom design
4. **Production** - High-quality manufacturing begins
5. **Delivery** - Receive your custom apparel on time

#### 5. Visual Product Selection Form
Implement an interactive product selection grid as the main form section:

**Grid Layout Requirements:**
- Responsive grid system (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- Product cards with hover effects and selection states
- Multiple selection capability (checkboxes with visual feedback)
- Category sections: Men's Apparel, Ladies Apparel, Golf Accessories, Headwear

**Product Cards Design:**
Each product card should include:
```html
<div class="product-card" data-product-id="product-name">
  <input type="checkbox" name="selected_products[]" value="product-name" id="product-name">
  <label for="product-name">
    <img src="[actual-goodboycustom-image-url]" alt="Product Name">
    <div class="product-info">
      <h3>Product Name</h3>
      <p class="price">$XX.XX</p>
    </div>
    <div class="selection-overlay">
      <span class="checkmark">✓</span>
    </div>
  </label>
</div>
```

**Actual Product Images to Use:**

**Men's Apparel:**
- Perform-ACE Black Polo: `https://goodboycustom.com/cdn/shop/files/PerformaceBlack_25244738-d25c-4604-ac2d-550e98839992.png?v=1737547630&width=533`
- Perform-ACE Navy Polo: `https://goodboycustom.com/cdn/shop/files/PerformaceNavyTucked_28f8f4af-5a19-49d2-baf4-c9d421d61226.png?v=1738882516&width=533`
- Perform-ACE White Polo: `https://goodboycustom.com/cdn/shop/files/IMG_0604_6d346063-ec8a-4b24-be64-273c94238728.jpg?v=1738882565&width=533`
- Waffle Hoodie: `https://goodboycustom.com/cdn/shop/files/IMG_0580_9ec2e94b-a04c-48b1-8383-f4af0a886f43.jpg?v=1738881707&width=533`
- Q-Zip Pro: `https://goodboycustom.com/cdn/shop/files/IMG_0562-2_27c7b0c3-2c46-45d2-af91-8152a217d852.jpg?v=1738882087&width=533`

**Ladies Apparel:**
- Good Girl Black Polo: `https://goodboycustom.com/cdn/shop/files/ScreenShot2025-04-10at3.23.01PM.png?v=1744323880&width=533`
- Good Girl Navy Polo: `https://goodboycustom.com/cdn/shop/files/navypolowomens_9b7795e9-d689-4875-b214-10127e41d226.webp?v=1745532258&width=533`
- Good Girl Waffle Hoodie: `https://goodboycustom.com/cdn/shop/files/IMG_0570_b27c6d6d-5f18-466d-977c-d7c72e90f977.jpg?v=1738882852&width=533`

**Golf Accessories:**
- Magnetic Towel: `https://goodboycustom.com/cdn/shop/files/IMG_0356_9531f50a-ff81-4bb1-9e08-98287b0290ab.png?v=1738911712&width=533`
- Ball Marker: `https://goodboycustom.com/cdn/shop/files/IMG_9593-2.png?v=1740177633&width=533`
- Bluetooth Speaker: `https://goodboycustom.com/cdn/shop/files/IMG_0324_de08e15e-4456-4de0-944f-01605f1f2596.png?v=1738911515&width=533`
- Bag Tag: `https://goodboycustom.com/cdn/shop/files/BagTagFrontside.jpg?v=1744148172&width=533`

**Interactive Features:**
```css
.product-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.product-card.selected {
  border-color: #22C55E;
  background: #F0FDF4;
}

.selection-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #22C55E;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-card.selected .selection-overlay {
  opacity: 1;
}
```

**JavaScript Functionality:**
```javascript
// Handle product selection
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', function() {
    const checkbox = this.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    this.classList.toggle('selected', checkbox.checked);
    
    // Update summary/counter
    updateSelectionSummary();
  });
});

function updateSelectionSummary() {
  const selected = document.querySelectorAll('input[name="selected_products[]"]:checked');
  const count = selected.length;
  const summaryEl = document.getElementById('selection-summary');
  summaryEl.textContent = `${count} product${count !== 1 ? 's' : ''} selected`;
}
```

#### 6. Trust & Credibility Section
- Minimum order quantity: 72 pieces
- Lead time: 30 days
- Quality guarantee
- Professional process guarantee
- Client testimonial placeholders

#### 7. Footer
- Contact information
- Social media links
- Privacy policy link
- Terms of service link

## Technical Requirements

### Form Implementation
```javascript
// Product selection grid with actual Good Boy Custom images
const products = [
  {
    category: "mens-apparel",
    items: [
      {
        id: "perform-ace-black",
        name: "Perform-ACE Midnight Black Polo",
        price: 30,
        image: "https://goodboycustom.com/cdn/shop/files/PerformaceBlack_25244738-d25c-4604-ac2d-550e98839992.png?v=1737547630&width=533"
      },
      {
        id: "perform-ace-navy", 
        name: "Perform-ACE Solid Navy Polo",
        price: 30,
        image: "https://goodboycustom.com/cdn/shop/files/PerformaceNavyTucked_28f8f4af-5a19-49d2-baf4-c9d421d61226.png?v=1738882516&width=533"
      },
      {
        id: "waffle-hoodie",
        name: "Waffle Hoodie", 
        price: 40,
        image: "https://goodboycustom.com/cdn/shop/files/IMG_0580_9ec2e94b-a04c-48b1-8383-f4af0a886f43.jpg?v=1738881707&width=533"
      }
      // Add all products from the questionnaire
    ]
  }
];

// Multi-step form with visual product selection as step 2
// Progressive disclosure for better UX
// Form validation with real-time feedback
// File upload for logo submission with preview
// Dynamic pricing calculator based on selections
// Conditional logic for related questions
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly buttons and form elements
- Optimized images for different screen sizes

### Performance
- Optimized images with proper alt tags
- Minimal JavaScript for fast loading
- CSS Grid and Flexbox for layouts
- Semantic HTML structure

### Accessibility
- ARIA labels for form elements
- Proper heading hierarchy (H1, H2, H3)
- Color contrast compliance
- Keyboard navigation support
- Screen reader compatibility

## Content Guidelines

### Tone & Voice
- Professional yet approachable
- Golf industry expertise
- Quality and reliability focused
- Corporate and event-oriented

### Key Messaging
- "Professional custom golf apparel for tournaments, corporate events, and teams"
- "72-piece minimum orders with 30-day lead time"
- "High-quality materials and expert customization"
- "From design to delivery, we handle everything"

### Call-to-Action Buttons
- Primary: "Start Your Custom Order"
- Secondary: "View Product Gallery"
- Form: "Submit My Requirements"
- Contact: "Speak With Our Team"

## Special Features to Include

1. **Visual Product Selection Grid**
   - Interactive product cards with Good Boy Custom images
   - Multi-select capability with visual feedback
   - Category filtering (Men's, Ladies, Accessories, Headwear)
   - Real-time selection counter and estimated pricing
   - Responsive grid layout (4 cols desktop → 2 cols tablet → 1 col mobile)

2. **Multi-Step Form with Progress**
   - Step 1: Contact & Event Information
   - Step 2: Visual Product Selection (main feature)
   - Step 3: Customization Requirements
   - Step 4: Sizing & Quantities
   - Step 5: Review & Submit

3. **Dynamic Pricing Calculator**
   - Updates based on selected products and quantities
   - Shows volume discounts for larger orders
   - Displays estimated total before final submission

4. **Enhanced Product Cards**
   ```css
   .product-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: 20px;
     margin: 20px 0;
   }
   
   .product-card {
     background: white;
     border-radius: 12px;
     overflow: hidden;
     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
     transition: all 0.3s ease;
     cursor: pointer;
   }
   
   .product-image {
     width: 100%;
     height: 200px;
     object-fit: cover;
   }
   
   .product-info {
     padding: 15px;
     text-align: center;
   }
   ```

5. **Logo Upload with Preview**
6. **Mobile-Optimized Touch Interface**
7. **Form Progress Saving** (localStorage backup)
8. **Email Integration** for form submissions
9. **Thank You Page** with order summary
10. **Loading States** and smooth transitions

## File Structure
Create the following files:
- `index.html` - Main landing page
- `styles.css` - All styling
- `script.js` - Form functionality and interactions
- `form-handler.js` - Form submission and validation

## Form Validation Rules
- Email format validation
- Phone number formatting
- Required field indicators
- File type restrictions for logo uploads
- Minimum quantity validation (72+ pieces)
- Date validation for deadlines

## Success Metrics to Track
- Form completion rate
- Time spent on page
- Mobile vs desktop usage
- Most common product selections
- Average order quantity

Build this as a complete, production-ready landing page that a custom golf apparel business can immediately deploy and use to collect client requirements professionally.