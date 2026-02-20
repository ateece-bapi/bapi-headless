# Storybook Designer Access - Admin Setup Guide
**For Repository Owners/Admins - Setting Up Matt & Elly**

## 📋 Overview

This guide walks you (Andrew) through giving Matt (UI/UX) and Elly (Graphic Design) access to Storybook via Chromatic. **Total time: 10-15 minutes**

---

## ✅ Prerequisites (Already Complete)

- [x] Chromatic account created
- [x] Chromatic project connected to `ateece-bapi/bapi-headless`
- [x] GitHub Action workflow publishing Storybook automatically
- [x] 186 baselines accepted

---

## Step 1: Chromatic Project URLs ✅ (Already Complete)

**Your BAPI Headless Storybook is published at:**

- **📚 Main Storybook URL:** https://69790f14a4a9ebfab83a9f49-main.chromatic.com
  - Share this URL with Matt and Elly
  - Bookmark this for yourself
  - Updates automatically on every main branch commit

- **🔧 Chromatic Dashboard:** https://www.chromatic.com/builds?appId=69790f14a4a9ebfab83a9f49
  - Manage collaborators
  - View build history (186 baselines accepted)
  - Review visual diffs and PR comparisons

- **⚙️ Project Settings:** https://www.chromatic.com/manage?appId=69790f14a4a9ebfab83a9f49
  - Add/remove team members
  - Configure notifications
  - Manage billing (currently free tier)

**Project ID:** `69790f14a4a9ebfab83a9f49`

---

## Step 2: Invite Matt to Chromatic (3 minutes)

1. **Go to Chromatic Project Settings:**
   - Visit: https://www.chromatic.com/manage?appId=69790f14a4a9ebfab83a9f49
   - Or from dashboard: Click **"Manage"** » **"Collaborators"**

2. **Add Matt as Collaborator:**
   - Click **"Invite member"** or **"Add collaborator"**
   - Enter Matt's email: `matt@bapisensors.com` (or his work email)
   - Role: **"Reviewer"** or **"Designer"** (if available)
     - Reviewers can view, comment, approve/reject changes
     - They **cannot** publish new builds or change settings
   - Click **"Send invite"**

3. **GitHub Access (Optional but Recommended):**
   - If Matt has a GitHub account, invite him to the `ateece-bapi/bapi-headless` repository
   - Role: **"Read"** access is sufficient (can view PRs, leave comments)
   - Settings → Collaborators → Add people → `matt-github-username`
   - This allows him to see PRs and GitHub integration

4. **Notify Matt:**
   - Email Matt with:
     - Chromatic invite link (he'll get this automatically)
     - Main Storybook URL: https://69790f14a4a9ebfab83a9f49-main.chromatic.com
     - Link to designer guide: https://github.com/ateece-bapi/bapi-headless/blob/main/docs/STORYBOOK-DESIGNER-GUIDE.md
   - Example email template below

---

## Step 3: Invite Elly to Chromatic (3 minutes)

**Repeat Step 2 for Elly:**
- Email: `elly@bapisensors.com` (or her work email)
- Role: **"Reviewer"** or **"Designer"**
- Optional: GitHub read access if she has an account
- Send notification email (template below)

---

## Step 4: Update Documentation (5 minutes)

**Add actual URLs to designer guide:**

1. Open `docs/STORYBOOK-DESIGNER-GUIDE.md`
2. Find this section (line ~23):
   ```markdown
   1. **Get the URL from your team:**
      - Ask your development team for the **Chromatic Storybook URL**
      - It looks like: `https://XXXXXX-XXXXXX.chromatic.com/`
   ```
3. Replace with actual URLs:
   ```markdown
   1. **Access the Published Storybook:**
      - **Main Branch (Latest):** https://YOUR_PROJECT_ID-main.chromatic.com
      - **Chromatic Dashboard:** https://www.chromatic.com/builds?appId=YOUR_PROJECT_ID
      - Bookmark the Main Branch URL for daily use
   ```

4. Add a "Quick Access" section at the top:
   ```markdown
   ## 🚀 Quick Access Links
   
   **Main Storybook (Always Current):**  
   https://YOUR_PROJECT_ID-main.chromatic.com
   
   **Chromatic Dashboard (View All Builds):**  
   https://www.chromatic.com/builds?appId=YOUR_PROJECT_ID
   
   **GitHub Repository:**  
   https://github.com/ateece-bapi/bapi-headless
   ```

---

## Step 5: Send Welcome Email to Designers (5 minutes)

**Email Template for Matt:**

```
Subject: Storybook Access for BAPI Headless Project 🎨

Hi Matt,

You now have access to our Storybook component library! This is a living documentation of all UI components we're building for the new BAPI website.

🚀 QUICK LINKS:
• Main Storybook: https://69790f14a4a9ebfab83a9f49-main.chromatic.com
• Chromatic Dashboard: https://www.chromatic.com/builds?appId=69790f14a4a9ebfab83a9f49
• Designer Guide: https://github.com/ateece-bapi/bapi-headless/blob/main/docs/STORYBOOK-DESIGNER-GUIDE.md

📝 GETTING STARTED:
1. Check your email for Chromatic invite (from notifications@chromatic.com)
2. Click "Accept Invite" and sign in with your GitHub account (or create Chromatic account)
3. Bookmark the Main Storybook URL above
4. Read the Designer Guide (15 minutes) to learn how to navigate and provide feedback
5. Explore for 30 minutes - click around, test different components

💬 HOW TO LEAVE FEEDBACK:
• Click "Comment" button in Chromatic toolbar
• Click anywhere on a component to place a feedback pin
• Type your feedback and tag me: @ateece
• I'll get notified immediately

🎯 WHAT TO REVIEW:
• Design System → Colors (brand palette)
• Design System → Typography (fonts, sizes)
• Design System → Icons (all icons searchable)
• Components → Product Card (key ecommerce component)
• Components → Checkout Wizard (checkout flow)

We have 122+ component stories covering buttons, forms, product cards, checkout flow, navigation, and more. Everything is interactive and responsive (test mobile/tablet/desktop views).

Let me know if you have any questions! I'm happy to schedule a 30-minute walkthrough if helpful.

Thanks!
Andrew
```

**Copy/paste for Elly with same links.**

---

## Step 6: Schedule Optional Walkthrough (15-30 minutes)

**If Matt or Elly need hands-on training:**

1. **Schedule Zoom/Teams meeting** (30 minutes)
2. **Demo Agenda:**
   - Show how to navigate Storybook sidebar (5 min)
   - Demonstrate Controls panel (change props) (5 min)
   - Show responsive viewport switching (5 min)
   - Practice leaving a comment in Chromatic (5 min)
   - Review accessibility tab (5 min)
   - Q&A (5 min)

3. **Share Screen:**
   - Walk through 3-5 key components live
   - Show PR review workflow (if available)
   - Demonstrate visual diff feature

4. **Follow-up:**
   - Send recording link if recorded
   - Ask them to leave test comment on any component
   - Schedule weekly design review sync (optional)

---

## 🔐 Security Best Practices

**Chromatic Permissions:**
- ✅ **Reviewers** can view and comment (perfect for Matt & Elly)
- ❌ **Don't give** "Admin" or "Owner" roles to non-developers
- ❌ **Don't share** Chromatic project token (`CHROMATIC_PROJECT_TOKEN`)

**GitHub Permissions:**
- ✅ **Read access** allows viewing code and PRs
- ❌ **Don't give** write access unless they need to commit code
- ✅ **Consider** creating GitHub Teams: `designers` with read-only access

**Storybook URLs:**
- ✅ **Main branch URL** is safe to share (public or team-only depending on Chromatic settings)
- ✅ **PR preview URLs** can be shared for specific feedback
- ⚠️ **Check** if Chromatic project is set to "Private" or "Public"
  - Private: Only invited collaborators can view
  - Public: Anyone with URL can view (no commenting without account)

---

## 📊 Usage Monitoring (Optional)

**Track Designer Engagement:**
- Chromatic dashboard shows comment activity
- GitHub shows PR review participation
- Google Analytics on Storybook URL (if configured)

**Metrics to Watch:**
- Number of comments per week (target: 3-5 per designer)
- PR review turnaround time (target: < 24 hours)
- Components approved vs rejected ratio

---

## 🎓 Training Resources to Share

**Storybook Basics:**
- [Storybook for Designers Tutorial](https://storybook.js.org/tutorials/design-systems-for-developers/)
- [Chromatic for Design Teams](https://www.chromatic.com/docs/review)

**Internal Documentation:**
- `docs/STORYBOOK-DESIGNER-GUIDE.md` - Comprehensive designer guide (from this repo)
- `docs/CHROMATIC-QUICK-START.md` - Developer guide (for reference)
- `README.md` - Project overview

**Video Walkthroughs (Create if Helpful):**
- Loom recording: "How to Navigate Storybook" (5-10 minutes)
- Loom recording: "Leaving Feedback in Chromatic" (3-5 minutes)
- Loom recording: "Reviewing PRs for Visual Changes" (5 minutes)

---

## ✅ Post-Setup Checklist

**Verify Matt & Elly Can:**
- [ ] Access main Storybook URL (no 404 or permission errors)
- [ ] Sign in to Chromatic with their accounts
- [ ] View all component stories (122+ stories visible)
- [ ] Leave comments on components (test comment successfully posted)
- [ ] See responsive viewports (mobile/tablet/desktop switcher works)
- [ ] Access Controls panel (can change component props)
- [ ] View accessibility tab (violations show in bottom panel)

**Follow-Up Tasks:**
- [ ] Confirm designers received invite emails
- [ ] Verify they successfully signed in
- [ ] Ask them to leave test comment on any component
- [ ] Schedule optional walkthrough meeting if needed
- [ ] Add Storybook URL to team wiki/Notion/Confluence
- [ ] Update project README with designer access instructions

---

## 🚨 Troubleshooting Common Issues

### "I can't access the Storybook URL"
**Solution:**
- Check if Chromatic project is set to "Private"
- Verify designer accepted Chromatic invite
- Confirm designer is logged in to Chromatic account
- Try incognito/private browsing mode (clear cache)

### "I don't see the Chromatic invite email"
**Solution:**
- Check spam/junk folder
- Resend invite from Chromatic settings
- Try different email address
- Ask them to create Chromatic account first, then invite

### "Components are broken or not loading"
**Solution:**
- Check if GitHub Action workflow succeeded (no build errors)
- Verify Storybook was published successfully (check Chromatic build status)
- Try different browser (Chrome, Safari, Firefox)
- Clear browser cache and reload

### "I can't leave comments"
**Solution:**
- Verify designer is signed in to Chromatic (not anonymous)
- Check if designer has Reviewer role (not just view-only)
- Try clicking "Comment" button in toolbar first
- Contact Chromatic support if issue persists

### "PR previews aren't showing"
**Solution:**
- Verify GitHub Action workflow is enabled for PRs
- Check if PR has UI changes (workflow may skip if no changes)
- Confirm CHROMATIC_PROJECT_TOKEN secret is set
- Review GitHub Action logs for errors

---

## 📞 Support Contacts

**Chromatic Support:**
- Email: support@chromatic.com
- Docs: https://www.chromatic.com/docs
- Status: https://status.chromatic.com

**Internal:**
- Repository Admin: Andrew (ateece@bapisensors.com)
- UI/UX Designer: Matt
- Graphic Designer: Elly

---

## 🎉 You're Done!

Matt and Elly now have full access to:
- ✅ Published Storybook (main branch always up-to-date)
- ✅ Chromatic collaboration features (comments, approvals)
- ✅ Visual diff reviews (see what changed in PRs)
- ✅ All 122+ component stories
- ✅ Design system documentation (colors, typography, icons)

**Next Steps:**
1. Designers explore Storybook for 30 minutes
2. They leave test comments on 2-3 components
3. You review their feedback and respond
4. Establish weekly design review sync (optional)
5. Add Storybook URL to team wiki/onboarding docs

**Questions?** Reference this guide or contact Chromatic support.

---

## 📋 Quick Reference - Your Project URLs

**Copy/paste these URLs as needed:**

```
Main Storybook (share with designers):
https://69790f14a4a9ebfab83a9f49-main.chromatic.com

Chromatic Builds Dashboard:
https://www.chromatic.com/builds?appId=69790f14a4a9ebfab83a9f49

Chromatic Project Settings (manage collaborators):
https://www.chromatic.com/manage?appId=69790f14a4a9ebfab83a9f49

Designer Guide (for Matt & Elly):
https://github.com/ateece-bapi/bapi-headless/blob/main/docs/STORYBOOK-DESIGNER-GUIDE.md

GitHub Repository:
https://github.com/ateece-bapi/bapi-headless

Project ID: 69790f14a4a9ebfab83a9f49
```

