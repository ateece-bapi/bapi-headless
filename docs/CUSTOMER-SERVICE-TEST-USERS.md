# Customer Service Test User Setup

**Purpose:** Quick guide to create test accounts for Customer Service team members  
**Context:** Phase 1 stakeholder testing - Customer Service team testing headless site  
**Date Created:** June 3, 2026  
**Launch Date:** May 8, 2026 (5 days away)

---

## Quick Setup Options

### Option 1: WordPress Admin (Recommended - Easiest)

**Best for:** Non-technical setup, individual accounts

1. **Log in to WordPress Admin**
   - Staging: Contact DevOps for staging admin URL
   - Production: (wait for May 8 launch)

2. **Create User Account**
   - Go to: **Users → Add New**
   - Fill in:
     - **Username:** `firstname.lastname` (e.g., `sarah.johnson`)
     - **Email:** Use their BAPI email (e.g., `sarah.johnson@bapihvac.com`)
     - **First Name / Last Name:** Their actual name
     - **Role:** Select **Customer**
     - **Password:** Click "Generate Password" or set manually
     - ✅ Check "Send User Notification" (sends password reset email)
   - Click **Add New User**

3. **Share Login Instructions**
   - Site URL: `https://bapi-headless.vercel.app/en/sign-in`
   - Username: Their email address
   - Password: From email notification or shared securely

### Option 2: WP-CLI (Bulk Creation)

**Best for:** Creating multiple users at once

```bash
# SSH to WordPress server (get credentials from Kinsta dashboard)
# Replace with actual SSH details

# Create single user
wp user create sarah.johnson sarah.johnson@bapihvac.com \
  --role=customer \
  --display_name='Sarah Johnson' \
  --first_name='Sarah' \
  --last_name='Johnson' \
  --user_pass='TempPassword123!' \
  --send-email \
  --path=/www/bapiheadlessstaging_582/public

# Create multiple users (customize as needed)
for user in "sarah.johnson" "mike.chen" "lisa.garcia"; do
  wp user create $user ${user}@bapihvac.com \
    --role=customer \
    --display_name="$(echo $user | sed 's/\./ /g' | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')" \
    --user_pass='TempPassword123!' \
    --send-email \
    --path=/www/bapiheadlessstaging_582/public
done
```

---

## Customer Service Test User List

**Template for tracking:**

| Name | Email | Password | Date Created | Notes |
|------|-------|----------|--------------|-------|
| Sarah Johnson | sarah.johnson@bapihvac.com | *(sent via email)* | June 3, 2026 | CS Manager |
| Mike Chen | mike.chen@bapihvac.com | *(sent via email)* | June 3, 2026 | CS Rep |
| Lisa Garcia | lisa.garcia@bapihvac.com | *(sent via email)* | June 3, 2026 | CS Rep |

*Note: Do NOT commit passwords to repository. Store in secure password manager.*

---

## Login Instructions for Team Members

**Share this with Customer Service team:**

### How to Access the Headless Site

1. **Go to:** `https://bapi-headless.vercel.app/en/sign-in`

2. **Sign In:**
   - **Username or Email:** Use your BAPI email (e.g., sarah.johnson@bapihvac.com)
   - **Password:** Check your email for password reset link, or use temporary password provided

3. **First Login:**
   - You'll be prompted to change your password
   - Set a strong password you'll remember
   - Consider enabling 2FA for extra security (optional but recommended)

### What to Test

**Shopping Experience:**
- ✅ Browse products by category
- ✅ Search for products (try SKU numbers, keywords)
- ✅ View product details and datasheets
- ✅ Add products to cart
- ✅ Update quantities, remove items
- ✅ Apply discount codes
- ✅ Complete checkout process
- ✅ View order confirmation

**Account Management:**
- ✅ Update profile information
- ✅ Add/edit shipping addresses
- ✅ View order history (after placing test orders)
- ✅ Test "Forgot Password" flow
- ✅ Enable/disable 2FA

**Customer Service Scenarios:**
- ✅ Reorder previous products (repeat order workflow)
- ✅ Find products by part number vs SKU
- ✅ Filter products by category/subcategory
- ✅ Test mobile responsive design (phone/tablet)
- ✅ Language switching (11 languages available)
- ✅ Currency display (if applicable)

### Test Payment Methods

**IMPORTANT:** This is a test environment - use test credit cards ONLY

**Stripe Test Cards:**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **Expiry:** Any future date (e.g., 12/28)
- **CVV:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

**⚠️ NEVER use real credit cards on staging/test environments!**

---

## Feedback Collection

**Ask Customer Service team to document:**

1. **Bugs/Issues:**
   - What happened?
   - Steps to reproduce?
   - Expected vs actual behavior?
   - Screenshots if applicable

2. **UX Feedback:**
   - Anything confusing or unclear?
   - Missing information they expected?
   - Comparison to legacy site (better/worse)?

3. **Performance:**
   - Slow page loads?
   - Search response time?
   - Checkout speed?

**Feedback Submission:**
- Email to: (specify team contact - likely you or DevOps)
- Or: Create GitHub issues (if team has access)

---

## Troubleshooting

### "Invalid username or password"
- **Check:** Email address is typed correctly (no extra spaces)
- **Try:** Use email instead of username
- **Reset:** Click "Forgot password?" on sign-in page

### "Email not found"
- **Verify:** Account was created in WordPress
- **Check:** Spelling of email address
- **Admin:** Log in to WordPress Admin → Users to verify account exists

### Password Reset Email Not Received
- **Check:** Spam/junk folder
- **Verify:** Email address in WordPress user profile is correct
- **Alternative:** Admin can manually reset password via WordPress Admin → Users → Edit User

### Cannot Add to Cart / Checkout Issues
- **Clear Cache:** Browser cache and cookies
- **Try Different Browser:** Chrome, Firefox, Safari, Edge
- **Check Network:** Stable internet connection
- **Report:** If issue persists, document and report to DevOps

---

## Security Notes

1. **Test Accounts Only:** These accounts are for testing purposes
2. **No Real Orders:** Do not process real customer orders on test accounts
3. **Secure Passwords:** Use strong, unique passwords
4. **2FA Recommended:** Enable two-factor authentication for added security
5. **Staging vs Production:**
   - Staging: For testing and breaking things (safe to experiment)
   - Production: After May 8 launch (real customer data, be careful)

---

## Timeline Context

- **Current Date:** June 3, 2026
- **Launch Date:** May 8, 2026 (5 days away)
- **Stakeholder Testing Window:** April 10 - May 3, 2026
- **Status:** Final testing phase before production launch

**Urgency:** HIGH - Customer Service feedback critical for launch readiness

---

## Next Steps After Testing

1. **Compile Feedback:** Customer Service manager summarizes team feedback
2. **Prioritize Issues:** Critical bugs must be fixed before launch
3. **UX Improvements:** Phase 2 enhancements based on feedback
4. **Training Materials:** Create internal CS training docs based on testing insights

---

## Questions or Issues?

**Contact:** (Add your contact info here - email/Slack/Teams)

**Documentation:**
- [E2E Test Data Setup](E2E-TEST-DATA-SETUP.md) - Backend test data configuration
- [Create Test User Guide](CREATE-TEST-USER.md) - Technical test user setup (customer groups)
- [2FA User Guide](USER-GUIDE-2FA.md) - How to enable two-factor authentication
