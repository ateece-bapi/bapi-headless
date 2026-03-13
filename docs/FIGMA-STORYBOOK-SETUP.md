# Figma + Storybook Integration Guide for Designers

## Overview

This guide shows you how to connect Figma with our live Storybook component library. You'll be able to view implemented components side-by-side with your designs to ensure perfect alignment.

**What You'll Get:**
- Live components embedded in Figma
- Side-by-side design vs implementation comparison
- Real-time preview of hover states, animations, and interactions
- Accurate component specs (spacing, colors, typography)

---

## Option 1: Storybook Connect Plugin (Recommended)

### Installation

1. **Open Figma Desktop or Web**
2. **Go to Plugins Menu:**
   - Desktop: `Plugins → Browse plugins in Community`
   - Web: Click the Figma logo → `Plugins → Browse plugins in Community`

3. **Search for "Storybook Connect"**
   - Published by Chromatic (official plugin)
   - Free to use

4. **Click "Install"**

### Setup

1. **Open Your Figma Design File**

2. **Run the Plugin:**
   - Right-click anywhere → `Plugins → Storybook Connect`
   - Or: `Plugins → Storybook Connect` from menu

3. **Enter Storybook URL:**
   ```
   https://69790f14a4a9ebfab83a9f49-cyioytfxjg.chromatic.com
   ```

4. **Browse Components:**
   - Plugin shows all 186 components in left panel
   - Search or browse by category

5. **Embed Components:**
   - Click any component to see preview
   - Click "Add to Canvas" to embed it in your Figma file
   - Component appears as a live embed (not an image!)

### Daily Workflow

**When Designing New Features:**

1. Open your Figma file
2. Run Storybook Connect plugin
3. Search for similar existing components
4. Embed them next to your new designs
5. Compare and ensure consistency

**Example:**
```
Your Design (left)          Live Component (right)
┌──────────────────┐       ┌──────────────────┐
│ New Button       │  ←→   │ Existing Button  │
│ Design mockup    │       │ What's live now  │
└──────────────────┘       └──────────────────┘
         ↓
  Spot differences:
  - Colors match? ✓
  - Padding correct? ✓  
  - Border radius? ✗ (needs adjustment)
```

---

## Option 2: Browser Side-by-Side (No Plugin)

If you prefer not to use the plugin:

1. **Open Figma in one browser tab**
2. **Open Storybook in another tab:**
   ```
   https://69790f14a4a9ebfab83a9f49-cyioytfxjg.chromatic.com
   ```
3. **Use split screen:**
   - Windows: `Windows + Arrow Keys` to snap windows
   - Mac: Use Rectangle app or manual window arrangement
4. **Compare visually** between tabs

---

## Using Storybook for Design Handoff

### Before You Design

**Check What Already Exists:**

1. Open Storybook
2. Browse component categories:
   - **Design System → Icons**: All brand icons and trust badges
   - **Components**: Buttons, forms, toasts, modals
   - **Features**: Navigation, product cards, hero sections

3. **Ask yourself:**
   - "Can I reuse an existing component?"
   - "Can I modify an existing component?"
   - "Do I need a completely new component?"

**Saves Time:** Reusing components = faster development!

### When Handing Off Designs

**Reference Storybook Components:**

Instead of:
```
❌ "Make a blue button with rounded corners"
```

Say:
```
✅ "Use the PrimaryButton from Storybook, size 'large'"
```

**Add Links in Figma:**
1. Select your design component
2. Add comment/note with Storybook link
3. Example: "Based on: https://69790f14a4a9ebfab83a9f49-cyioytfxjg.chromatic.com/?path=/story/components-button--primary"

---

## Reviewing Developer Work with Chromatic

### When You Get a Review Request

1. **Check Email/Slack** for Chromatic notification:
   ```
   "New visual changes in PR #123"
   ```

2. **Click "Review in Chromatic"**

3. **You'll See:**
   - **Before image** (current version)
   - **After image** (developer's changes)
   - **Red highlights** showing pixel differences

4. **Your Options:**

   **✅ Approve:**
   - Click "Accept" button
   - Changes match your design
   - Component is ready to go live

   **❌ Request Changes:**
   - Click "Unresolved" button
   - Leave comment: "Button padding needs to be 16px, not 12px"
   - Developer fixes and updates PR

   **💬 Leave Feedback:**
   - Click anywhere on the image
   - Add annotation/comment
   - Example: "Can we make this shadow darker?"

### Example Review Workflow

```
Developer makes change → Opens PR
           ↓
Chromatic captures screenshots
           ↓
You get notification
           ↓
You review side-by-side comparison
           ↓
EITHER: ✅ Approve → Merges → Goes live
    OR: ❌ Request changes → Developer fixes → You review again
```

---

## Best Practices

### 1. **Start Every Design Session with Storybook**
   - Check existing components first
   - Maintain consistency across the site
   - Avoid reinventing the wheel

### 2. **Use Component Names from Storybook**
   - In Figma layers: "PrimaryButton" (matches Storybook)
   - Not: "blue-btn" or "Button1"
   - Makes handoff crystal clear

### 3. **Document Deviations**
   - If you intentionally deviate from Storybook component
   - Add note explaining why
   - Helps developers understand intent

### 4. **Keep Storybook Open While Designing**
   - Quick reference for spacing, colors, typography
   - Ensure your designs are technically feasible
   - Spot potential issues early

### 5. **Review PRs Promptly**
   - Developers are waiting for your feedback
   - Faster reviews = faster shipping
   - Usually takes 2-5 minutes per review

---

## Component Naming Reference

Our Storybook follows this structure:

```
Design System/
  ├── Icons          (Brand icons, trust badges)
  └── Colors         (Brand colors, semantic tokens)

Components/
  ├── Button         (Primary, secondary, ghost variants)
  ├── Toast          (Success, error, info, warning notifications)
  ├── ImageModal     (Product image lightbox)
  └── ...

Features/
  ├── MegaMenu       (Desktop navigation)
  ├── ProductHeroFast (Product page header)
  ├── TaglineRotator (Homepage taglines)
  └── ...
```

**In Figma, match this naming:**
- ✅ "Components/Button/Primary"
- ❌ "btn-primary" or "BluButton"

---

## Keyboard Shortcuts in Storybook

While browsing components:

- **`/`** - Focus search bar
- **`S`** - Toggle sidebar
- **`D`** - Toggle docs/canvas view
- **`A`** - Toggle addons panel
- **`F`** - Toggle fullscreen

---

## Troubleshooting

### "Plugin won't connect to Storybook"
- **Check URL:** Make sure you used the full Chromatic URL
- **Try HTTPS:** Ensure URL starts with `https://`
- **Refresh:** Close and reopen the plugin

### "Components look different in Figma embed"
- **Font loading:** Embed may use different fonts than live site
- **Browser differences:** Figma uses WebKit rendering
- **Solution:** Reference Chromatic web view for exact colors/spacing

### "I can't approve changes in Chromatic"
- **Check permissions:** You need "Reviewer" role (already set!)
- **Login:** Make sure you're logged into Chromatic
- **Browser:** Try a different browser (Chrome recommended)

### "Too many notifications"
- **Adjust settings:** In Chromatic → Settings → Notifications
- **Choose:** Email only for important reviews
- **Mute:** Specific builds if you're not the right reviewer

---

## Getting Help

**Questions about:**
- **Components:** Browse Storybook docs tab for each component
- **Technical setup:** Ask Andrew (that's me!)
- **Chromatic features:** [chromatic.com/docs](https://www.chromatic.com/docs)
- **Figma plugin:** [Storybook Connect docs](https://storybook.js.org/addons/storybook-addon-designs)

---

## Quick Start Checklist

- [ ] Accept Chromatic invite (check email)
- [ ] Bookmark Storybook URL: `https://69790f14a4a9ebfab83a9f49-cyioytfxjg.chromatic.com`
- [ ] Install Storybook Connect plugin in Figma (optional but recommended)
- [ ] Browse components to familiarize yourself
- [ ] Set up Chromatic notification preferences
- [ ] Ready to design! 🎨

---

**Last Updated:** March 13, 2026  
**Storybook Version:** 186 stories across 23 components  
**Contact:** Andrew (ateece-bapi)
