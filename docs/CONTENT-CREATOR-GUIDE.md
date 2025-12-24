# Content Creator Guide - BAPI Headless WordPress

Guidelines for creating and editing content in WordPress for the headless Next.js frontend.

---

## ✅ What TO Use

### WordPress Block Editor (Gutenberg) - Built Into Core WordPress
**No plugins needed** - The Block Editor is part of core WordPress (since v5.0). Available blocks:

- ✅ **Standard Blocks** - Paragraph, Heading, List, Quote, etc.
- ✅ **Image Block** - Upload images with alt text and captions
- ✅ **Gallery Block** - For multiple images
- ✅ **Embed Blocks** - YouTube, Vimeo, Twitter embeds
- ✅ **Table Block** - For data tables
- ✅ **Code Block** - For technical documentation
- ✅ **Columns Block** - Multi-column layouts
- ✅ **Group/Stack** - Organize content sections
- ✅ **Buttons** - Call-to-action buttons
- ✅ **Spacer** - Add vertical spacing
- ✅ **Separator** - Horizontal dividers

**Custom Blocks** - Dev team can create custom React blocks as needed (no plugins required)

### Supported Content Types
**Core WordPress only - no plugins needed:**
- ✅ Pages
- ✅ Posts (News/Blog)
- ✅ Media Library
- ✅ Categories & Tags
- ✅ Menus
- ✅ Users & Roles

**WooCommerce (plugin installed):**
- ✅ Products
- ✅ Product Categories
- ✅ Product Attributes

**Custom Post Types** (as dev team creates them - no plugin needed)

---

## 📝 Content Structure Best Practices

### Page Titles
- Keep titles clear and concise (50-60 characters max)
- Use proper capitalization
- No special characters or emojis
- Example: "Mission & Values" not "Mission & Values!!!! 🎉"

### Headings
- Use proper heading hierarchy (H1 → H2 → H3)
- H1 is auto-generated from page title - don't add another H1
- Use H2 for main sections
- Use H3 for subsections
- Don't skip heading levels

```
Page Title (H1) - Auto-generated
├── Section 1 (H2)
│   ├── Subsection 1.1 (H3)
│   └── Subsection 1.2 (H3)
└── Section 2 (H2)
    ├── Subsection 2.1 (H3)
    └── Subsection 2.2 (H3)
```

### Paragraphs
- Keep paragraphs short (3-5 sentences)
- One idea per paragraph
- Use line breaks for readability
- Avoid walls of text

### Lists
- Use bullet lists for unordered items
- Use numbered lists for sequential steps
- Keep list items concise
- Parallel structure (all items start similarly)

---

## 🖼️ Image Guidelines

### Upload Requirements
- **Format**: JPG or PNG (WebP conversion happens automatically via Kinsta CDN)
- **Max File Size**: 2MB (optimize before upload)
- **Recommended Width**: 1920px max
- **Aspect Ratios**: 
  - Hero images: 16:9
  - Product images: 1:1 or 4:3
  - Blog featured images: 16:9

### Required Fields
- **Alt Text**: ALWAYS add descriptive alt text for accessibility
  - Good: "BAPI BA/10K temperature sensor mounted on wall"
  - Bad: "sensor" or "image1"
- **Caption**: Optional but recommended for context
- **Description**: Used for SEO, include relevant keywords

### Image Optimization Tools
- [TinyPNG](https://tinypng.com/) - Compress PNGs/JPGs
- [Squoosh](https://squoosh.app/) - Advanced compression
- Photoshop/Lightroom - Export for web

### WordPress Media Library
- Use descriptive file names: `ba-10k-temperature-sensor.jpg`
- NOT: `IMG_1234.jpg` or `DSC_5678.jpg`
- Organize with folders/categories (use Media Library plugins if needed)

---

## 🎨 Formatting Guidelines

### Emphasis
- **Bold**: For important terms, product names
- *Italic*: For emphasis, technical terms on first use
- ~~Strikethrough~~: Rarely needed, avoid overuse
- `Code`: For part numbers, technical specs

### Links
- Use descriptive link text
  - Good: "View our [temperature sensors](/products/temperature)"
  - Bad: "Click [here](/products/temperature)"
- Link to relevant internal pages
- External links should open in same tab (we handle this on frontend)
- Check links before publishing

### Quotes & Callouts
- Use blockquote for customer testimonials
- Use blockquote for important callouts
- Keep quotes concise and impactful

---

## 📦 Product Content (WooCommerce)

### Product Titles
- Format: `[Part Number] - [Descriptive Name]`
- Example: "BA/10K-3-O-12-BB - Outside Air Temperature Sensor"

### Product Descriptions
- **Short Description**: 2-3 sentences, key features
- **Long Description**: Detailed specifications, applications, features
- Use bullet points for specifications
- Include technical details

### Product Categories
- Assign to appropriate categories (Temperature, Humidity, CO₂, etc.)
- Products can have multiple categories
- Choose ONE primary category (first one listed)

### Product Images
- Multiple images showing different angles
- First image is the featured image (shows in listings)
- Include dimensional drawings if available
- Include installation photos

### Product Attributes
- Fill out all relevant attributes (sensor type, range, accuracy, etc.)
- These are used for filtering and search
- Be consistent with naming

---

## 🔍 SEO Best Practices

### SEO Fields
**Note:** If using bare WordPress (no SEO plugin), use core WordPress excerpt field. Dev team can add SEO meta fields to headless frontend.

- **Page/Post Excerpt**: Used as meta description (core WordPress feature)
- **If Yoast/Rank Math installed:**
  - SEO Title: 60 characters max
  - Meta Description: 150-160 characters
  - Focus Keyword: One primary keyword per page

### Content Optimization
- Use keywords naturally in content
- Include keywords in first paragraph
- Use keywords in headings (H2/H3)
- Add internal links to related content
- Add external links to authoritative sources

### URL Slugs
- Keep URLs short and descriptive
- Use hyphens, not underscores
- All lowercase
- Good: `/products/temperature-sensors`
- Bad: `/products/temp_sensors_page_new`

---

## 📱 Frontend Preview

### How Your Content Appears
- Content flows through GraphQL to the Next.js frontend
- The frontend applies its own styling (you don't control CSS)
- Focus on content structure, not appearance
- Preview on the live site: [https://bapi-headless.vercel.app](https://bapi-headless.vercel.app)

### Content Updates
- Changes are cached for performance
- **Pages**: Updates appear within 1 hour (ISR revalidation)
- **Products**: Updates appear within 1 hour
- **News/Blog**: Updates appear within 15 minutes
- For immediate updates, contact dev team for cache clear

### Content Testing
1. Save draft in WordPress
2. Preview in WordPress (limited value)
3. Publish when ready
4. View on live site after cache refresh
5. Check mobile and desktop views

---

## 🛠️ WordPress Editor Tips

### Keyboard Shortcuts
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + K` - Insert link
- `Ctrl/Cmd + Alt + T` - Insert Table
- `/` - Quick block inserter

### Block Toolbar
- Click any block to see formatting options
- Use block toolbar for alignment, colors, etc.
- Transform blocks (paragraph → heading, etc.)

### Reusable Blocks
**Core WordPress feature - no plugin needed:**
- Create reusable blocks for repeated content
- Edit once, updates everywhere
- Good for: disclaimers, CTAs, contact info
- Access via: Block Inserter → "Reusable" tab

### Revisions
- WordPress saves revisions automatically
- Use "Revisions" panel to restore previous versions
- Review changes before publishing

---

## ✅ Pre-Publish Checklist

Before clicking Publish:

- [ ] Page title is clear and descriptive
- [ ] Proper heading hierarchy (H2 → H3)
- [ ] All images have alt text
- [ ] Images are optimized (< 2MB each)
- [ ] Links are working and descriptive
- [ ] No Visual Composer/page builder content
- [ ] No broken shortcodes like `[vc_row]`
- [ ] SEO title and meta description filled
- [ ] Content is proofread (spelling, grammar)
- [ ] Categories/tags assigned (if applicable)
- [ ] Featured image set (for posts/products)

---

## 🆘 Common Issues & Solutions

### Issue: "I need a feature that's in a plugin"
**Solution:** Don't install random plugins! Contact dev team. We can:
- Build custom Gutenberg blocks (React components)
- Add functionality to the Next.js frontend
- Extend core WordPress with custom code
- Evaluate if a specific plugin is safe for headless

### Bare Bones Philosophy
We're intentionally keeping WordPress minimal:
- **Why?** Plugins add bloat, security risks, and often don't work with headless
- **Core WordPress + WooCommerce** is all you need for content management
- **Frontend magic** happens in Next.js, not WordPress plugins

### Issue: Content not showing on frontend
**Solutions:**
1. Wait for cache to refresh (up to 1 hour)
2. Check that page/post is published (not draft)
3. Contact dev team for manual cache clear

### Issue: Weird formatting/styling
**Possible causes:**
- Leftover Visual Composer shortcodes → Remove them
- Copy/pasted from Word → Use "Paste as plain text"
- Custom CSS in WordPress → Won't transfer, contact dev team

### Issue: Images not displaying
**Possible causes:**
- Image not uploaded to media library
- Missing alt text (required by frontend)
- File size too large (> 2MB)
- Incorrect file format (use JPG/PNG)

### Issue: Old shortcodes appearing
- Should be cleaned from system
- If you see any `[vc_...]` or similar → Delete them
- Report to dev team if they keep appearing

---

## 📞 Getting Help

### Need a Custom Block?
Contact dev team to create custom Gutenberg blocks for special content types.

### Need Custom Functionality?
Page builders are banned, but we can build proper React components for the frontend.

### Technical Issues?
- WordPress admin issues → Contact hosting (Kinsta)
- Frontend display issues → Contact dev team
- Plugin problems → Contact dev team

### Content Questions?
- SEO optimization → Marketing team
- Product specifications → Technical team
- General writing → Content team lead

---

## 📚 Resources

### WordPress Documentation
- [Block Editor Handbook](https://wordpress.org/documentation/article/wordpress-block-editor/)
- [Gutenberg Blocks](https://wordpress.org/gutenberg/)
- [Image Optimization](https://wordpress.org/documentation/article/optimization/)

### Image Tools
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [Canva](https://www.canva.com/) - Resize/edit images

### SEO Tools
- Yoast SEO (installed)
- Google Search Console
- [Ahrefs Keyword Generator](https://ahrefs.com/keyword-generator)

---

## 🎯 Summary

**DO:**
- ✅ Use WordPress Block Editor
- ✅ Write clean, structured content
- ✅ Optimize images before upload
- ✅ Add alt text to all images
- ✅ Use proper heading hierarchy
- ✅ Keep content simple and focused

**DON'T:**
- ❌ Install page builders
- ❌ Add custom shortcodes
- ❌ Upload huge images
- ❌ Skip alt text
- ❌ Copy/paste from Word without cleaning
- ❌ Use inline CSS/styling

---

**Questions?** Contact the development team!

Last Updated: December 24, 2025
