# Onboarding Designers to Storybook - Developer Checklist

**For:** Matt (UI/UX Designer) and Elly (Graphic Designer)  
**Goal:** Enable designers to review components, provide feedback, and collaborate—no code required  
**Time Required:** ~30 minutes setup + 30 minutes training

---

## ✅ Pre-Onboarding: Get Chromatic Published URL

**What senior teams do:** Publish Storybook to Chromatic so designers can access via URL (no local setup needed).

### Step 1: Verify Chromatic Project Exists

```bash
# Check if CHROMATIC_PROJECT_TOKEN secret exists
# Go to: https://github.com/ateece-bapi/bapi-headless/settings/secrets/actions
# Verify: CHROMATIC_PROJECT_TOKEN is listed
```

If not set up yet:
1. Follow [CHROMATIC-QUICK-START.md](./CHROMATIC-QUICK-START.md)
2. Complete initial baseline capture (186 snapshots)
3. Get the project URL (format: `https://XXXXXX-XXXXXX.chromatic.com/`)

### Step 2: Get Published Storybook URL

**Option A: From Chromatic Dashboard**
1. Go to [chromatic.com/builds](https://www.chromatic.com/builds)
2. Click your project (`bapi-headless`)
3. Find "View Storybook" button (top right)
4. Copy URL - format: `https://main--XXXXXX-XXXXXX.chromatic.com/`

**Option B: From GitHub Action Run**
1. Go to [Actions](https://github.com/ateece-bapi/bapi-headless/actions/workflows/chromatic.yml)
2. Click latest successful run
3. Expand "Publish to Chromatic" step
4. Find output: `View your Storybook at https://...`
5. Copy URL

**Option C: Generate from Latest Commit**
```bash
# Trigger a manual Chromatic build
cd web
pnpm run chromatic

# Output will include:
# ✔ Storybook published to: https://...
```

**Save this URL!** You'll share it with Matt and Elly.

---

## ✅ Onboarding Checklist

### 1. Invite Designers to Chromatic (5 minutes)

**Senior teams add designers as "collaborators" so they can comment and approve.**

1. Go to [chromatic.com](https://www.chromatic.com/)
2. Select `bapi-headless` project
3. Click **Settings** → **Collaborators**
4. Click **"Invite Collaborator"**
5. Enter emails:
   - `matt@bapisensors.com` (UI/UX Designer)
   - `elly@bapisensors.com` (Graphic Designer)
6. Set role: **"Reviewer"** (can comment and approve, but can't publish builds)
7. Click **"Send Invite"**

**They'll receive email invites to:**
- Create Chromatic account (free for reviewers)
- Sign in with GitHub (recommended) or email
- Access the Storybook URL

### 2. Share Storybook Access Information (2 minutes)

Send Matt and Elly an email/Slack message:

```markdown
**Subject: Storybook Component Library Access**

Hi Matt and Elly,

We've set up Storybook for the BAPI Headless project! This lets you review all UI components, leave feedback, and collaborate with the dev team—no coding required.

**📚 Published Storybook URL:**
[INSERT YOUR CHROMATIC URL HERE]
Example: https://main--65e4a1b2c3d4e5f6g7h8.chromatic.com/

**🎓 Complete Designer Guide:**
https://github.com/ateece-bapi/bapi-headless/blob/main/docs/STORYBOOK-DESIGNER-GUIDE.md

**✨ Quick Start:**
1. Click the Storybook URL above (bookmark it!)
2. Check your email for Chromatic invite
3. Sign in to Chromatic (use GitHub account if you have one)
4. Browse components in left sidebar
5. Leave feedback by clicking comment icon

**📅 Training Session:**
Let's schedule a 30-minute walkthrough this week. I'll show you:
- How to navigate Storybook
- How to test responsive views (mobile/tablet/desktop)
- How to leave feedback via comments
- How to check design system consistency

Reply with your availability and I'll send a calendar invite.

Thanks!
[Your Name]
```

### 3. Prepare Training Materials (10 minutes)

**Senior teams create screen recordings or live demos.**

**Option A: Record Loom Video (Recommended)**
1. Go to [loom.com](https://www.loom.com/)
2. Click "Start Recording" (screen + webcam)
3. Record 10-15 minute demo:
   - Open Storybook URL
   - Navigate sidebar (Design System, Components)
   - Show Controls panel (adjust props)
   - Switch viewports (mobile/tablet/desktop)
   - Leave a test comment on a component
   - Review accessibility panel
4. Share Loom link with Matt and Elly

**Option B: Live Demo (Alternative)**
- Schedule 30-minute Zoom/Teams meeting
- Share screen showing Storybook
- Walk through designer guide sections
- Answer questions in real-time

**Key Topics to Cover:**
- ✅ Navigating component categories
- ✅ Testing responsive behavior (viewport toolbar)
- ✅ Using Controls panel to adjust props
- ✅ Leaving comments in Chromatic
- ✅ Checking accessibility compliance (green/red badges)
- ✅ Reviewing Design System (colors, typography, icons)

### 4. Set Up Feedback Workflow (5 minutes)

**Establish how designers will communicate feedback:**

**Recommended Workflow:**
```
1. Designer reviews component in Storybook
2. Designer leaves comment in Chromatic (for small issues)
   OR
3. Designer creates GitHub Issue (for larger changes)
4. Developer receives notification
5. Developer implements fix
6. Designer reviews updated component
7. Designer approves in Chromatic
8. Developer merges to main
```

**Create GitHub Issue Template for Designers:**

```bash
# Create file: .github/ISSUE_TEMPLATE/design-feedback.md
```

```markdown
---
name: Design Feedback
about: UI/UX or visual design feedback on components
title: '[Design] Component Name - Issue Description'
labels: design, ui/ux
assignees: ''
---

## Component
<!-- Example: Button/Primary, ProductCard/Default -->
[Component Name / Story Name]

## Storybook URL
<!-- Paste the direct link to the story -->
[URL from Chromatic]

## Issue Description
<!-- Clear description of the design issue -->

## Expected Behavior
<!-- What should it look like? Include Figma link if applicable -->

## Current Behavior
<!-- What does it currently look like? -->

## Screenshot
<!-- Attach screenshot showing the issue -->

## Suggested Fix
<!-- Optional: Specific CSS/design token suggestions -->

## Priority
- [ ] Blocks launch (must fix before April 10)
- [ ] Should fix (improves UX but not blocking)
- [ ] Nice to have (future enhancement)
```

### 5. Configure Notification Preferences (2 minutes)

**Help designers manage Chromatic notifications:**

1. **In Chromatic:**
   - Settings → Notifications
   - Recommended for designers:
     - ✅ New builds published (daily digest)
     - ✅ Comments on threads I'm in (real-time)
     - ❌ All build status updates (too noisy for designers)

2. **In GitHub:**
   - Watch repository → Custom → Issues only
   - Designers will get notified when assigned to issues

### 6. Grant Repository Access (If Needed)

**If designers need to create GitHub Issues:**

1. Go to [Repository Settings → Collaborators](https://github.com/ateece-bapi/bapi-headless/settings/access)
2. Click **"Add people"**
3. Enter GitHub usernames:
   - Matt's GitHub: `@matt-bapi` (example)
   - Elly's GitHub: `@elly-bapi` (example)
4. Set role: **"Triage"** (can create/edit issues, but can't push code)
5. Click **"Add to this repository"**

**Alternative:** Designers can email feedback if GitHub access not needed.

---

## 🎓 Training Session Agenda (30 minutes)

### Part 1: Storybook Tour (10 minutes)
- Open published Storybook URL
- Navigate sidebar (Design System, Components, Features)
- Click through Button stories (Primary, Secondary, Loading, Disabled)
- Show Controls panel - adjust label, toggle loading
- Switch viewports - Mobile (375px), Tablet (768px), Desktop (1440px)
- View Interactions panel - watch automated tests

### Part 2: Design System Review (10 minutes)
- **Colors story:** Brand colors, semantic colors, accessibility
- **Typography story:** Font sizes, weights, heading hierarchy
- **Icons story:** Icon library, sizes, copy-to-clipboard
- Show how to verify brand consistency across components

### Part 3: Feedback Workflow (10 minutes)
- **Chromatic comments:**
  - Hover over component → Click comment icon
  - Type feedback, mention developer
  - Thread-based discussions
- **GitHub Issues:**
  - When to use (larger changes, feature requests)
  - Use design-feedback template
  - Attach screenshots, reference Storybook URL
- **Response time expectations:**
  - Comments: 1-2 business days
  - Issues: Discussed in weekly sprint planning

### Part 4: Q&A (Open-ended)
- What components should we prioritize reviewing?
- Any concerns about current designs?
- Preferred feedback method (comments vs issues)?

---

## 📋 Post-Training Checklist

**Verify designers can:**
- [ ] Access published Storybook URL (bookmark saved)
- [ ] Sign in to Chromatic (account created)
- [ ] Navigate component categories
- [ ] Switch viewports (mobile/tablet/desktop)
- [ ] Use Controls panel to adjust props
- [ ] Leave a test comment in Chromatic
- [ ] Create a test GitHub Issue (if applicable)
- [ ] Find Design System section (Colors, Typography, Icons)
- [ ] Check accessibility panel (green/red badges)

**Ask for feedback:**
- [ ] Is anything confusing in the interface?
- [ ] Do you need additional documentation?
- [ ] Preferred notification frequency (real-time vs daily digest)?

---

## 🔄 Ongoing Maintenance

### Weekly Designer Sync (15 minutes)
- Review open design feedback issues
- Demo new components added to Storybook
- Discuss upcoming features (preview in Storybook)
- Address any accessibility violations

### Monthly Design Audit (1 hour)
- Review all components for brand consistency
- Check Design System compliance (colors, typography, spacing)
- Update Figma design library to match Storybook
- Document any design debt or inconsistencies

### Quarterly Accessibility Audit (2 hours)
- Run full accessibility scan on all stories
- Resolve all violations (green badges only)
- Update accessibility documentation
- Train team on new a11y patterns

---

## 🛠️ Troubleshooting

### "Designers can't access Storybook URL"
- **Check Chromatic privacy settings:** Project → Settings → Privacy
  - "Public" = Anyone with link can view
  - "Private" = Requires Chromatic account
  - Recommendation: "Public" for easier designer access

### "Comments not appearing in Chromatic"
- Verify designers are signed in (not viewing as guest)
- Check collaborator invites were accepted
- Ensure commenting on correct build (not draft/branch)

### "Designers want local Storybook access"
- Only needed for pre-publish review (rare)
- Share repository clone instructions
- Run: `cd web && pnpm install && pnpm run storybook`
- Open: `http://localhost:6006`
- **Note:** Most designers prefer published URL

### "Need to update published Storybook"
```bash
# Publish latest version to Chromatic
cd web
pnpm run chromatic

# Or trigger via GitHub Action:
# Push to main branch - Action runs automatically
```

---

## 📚 Reference Documentation

**For Designers:**
- [STORYBOOK-DESIGNER-GUIDE.md](./STORYBOOK-DESIGNER-GUIDE.md) - Complete no-code guide
- [Storybook for Designers](https://storybook.js.org/docs/react/get-started/designers) - Official docs
- [Chromatic Collaboration](https://www.chromatic.com/docs/collaborators) - Commenting workflow

**For Developers:**
- [CHROMATIC-QUICK-START.md](./CHROMATIC-QUICK-START.md) - Setup and baseline capture
- [STORYBOOK-SENIOR-LEVEL-ROADMAP.md](./STORYBOOK-SENIOR-LEVEL-ROADMAP.md) - Advanced patterns
- [Storybook Docs](https://storybook.js.org/docs) - Technical documentation

---

## ✅ Success Metrics

**After 1 week, designers should:**
- [ ] Review 5+ components in Storybook
- [ ] Leave 3+ comments via Chromatic
- [ ] Create 1+ GitHub Issues for design feedback
- [ ] Identify 2+ accessibility violations

**After 1 month, we should see:**
- [ ] Faster PR review cycles (visual approval in minutes)
- [ ] Fewer design bugs in production (caught in Storybook)
- [ ] Better design-dev collaboration (fewer misunderstandings)
- [ ] Consistent design system usage (measured by accessibility badges)

---

## 🎉 Summary for Matt & Elly

**What you'll get:**
- 🌐 Published Storybook URL (no installation needed)
- 💬 Chromatic commenting (leave feedback on specific components)
- 📱 Responsive testing (mobile/tablet/desktop views)
- ♿ Accessibility checking (WCAG compliance badges)
- 🎨 Design system reference (colors, typography, icons)
- 🔄 Live updates (see changes as developers implement)

**What we need from you:**
- Review components weekly in Storybook
- Flag visual inconsistencies or accessibility issues
- Approve components that meet design standards
- Participate in weekly design-dev sync meetings

**Training:**
- 30-minute walkthrough of Storybook interface
- Designer guide documentation (no code required)
- Ongoing support from development team

Let's make April 10, 2026 launch successful together! 🚀
