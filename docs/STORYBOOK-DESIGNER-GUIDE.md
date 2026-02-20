# Storybook for Designers - Quick Start Guide
**For UI/UX and Graphic Designers - No Code Required**

## 👋 Welcome Matt & Elly!

This guide helps you access and use Storybook to review components, provide feedback, and collaborate with the development team—**no coding or terminal commands required**.

---

## 🎯 What is Storybook?

**Storybook** is a living component library showcasing all UI components in isolation. Think of it as:
- 📚 **Component catalog** - Browse all buttons, forms, cards, navigation elements
- 🎨 **Design system documentation** - See typography, colors, spacing, icons
- 📱 **Responsive previews** - View components on mobile, tablet, desktop
- 🔄 **Interactive playground** - Change props, test different states
- ✅ **Quality assurance** - Review visual consistency across the app

**Important:** Storybook is **read-only for designers**. You can view, comment, and approve components, but cannot edit the code. Your design work continues in Figma!

---

## 🎨 Figma + Storybook Workflow

**Matt, this is how you'll use both tools together:**

### Your Design Creation Tool: Figma ✏️

**Figma is where you create and iterate on designs:**
- Design new components and screens
- Create design system libraries
- Prototype user flows
- Collaborate with Elly on visual assets
- Hand off specs to developers

**You continue using Figma as your primary design tool** - Storybook doesn't replace it!

### Your Review & QA Tool: Storybook 👀

**Storybook is where you verify developers implemented your designs correctly:**
- Review built components match Figma specs
- Test responsive behavior (mobile/tablet/desktop)
- Check interactive states (hover, focus, loading, error)
- Verify accessibility compliance (color contrast, keyboard navigation)
- Leave feedback for developers to fix issues

### The Complete Workflow

```
1. Design in Figma
   ↓
   Matt creates component mockups (buttons, forms, cards)
   Shares Figma link with development team

2. Developer Implements
   ↓
   Developer builds component in React/Next.js
   Creates Storybook story for the component
   Pushes to GitHub (triggers Chromatic publish)

3. Review in Storybook
   ↓
   Matt gets notification of new component
   Opens Chromatic Storybook URL
   Compares built component to Figma designs

4. Provide Feedback
   ↓
   Matt leaves comments in Chromatic:
   - "Button padding should be 16px not 12px"
   - "Icon color needs to match Figma spec (#1479BC)"
   - "Hover state missing shadow effect"

5. Developer Iterates
   ↓
   Developer fixes issues based on Matt's feedback
   Publishes updated component to Storybook

6. Final Approval
   ↓
   Matt reviews fixes, approves in Chromatic
   Component merges to production
```

### Figma-to-Storybook Best Practices

**For Matt (Designer):**
- ✅ **Share Figma links** in GitHub issues or Chromatic comments
- ✅ **Use design tokens** - Reference colors by name (BAPI Blue, not #1479BC)
- ✅ **Document variants** - If Figma shows 3 button states, expect 3 Storybook stories
- ✅ **Annotate specs** - Use Figma's inspect panel for spacing, font sizes, colors
- ✅ **Create responsive frames** - Show mobile (375px), tablet (768px), desktop (1440px)

**For Developers (Reference):**
- ✅ **Match Figma specs** - Use exact colors, spacing, typography from design
- ✅ **Create all variants** - Every Figma frame = one Storybook story
- ✅ **Link Figma in stories** - Add Figma link to story description
- ✅ **Capture edge cases** - Show states Figma didn't cover (loading, error, empty)

### Optional: Storybook Figma Plugin

**There's a Figma plugin to link designs to Storybook!**

1. **Install plugin in Figma:**
   - Search Figma plugins for "Storybook Connect"
   - Install from Figma Community

2. **Link Figma frames to Storybook stories:**
   - Select a Figma frame (e.g., "Button/Primary")
   - Run plugin → Paste Storybook story URL
   - Now both tools are cross-referenced!

3. **Benefits:**
   - Click Figma frame → Opens corresponding Storybook story
   - Developers see Figma link directly in Storybook
   - Side-by-side comparison (design vs implementation)

**Not required, but nice to have for large teams!**

---

## 🌐 Access Storybook (No Installation Needed)

### Option 1: Published Storybook (Recommended for Designers)

**Senior teams publish Storybook to a URL so designers don't need local setup.**

1. **Get the URL from your team:**
   - Ask your development team for the **Chromatic Storybook URL**
   - It looks like: `https://XXXXXX-XXXXXX.chromatic.com/`
   - Bookmark this URL for easy access

2. **Chromatic Features for Designers:**
   - 💬 **Comments** - Leave feedback directly on components
   - 🔄 **Visual Diffs** - See what changed between versions
   - ✅ **Approvals** - Mark components as approved or needs work
   - 📸 **Snapshots** - Review visual regression test results
   - 🔔 **Notifications** - Get alerts when components change

3. **Access Anytime:**
   - Works in any browser (Chrome, Safari, Firefox)
   - No technical skills required
   - Updates automatically when developers push changes

### Option 2: Local Storybook (Advanced - Requires Developer Help)

If you need to preview changes before they're published:

1. **Clone the repository** (ask a developer for help)
2. **Install dependencies** (developer will run this for you)
3. **Open terminal and run:**
   ```bash
   cd web
   pnpm run storybook
   ```
4. **Open browser to:** `http://localhost:6006`

**Note:** This requires Node.js, pnpm, and repository access. Most designers prefer Option 1.

---

## 📚 How to Use Storybook

### Navigating the Interface

```
┌─────────────────────────────────────────────────────────┐
│  [Storybook Logo]    [Search]         [🔧 Settings]     │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Sidebar     │           Canvas (Component Preview)      │
│  (Stories)   │                                           │
│              │                                           │
│  ├─ Design   │  ┌───────────────────────────────────┐  │
│  │  ├─Colors │  │                                   │  │
│  │  ├─Typo   │  │     [Component Rendered Here]     │  │
│  │  └─Icons  │  │                                   │  │
│  ├─ Button   │  └───────────────────────────────────┘  │
│  ├─ Cards    │                                           │
│  └─ Forms    │  [Controls Panel - Adjust Props]         │
│              │  [Actions Panel - See Interactions]       │
└──────────────┴──────────────────────────────────────────┘
```

### 1. Browse Components (Left Sidebar)

**Design System:**
- **Colors** - Brand colors, semantic colors, accessibility guidelines
- **Typography** - Font sizes, weights, line heights, heading styles
- **Icons** - All available icons with copy-to-clipboard functionality
- **Spacing** - Margin and padding scale

**Core Components:**
- **Button** - Primary, secondary, danger, loading states
- **Cards** - Product cards, info cards, feature cards
- **Forms** - Input fields, dropdowns, toggles, radio buttons
- **Navigation** - Language selector, region selector, menus
- **Cart** - Add to cart button, cart drawer, cart button
- **Checkout** - Checkout wizard, checkout summary

**Features:**
- Click any story to view it in the canvas
- Expand/collapse sections with ▶️ arrows
- Search bar (top) finds components/stories quickly

### 2. View Component States

Each component has multiple "stories" showing different states:
- ✅ **Default** - Standard appearance
- 🔄 **Loading** - During async operations
- ⚠️ **Error** - Error state styling
- 🚫 **Disabled** - Non-interactive state
- 📱 **Mobile** - Small screen layout
- 💻 **Desktop** - Large screen layout

**Example:** Button component has:
- Button/Primary
- Button/Secondary
- Button/Danger
- Button/Loading
- Button/Disabled

### 3. Interact with Controls (Bottom Panel)

**Controls Panel** lets you modify component properties in real-time:
- 📝 **Text inputs** - Change button labels, descriptions
- 🎨 **Dropdowns** - Switch between variants (primary/secondary)
- ☑️ **Checkboxes** - Toggle features on/off (loading, disabled)
- 🎚️ **Sliders** - Adjust numeric values (quantity, size)

**Try it:**
1. Select "Button/Primary" story
2. Find Controls panel at bottom
3. Change "label" from "Click me" to "Buy Now"
4. Toggle "loading" checkbox to see loading spinner
5. Component updates instantly!

### 4. Check Responsive Behavior

**Viewport Toolbar (Top):**
- 📱 **Mobile** - 320px, 375px, 414px widths
- 📱 **Tablet** - 768px, 834px widths
- 💻 **Desktop** - 1024px, 1440px, 1920px widths

**Rotate icon** switches landscape/portrait mode.

### 5. View Interactive Tests

Some stories have automated interaction tests:
- Click **"Interactions" tab** (bottom panel)
- Watch automated user flows (clicks, typing, form submission)
- See pass/fail results for each test step

---

## 💬 Providing Feedback

### Method 1: Chromatic Comments (Best for Visual Feedback)

**On the published Storybook URL:**

1. **Hover over component area** - Comment icon appears
2. **Click to add comment** - Pin appears on specific element
3. **Type feedback:**
   - "Button color doesn't meet WCAG contrast requirements"
   - "Icon too small on mobile (should be 24px not 16px)"
   - "Card shadow feels too heavy, reduce opacity"
4. **Mention developers** - `@developer-name` for notifications
5. **Attach screenshots** - Drag/drop images to clarify

**Benefits:**
- Comments persist on specific components
- Developers see exactly what needs changing
- Visual context included automatically
- Thread-based discussions

### Method 2: GitHub Issues (For Feature Requests)

For larger design changes or new components:

1. Go to [GitHub Issues](https://github.com/ateece-bapi/bapi-headless/issues)
2. Click **"New issue"**
3. Title: "Design: [Component Name] - [Issue]"
4. Description:
   ```
   **Component:** Button/Primary
   **Issue:** Button needs more padding on mobile
   **Expected:** 12px vertical padding
   **Current:** 8px vertical padding
   **Screenshot:** [attach image]
   ```
5. Label: `design`, `ui/ux`
6. Assign to developer

### Method 3: Slack/Email (For Quick Questions)

For clarifications or quick feedback:
- Slack channel: `#design-dev-handoff` (if available)
- Email thread with screenshots + Storybook URL
- Reference specific story: "See Button/Danger/Hover state"

---

## 🔍 Design QA Checklist

When reviewing components in Storybook:

### Visual Design
- ✅ **Colors match brand guidelines** (BAPI Blue #1479BC, Yellow #FFC843)
- ✅ **Typography uses correct font** (Roboto for BAPI)
- ✅ **Spacing follows 8px grid** (multiples of 8px)
- ✅ **Icons are consistent size** (16px, 20px, 24px standard sizes)
- ✅ **Shadows/borders match design system**

### Responsive Design
- ✅ **Mobile view (320px-767px)** - Text readable, buttons touch-friendly
- ✅ **Tablet view (768px-1023px)** - Layout adapts gracefully
- ✅ **Desktop view (1024px+)** - Full feature set visible
- ✅ **No horizontal scrolling** on any viewport
- ✅ **Images scale properly** without distortion

### Interaction States
- ✅ **Default** - Normal resting state looks correct
- ✅ **Hover** - Clear visual feedback on hover
- ✅ **Focus** - Keyboard navigation visible (accessibility)
- ✅ **Active/Pressed** - Depressed button effect
- ✅ **Disabled** - Grayed out, no cursor pointer
- ✅ **Loading** - Spinner or skeleton state

### Accessibility
- ✅ **Color contrast** - Text meets WCAG AA (4.5:1)
- ✅ **Focus indicators** - Blue outline visible on tab
- ✅ **Touch targets** - Buttons min 44x44px on mobile
- ✅ **Alt text** - Images have descriptive labels
- ✅ **Error messages** - Clear, actionable, visible

### Content
- ✅ **Copy tone** - Matches brand voice (professional, helpful)
- ✅ **Label clarity** - Buttons/links have clear purpose
- ✅ **Error messages** - Specific and actionable
- ✅ **Placeholder text** - Provides examples, not instructions

---

## 🎨 Design System Reference

### Brand Colors (See in Storybook: Design System/Colors)

**Primary:**
- BAPI Blue: `#1479BC` - Buttons, links, highlights
- White: `#FFFFFF` - Backgrounds, text on dark
- Gray: `#97999B` - Secondary text, borders

**Accent:**
- Yellow: `#FFC843` - Warnings, highlights, CTAs

**Semantic:**
- Success: `#22c55e` (Green) - Confirmations, success messages
- Error: `#ef4444` (Red) - Errors, destructive actions
- Warning: `#ffc843` (Yellow) - Warnings, cautions
- Info: `#1479bc` (BAPI Blue) - Informational messages

**Usage Ratio:**
- 60% White/Gray (backgrounds, neutrals)
- 30% BAPI Blue (primary actions, branding)
- 10% Yellow (accents, highlights)

### Typography (See in Storybook: Design System/Typography)

**Font Family:**
- Primary: `Roboto` (BAPI standard)
- Fallback: `system-ui, sans-serif`

**Scale:**
- Display: `48px` - Hero headlines
- H1: `36px` - Page titles
- H2: `30px` - Section headers
- H3: `24px` - Subsection headers
- H4: `20px` - Card titles
- Body: `16px` - Paragraph text
- Small: `14px` - Captions, metadata
- XSmall: `12px` - Legal text

### Icons (See in Storybook: Design System/Icons)

**Standard Sizes:**
- Small: `16px` - Inline with text
- Medium: `20px` - Buttons, compact UI
- Large: `24px` - Touch targets, emphasis

**Sources:**
- Lucide React (primary icon library)
- Custom SVG (BAPI branded icons)

---

## 🚀 Common Designer Workflows

### 1. Review New Component

**Scenario:** Developer implemented a new ProductCard component.

1. **Open Storybook** → Navigate to "Products/ProductCard"
2. **Check all variants:**
   - ProductCard/Default
   - ProductCard/OnSale
   - ProductCard/OutOfStock
   - ProductCard/Loading
3. **Test responsive:**
   - Switch to Mobile viewport (375px)
   - Switch to Tablet viewport (768px)
   - Switch to Desktop viewport (1440px)
4. **Review interactions:**
   - Hover over card (elevation should increase)
   - Click "Add to Cart" button (should show loading)
5. **Leave feedback:**
   - Chromatic comment: "Card shadow too strong on hover"
   - GitHub issue if major changes needed

### 2. Design System Audit

**Scenario:** Ensure all components use consistent colors.

1. **Open "Design System/Colors"** - Screenshot brand colors
2. **Browse each component category:**
   - Button → Check primary button uses #1479BC
   - Cards → Check borders use gray-200
   - Forms → Check focus rings use primary-500
3. **Document inconsistencies:**
   - Create spreadsheet: Component | Element | Current Color | Expected Color
   - Share with dev team for batch fix

### 3. Accessibility Review

**Scenario:** Check WCAG compliance before launch.

1. **Open Storybook** → Enable "Accessibility" addon (bottom panel)
2. **Check each component:**
   - Green badge = Passes WCAG AA
   - Red badge = Violations found
3. **Review violations:**
   - Click violation to see details
   - Common issues: contrast, alt text, ARIA labels
4. **Document in GitHub Issues:**
   - Label: `accessibility`, `design`
   - Priority: `high` (blocks launch if violations)

### 4. Mobile-First Review

**Scenario:** Ensure mobile users have good experience.

1. **Set viewport to Mobile (375px)**
2. **Navigate all stories in mobile view:**
   - Button sizes (min 44x44px touch target)
   - Text readability (min 16px font size)
   - Forms usability (inputs easy to tap)
   - Navigation (hamburger menu, drawers)
3. **Test interactions:**
   - Tap/touch feel natural
   - No hover-only interactions (no mouse on mobile)
4. **Switch to landscape:** Some users browse horizontally

---

## 🎓 Learning Resources

### Storybook Documentation
- [Storybook for Designers](https://storybook.js.org/docs/react/get-started/designers) - Official guide
- [Storybook Controls](https://storybook.js.org/docs/react/essentials/controls) - Interactive props
- [Storybook Viewports](https://storybook.js.org/docs/react/essentials/viewport) - Responsive testing

### Chromatic Tutorials
- [Visual Review Workflow](https://www.chromatic.com/docs/review) - Commenting and approvals
- [Collaborate with Team](https://www.chromatic.com/docs/collaborators) - Invite designers
- [UI Review Mode](https://www.chromatic.com/docs/ui-review) - Designer-focused interface

### Design System Best Practices
- [Design Tokens](https://www.designtokens.org/) - Colors, spacing, typography
- [Component-Driven UX](https://www.componentdriven.org/) - Atomic design methodology
- [Inclusive Components](https://inclusive-components.design/) - Accessibility patterns

---

## 🛠️ Troubleshooting

### "Storybook URL doesn't load"
- **Check VPN:** Some company networks require VPN
- **Ask for access:** Chromatic may require team invite
- **Try incognito mode:** Clear browser cache issues

### "Can't leave comments"
- **Chromatic account required:** Sign in with GitHub
- **Check permissions:** Ask developer to add you as collaborator
- **Use published URL:** Comments work on chromatic.com, not localhost

### "Component looks different than design"
1. **Check viewport:** Ensure correct screen size (mobile vs desktop)
2. **Check story variant:** May be viewing "error" state instead of "default"
3. **Check for draft mode:** Component may be work-in-progress
4. **Compare to Figma:** Open your Figma file side-by-side
5. **Document differences:**
   - Take screenshots of both Storybook and Figma
   - List specific discrepancies (color, spacing, size, behavior)
   - Reference Figma frame/page link
6. **Leave feedback in Chromatic:**
   - Click comment icon on the specific element
   - Include: "Doesn't match Figma spec: [Figma link]"
   - Be specific: "Button padding is 12px, should be 16px per Figma"

### "Component doesn't match Figma specs"
**This is the most common issue - here's how to handle it:**

1. **Identify the discrepancy:**
   - Color off? Use Figma inspect panel to get exact hex code
   - Spacing wrong? Measure padding/margin in Figma
   - Interactive state missing? Check all Figma frames (hover, focus, active)

2. **Create detailed feedback:**
   ```
   Component: Button/Primary
   Issue: Background color doesn't match Figma
   Expected: #1479BC (BAPI Blue from Figma)
   Current: #1488CC (slightly lighter)
   Figma link: https://figma.com/file/...
   Screenshot: [attach both views]
   ```

3. **Choose feedback method:**
   - **Small fix** (color, spacing): Chromatic comment
   - **Large change** (layout, behavior): GitHub Issue with `design` label
   - **Multiple issues**: Create checklist in GitHub Issue

4. **Developer response timeline:**
   - Minor fixes: 1-2 business days
   - Major changes: Discussed in sprint planning

### "I want to make changes myself"
**Storybook is read-only for designers.** You cannot edit components directly.

**To make changes:**
1. **Update your Figma design** with the desired changes
2. **Share updated Figma link** with development team
3. **Create GitHub Issue** describing the changes:
   ```
   Title: [Design Update] Button Primary - New Hover State
   Description:
   - Updated Figma with new hover state design
   - Figma link: https://figma.com/file/...
   - Changes: Add 2px drop shadow on hover, reduce opacity to 90%
   - Priority: Medium (enhancement, not blocking)
   ```
4. **Developer implements** the changes
5. **You review** in Storybook once deployed

### "Need to test a new design"
- **Figma → Storybook workflow:**
  1. Designer creates mockup in Figma
  2. Share Figma link with developer
  3. Developer implements component in Storybook
  4. Designer reviews in Storybook, provides feedback
  5. Developer iterates until approved
  6. Developer merges to production

---

## 📞 Getting Help

**For Storybook Questions:**
- Ask your development team
- Slack: `#design-dev-handoff` or `#frontend`
- Email: Your assigned developer contact

**For Chromatic Access:**
- Request invite from repository owner/admin
- Provide GitHub username for permissions

**For Design Feedback:**
- Leave comments directly in Chromatic (best)
- Create GitHub Issues for larger changes
- Attend weekly design review meetings

---

## ✅ Designer Checklist

**Initial Setup:**
- [ ] Received published Storybook URL (Chromatic link)
- [ ] Created Chromatic account (sign in with GitHub)
- [ ] Bookmarked Storybook URL in browser
- [ ] Reviewed all Design System stories (Colors, Typography, Icons)
- [ ] Tested commenting feature on sample component

**Weekly Review:**
- [ ] Check Chromatic notifications for new components
- [ ] Review all open PRs with visual changes
- [ ] Verify brand consistency across new components
- [ ] Test responsive behavior on mobile/tablet/desktop
- [ ] Leave feedback via comments or GitHub issues

**Before Launch:**
- [ ] All components reviewed and approved in Chromatic
- [ ] Accessibility violations resolved (green badges)
- [ ] Mobile experience tested on actual devices
- [ ] Design system documentation complete
- [ ] Handoff notes provided to developers

---

## 🎉 Next Steps for Matt & Elly

1. **Get Access:**
   - Request Chromatic Storybook URL from development team
   - Sign in to Chromatic with your GitHub accounts
   - Bookmark the URL for daily use

2. **Explore Storybook:**
   - Spend 30 minutes browsing all component categories
   - Play with Controls panel to see component flexibility
   - Test different viewport sizes (mobile, tablet, desktop)
   - Review Design System section for brand guidelines

3. **Leave Test Feedback:**
   - Pick any component (e.g., Button/Primary)
   - Leave a test comment: "This button looks great! ✅"
   - Confirm developers receive your comment

4. **Establish Workflow:**
   - Decide: Chromatic comments vs GitHub Issues?
   - Set notification preferences (daily digest vs real-time)
   - Schedule weekly design review meeting with dev team

5. **Document Process:**
   - Create internal design wiki with Storybook workflow
   - Add Storybook link to onboarding docs for future designers
   - Share screenshots/videos for team training

---

**Welcome to the design-dev collaboration workflow! 🎨🤝💻**

Questions? Contact your development team or consult this guide anytime.
