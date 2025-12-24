<?php
/**
 * BAPI Block Patterns
 * 
 * Register custom block patterns for content creators.
 * Place this file in your WordPress theme: /wp-content/themes/your-theme/inc/block-patterns.php
 * Then include in functions.php: require_once get_template_directory() . '/inc/block-patterns.php';
 */

// Register custom pattern categories
function bapi_register_pattern_categories() {
    if (function_exists('register_block_pattern_category')) {
        register_block_pattern_category(
            'bapi-products',
            array('label' => __('BAPI Product Layouts', 'bapi'))
        );
        
        register_block_pattern_category(
            'bapi-technical',
            array('label' => __('BAPI Technical Content', 'bapi'))
        );
        
        register_block_pattern_category(
            'bapi-marketing',
            array('label' => __('BAPI Marketing Sections', 'bapi'))
        );
    }
}
add_action('init', 'bapi_register_pattern_categories');

// Register block patterns
function bapi_register_block_patterns() {
    if (!function_exists('register_block_pattern')) {
        return;
    }

    // Pattern 1: Product Feature Section
    register_block_pattern(
        'bapi/product-feature',
        array(
            'title'       => __('Product Feature Section', 'bapi'),
            'description' => __('Two-column layout with product image and specifications', 'bapi'),
            'categories'  => array('bapi-products'),
            'content'     => '<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"40%"} -->
<div class="wp-block-column" style="flex-basis:40%"><!-- wp:image {"sizeSlug":"large"} -->
<figure class="wp-block-image size-large"><img alt="Product image placeholder"/><figcaption class="wp-element-caption">Add product image with descriptive alt text</figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%"} -->
<div class="wp-block-column" style="flex-basis:60%"><!-- wp:heading -->
<h2 class="wp-block-heading">Product Name / Part Number</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Brief product description highlighting key features and benefits. 2-3 sentences maximum.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Key Features</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Feature 1 with specific benefit</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Feature 2 with specific benefit</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Feature 3 with specific benefit</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Feature 4 with specific benefit</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">View Product Details</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
        )
    );

    // Pattern 2: Technical Specifications Table
    register_block_pattern(
        'bapi/technical-specs',
        array(
            'title'       => __('Technical Specifications Table', 'bapi'),
            'description' => __('Formatted table for product specifications', 'bapi'),
            'categories'  => array('bapi-technical'),
            'content'     => '<!-- wp:heading -->
<h2 class="wp-block-heading">Technical Specifications</h2>
<!-- /wp:heading -->

<!-- wp:table {"hasFixedLayout":true,"className":"is-style-stripes"} -->
<figure class="wp-block-table is-style-stripes"><table class="has-fixed-layout"><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Sensor Type</td><td>10K Type III Thermistor</td></tr><tr><td>Temperature Range</td><td>-40°F to 185°F (-40°C to 85°C)</td></tr><tr><td>Accuracy</td><td>±0.2°C @ 25°C</td></tr><tr><td>Output Signal</td><td>0-10 VDC</td></tr><tr><td>Response Time</td><td>&lt; 30 seconds</td></tr><tr><td>Housing Material</td><td>Impact-resistant ABS plastic</td></tr><tr><td>IP Rating</td><td>IP65 (Dust tight, water resistant)</td></tr><tr><td>Operating Voltage</td><td>24 VAC/VDC</td></tr><tr><td>Power Consumption</td><td>&lt; 1W</td></tr><tr><td>Certifications</td><td>UL Listed, CE Marked</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><em>Specifications subject to change without notice. Contact BAPI for most current specifications.</em></p>
<!-- /wp:paragraph -->',
        )
    );

    // Pattern 3: Case Study Layout
    register_block_pattern(
        'bapi/case-study',
        array(
            'title'       => __('Case Study Layout', 'bapi'),
            'description' => __('Structured layout for customer case studies', 'bapi'),
            'categories'  => array('bapi-marketing'),
            'content'     => '<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Case Study: [Customer Name]</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><strong>Industry:</strong> Healthcare / Data Center / Commercial<br><strong>Location:</strong> City, State<br><strong>Project Size:</strong> XX,XXX square feet</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">🎯 Challenge</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Describe the customer\'s problem or need. What challenges were they facing? Why did they need a solution? Include specific pain points and requirements.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">💡 Solution</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Describe the BAPI products and approach implemented. Which sensors/controllers were used? How were they configured? What made this solution appropriate?</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Specific BAPI product 1 with part number</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Specific BAPI product 2 with part number</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Integration details or special considerations</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">✅ Results</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Quantifiable outcomes and benefits. Include specific metrics where possible:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>XX% energy savings</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Improved temperature control accuracy</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Reduced maintenance costs</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Enhanced occupant comfort</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:quote {"className":"is-style-large"} -->
<blockquote class="wp-block-quote is-style-large"><!-- wp:paragraph -->
<p>"Add customer testimonial quote here. Make it specific and impactful, highlighting the value BAPI products delivered."</p>
<!-- /wp:paragraph --><cite>Name, Title, Company</cite></blockquote>
<!-- /wp:quote -->

<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Contact Us About Similar Projects</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->',
        )
    );

    // Pattern 4: FAQ Section
    register_block_pattern(
        'bapi/faq-section',
        array(
            'title'       => __('FAQ Section', 'bapi'),
            'description' => __('Frequently asked questions layout', 'bapi'),
            'categories'  => array('bapi-technical'),
            'content'     => '<!-- wp:heading -->
<h2 class="wp-block-heading">Frequently Asked Questions</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Question 1: What is the typical sensor accuracy?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Answer to question 1. Provide clear, concise information. Include specific technical details where relevant.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Question 2: How do I wire this sensor?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Answer to question 2 with installation guidance.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Question 3: What certifications does this product have?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Answer to question 3 about certifications and compliance.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p><strong>Still have questions?</strong> <a href="/contact-us">Contact our technical support team</a> for assistance.</p>
<!-- /wp:paragraph -->',
        )
    );

    // Pattern 5: Call-to-Action Banner
    register_block_pattern(
        'bapi/cta-banner',
        array(
            'title'       => __('Call-to-Action Banner', 'bapi'),
            'description' => __('Attention-grabbing CTA section', 'bapi'),
            'categories'  => array('bapi-marketing'),
            'content'     => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"primary","textColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-white-color has-primary-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)"><!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"2.5rem"}}} -->
<h2 class="wp-block-heading has-text-align-center" style="font-size:2.5rem">Need Help Selecting the Right Sensor?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
<p class="has-text-align-center" style="font-size:1.25rem">Our application engineers are ready to help you find the perfect solution for your project.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)"><!-- wp:button {"backgroundColor":"accent","textColor":"black","className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-black-color has-accent-background-color has-text-color has-background wp-element-button">Contact Sales</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Browse Products</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->',
        )
    );

    // Pattern 6: Application Example
    register_block_pattern(
        'bapi/application-example',
        array(
            'title'       => __('Application Example', 'bapi'),
            'description' => __('Real-world application description with image', 'bapi'),
            'categories'  => array('bapi-products'),
            'content'     => '<!-- wp:heading -->
<h2 class="wp-block-heading">Application: [Name of Application]</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:image -->
<figure class="wp-block-image"><img alt="Application photo or diagram"/><figcaption class="wp-element-caption">Application diagram or photo</figcaption></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Industry</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Healthcare / Commercial / Industrial / Data Center</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Requirements</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Specific measurement requirement</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Environmental conditions</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Integration requirements</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Recommended Products</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><a href="#">Product Name (Part #)</a> - Brief reason why</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Product Name (Part #)</a> - Brief reason why</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
        )
    );

    // Pattern 7: Product Comparison
    register_block_pattern(
        'bapi/product-comparison',
        array(
            'title'       => __('Product Comparison Table', 'bapi'),
            'description' => __('Side-by-side product comparison', 'bapi'),
            'categories'  => array('bapi-products'),
            'content'     => '<!-- wp:heading -->
<h2 class="wp-block-heading">Product Comparison</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Compare key features to find the right product for your application:</p>
<!-- /wp:paragraph -->

<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><thead><tr><th>Feature</th><th>Model A</th><th>Model B</th><th>Model C</th></tr></thead><tbody><tr><td><strong>Part Number</strong></td><td>BA/XXX-A</td><td>BA/XXX-B</td><td>BA/XXX-C</td></tr><tr><td><strong>Range</strong></td><td>0-50°C</td><td>-40-85°C</td><td>-40-185°F</td></tr><tr><td><strong>Accuracy</strong></td><td>±0.5°C</td><td>±0.2°C</td><td>±0.3°C</td></tr><tr><td><strong>Output</strong></td><td>0-10V</td><td>4-20mA</td><td>BACnet MS/TP</td></tr><tr><td><strong>Housing</strong></td><td>ABS Plastic</td><td>ABS Plastic</td><td>Stainless Steel</td></tr><tr><td><strong>IP Rating</strong></td><td>IP30</td><td>IP54</td><td>IP65</td></tr><tr><td><strong>Price Range</strong></td><td>$</td><td>$$</td><td>$$$</td></tr><tr><td><strong>Best For</strong></td><td>General HVAC</td><td>Outdoor</td><td>Harsh environments</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Need help choosing? Contact us</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->',
        )
    );

    // Pattern 8: Installation Guide Header
    register_block_pattern(
        'bapi/installation-guide',
        array(
            'title'       => __('Installation Guide Template', 'bapi'),
            'description' => __('Structured layout for installation instructions', 'bapi'),
            'categories'  => array('bapi-technical'),
            'content'     => '<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Installation Guide: [Product Name]</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Part Number:</strong> BA/XXXX-XX-X-XX<br><strong>Last Updated:</strong> [Date]<br><strong>Revision:</strong> 1.0</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">⚠️ Safety Warnings</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Disconnect power before installation</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Follow local electrical codes</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Installation must be performed by qualified personnel</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">📦 Package Contents</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Sensor unit (1)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Mounting hardware (included)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Installation guide (this document)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">🔧 Required Tools</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Phillips screwdriver</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Wire strippers</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Multimeter (for testing)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">📍 Installation Steps</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 1: Choose Location</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Select appropriate mounting location considering [factors]. Refer to diagram below:</p>
<!-- /wp:paragraph -->

<!-- wp:image -->
<figure class="wp-block-image"><img alt="Mounting location diagram"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 2: Mount Sensor</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Detailed mounting instructions...</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Step 3: Wire Connections</h3>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>Red Wire (+)    → Terminal 1
Black Wire (-)  → Terminal 2
White Wire (Sig) → Terminal 3</code></pre>
<!-- /wp:code -->

<!-- wp:heading -->
<h2 class="wp-block-heading">✅ Testing & Verification</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>After installation, verify proper operation:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol class="wp-block-list"><!-- wp:list-item -->
<li>Apply power to system</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Check LED indicator (should be solid green)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Verify output reading at controller</li>
<!-- /wp:list-item --></ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">❓ Troubleshooting</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Problem:</strong> No output reading<br><strong>Solution:</strong> Check power connections, verify voltage</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Problem:</strong> Erratic readings<br><strong>Solution:</strong> Check for electromagnetic interference, verify ground connection</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><strong>Technical Support:</strong> Contact BAPI at 1-800-XXX-XXXX or support@bapihvac.com</p>
<!-- /wp:paragraph -->',
        )
    );
}
add_action('init', 'bapi_register_block_patterns');
