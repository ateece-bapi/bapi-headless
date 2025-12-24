# WordPress Templates & Patterns Guide

How to create structured content templates for BAPI headless WordPress.

---

## Overview

WordPress provides several built-in ways to create reusable content structures for content creators, all without plugins.

---

## 1. Block Patterns (Recommended)

### What Are Block Patterns?
Pre-designed combinations of blocks that users can insert with one click. Think of them as "starter layouts" for common content types.

### Benefits
- ✅ Built into WordPress core (since 5.5)
- ✅ No plugins required
- ✅ Users can still edit/customize after insertion
- ✅ Perfect for consistent page structures
- ✅ Visual pattern library in block inserter

### How They Work
1. Dev team creates patterns in theme code
2. Patterns appear in WordPress block inserter
3. Content creator clicks pattern to insert
4. Pattern blocks populate in editor
5. Creator customizes content while keeping structure

### Use Cases for BAPI
- **Product Feature Sections**: Image + specs + CTA
- **Technical Documentation**: Code blocks + tables + notes
- **Case Study Layout**: Challenge + Solution + Results
- **Hero Sections**: Heading + description + button
- **Testimonial Blocks**: Quote + attribution + company
- **FAQ Sections**: Question/answer pairs
- **Comparison Tables**: Product specifications side-by-side
- **Call-to-Action Banners**: Heading + text + button

### Implementation
Patterns are registered in theme's `functions.php` file:

```php
function bapi_register_block_patterns() {
    register_block_pattern(
        'bapi/product-feature',
        array(
            'title'       => 'Product Feature Section',
            'description' => 'Image with specifications and CTA button',
            'content'     => '<!-- wp:columns -->...<!-- /wp:columns -->',
            'categories'  => array('bapi-patterns'),
        )
    );
}
add_action('init', 'bapi_register_block_patterns');
```

---

## 2. Reusable Blocks

### What Are Reusable Blocks?
Blocks that users save themselves for reuse across multiple pages.

### Benefits
- ✅ Core WordPress feature
- ✅ User-created and managed
- ✅ Edit once, updates everywhere
- ✅ Good for frequently repeated content

### Use Cases for BAPI
- Standard disclaimers
- Contact information blocks
- Warranty information
- Technical support callouts
- Certification badges/logos

### How to Create
1. Create and style blocks in editor
2. Select blocks
3. Click three dots → "Create Reusable block"
4. Name it (e.g., "Warranty Disclaimer")
5. Insert on other pages via block inserter → "Reusable" tab

### Management
- Edit via: WordPress Admin → Reusable Blocks
- Changes apply to all instances
- Can convert back to regular blocks if needed

---

## 3. Post Type Templates

### What Are Post Type Templates?
Default content structure when creating new posts of a specific type.

### Benefits
- ✅ Automatic starter content
- ✅ Enforces consistent structure
- ✅ Different templates for different post types

### Use Cases for BAPI
- **Blog Posts**: H2 "Introduction" + content placeholder + H2 "Key Takeaways"
- **Product Pages**: Specs section + Applications + Related Products
- **Case Studies**: Challenge + Solution + Results structure
- **Technical Docs**: Overview + Requirements + Instructions + Troubleshooting

### Implementation
Set in theme's `functions.php`:

```php
function bapi_register_post_templates() {
    $post_type_object = get_post_type_object('post');
    $post_type_object->template = array(
        array('core/heading', array('level' => 2, 'content' => 'Introduction')),
        array('core/paragraph', array('placeholder' => 'Add your introduction here...')),
        array('core/heading', array('level' => 2, 'content' => 'Key Takeaways')),
        array('core/list', array('placeholder' => 'Add key points...')),
    );
}
add_action('init', 'bapi_register_post_templates');
```

---

## 4. Custom Post Types with Custom Fields

### What Are Custom Post Types?
Specialized content types beyond standard Posts and Pages (e.g., Case Studies, Datasheets, Application Notes).

### Benefits
- ✅ Structured data entry
- ✅ Custom fields for specific data
- ✅ Separate from regular pages/posts
- ✅ Better organization

### Use Cases for BAPI
- **Case Studies**: Structured fields (Industry, Challenge, Solution, Results)
- **Datasheets**: Product specs, PDFs, technical drawings
- **Application Notes**: Product category, industry, technical details
- **White Papers**: Author, publication date, topic, PDF download

### Implementation
Register in `functions.php`:

```php
function bapi_register_custom_post_types() {
    register_post_type('case_study', array(
        'label'        => 'Case Studies',
        'public'       => true,
        'show_in_rest' => true, // Required for Gutenberg
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt'),
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'case-studies'),
    ));
}
add_action('init', 'bapi_register_custom_post_types');
```

---

## 5. Block Pattern Categories

Organize patterns into categories for easy discovery.

### Default Categories
- Text
- Images
- Buttons
- Headers
- Testimonials
- Call to Action

### Custom BAPI Categories
Create categories specific to BAPI content:

```php
function bapi_register_pattern_categories() {
    register_block_pattern_category(
        'bapi-products',
        array('label' => 'BAPI Product Layouts')
    );
    
    register_block_pattern_category(
        'bapi-technical',
        array('label' => 'BAPI Technical Content')
    );
    
    register_block_pattern_category(
        'bapi-marketing',
        array('label' => 'BAPI Marketing Sections')
    );
}
add_action('init', 'bapi_register_pattern_categories');
```

---

## Implementation Plan

### Phase 1: Block Patterns (Priority)
Create 5-10 essential patterns:
1. Product feature section
2. Technical specifications table
3. Case study layout
4. Hero section with CTA
5. FAQ section
6. Testimonial block
7. Contact CTA banner
8. Product comparison table

### Phase 2: Reusable Blocks
Set up common reusable blocks:
1. Warranty disclaimer
2. Contact information
3. Technical support callout
4. Certification logos

### Phase 3: Post Type Templates
Define templates for:
1. Blog posts (News)
2. Product pages
3. Case studies (if custom post type created)

### Phase 4: Custom Post Types (Optional)
Evaluate need for:
1. Case Studies
2. Application Notes
3. White Papers
4. Datasheets

---

## Best Practices

### Pattern Design
- Keep patterns flexible (users should be able to edit)
- Use placeholder text to guide content creators
- Include image placeholders with dimensions
- Add helpful descriptions
- Test patterns in editor before deploying

### Content Structure
- Start with heading (H2) for each section
- Use semantic HTML (lists, tables, quotes)
- Include clear placeholders
- Provide examples in pattern descriptions

### Naming Conventions
- Use clear, descriptive names
- Prefix with "BAPI" for brand recognition
- Group related patterns (e.g., "BAPI - Product Feature", "BAPI - Product Specs")

### Maintenance
- Review pattern usage in WordPress analytics
- Get feedback from content creators
- Update patterns based on real-world usage
- Remove unused patterns to reduce clutter

---

## WordPress File Locations

### Where to Add Code
All customizations go in WordPress theme:

```
wp-content/
└── themes/
    └── your-theme/
        ├── functions.php          (Main registration code)
        ├── inc/
        │   ├── block-patterns.php (Pattern definitions)
        │   └── post-types.php     (Custom post types)
        └── patterns/              (Pattern files - optional)
            ├── product-feature.php
            └── case-study.php
```

### Accessing via SFTP/SSH
Kinsta hosting provides:
- SFTP access for file editing
- WP-CLI for command-line operations
- phpMyAdmin for database (if needed)

---

## Testing Patterns

### Development Workflow
1. Create pattern in `functions.php`
2. View in WordPress admin → Patterns
3. Test inserting into post/page
4. Verify blocks are editable
5. Check frontend GraphQL output
6. Verify Next.js frontend renders correctly

### Testing Checklist
- [ ] Pattern appears in block inserter
- [ ] All blocks are editable after insertion
- [ ] Image placeholders work
- [ ] Text is selectable/editable
- [ ] GraphQL includes pattern content
- [ ] Frontend renders correctly
- [ ] Mobile responsive
- [ ] Accessibility (alt text, headings)

---

## Resources

### WordPress Documentation
- [Block Patterns](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
- [Block Pattern Directory](https://wordpress.org/patterns/)
- [Custom Post Types](https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/)
- [Post Type Templates](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-templates/)

### Tools
- [Pattern Explorer](https://wordpress.org/patterns/) - Browse existing patterns
- WP-CLI - Command-line WordPress management
- Kinsta DevKinsta - Local WordPress development

---

## Next Steps

1. **Review proposed patterns** (see proposed list)
2. **Prioritize patterns** based on content creator needs
3. **Create patterns** in WordPress theme
4. **Test with content team**
5. **Iterate based on feedback**
6. **Document usage** in Content Creator Guide

---

Last Updated: December 24, 2025
