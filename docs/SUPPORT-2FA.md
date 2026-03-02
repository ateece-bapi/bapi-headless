# Two-Factor Authentication Support Guide

**Audience:** BAPI Support Team  
**Last Updated:** March 2, 2026  
**Version:** 1.0

---

## 📋 Quick Reference

### Common Issues & Solutions

| Issue | Quick Fix | Escalate If |
|-------|-----------|-------------|
| Invalid code | Check phone time sync → auto | Persists after time sync |
| Lost phone | Guide user to backup codes | No backup codes available |
| Can't scan QR | Use manual entry option | Manual entry also fails |
| Too many attempts | Wait 15 minutes | User is locked out repeatedly |
| Locked account | Rate limit expires in 15min | User needs immediate access |

---

## 🎯 Support Objectives

1. **Resolve issues quickly** - Average handle time: 5 minutes
2. **Educate users** - Explain 2FA benefits during support
3. **Maintain security** - Verify identity before disabling 2FA
4. **Escalate appropriately** - Know when to involve development

---

## 🔍 Identifying the Issue

### Initial Questions

**When the user contacts support, ask:**

1. "What step are you on?"
   - Enabling 2FA (setup)
   - Signing in (verification)
   - Disabling 2FA (management)

2. "What error message are you seeing?"
   - "Invalid code"
   - "Too many attempts"
   - "Unable to connect"
   - No error, just stuck

3. "Do you have access to your authenticator app?"
   - Yes → Troubleshoot code generation
   - No → Guide to backup codes
   - Lost phone → Emergency access procedure

4. "Have you tried signing in from a different device or browser?"
   - Helps identify browser/cache issues

---

## 🛠️ Troubleshooting Procedures

### Issue 1: "Invalid Code" Error

**Cause:** Time synchronization issue (most common)

**Solution:**

1. **Check device time sync:**
   ```
   "Let's make sure your phone's clock is synchronized:
   
   iPhone:
   - Settings → General → Date & Time
   - Enable 'Set Automatically'
   
   Android:
   - Settings → System → Date & Time
   - Enable 'Automatic date & time'
   - Enable 'Automatic time zone'
   ```

2. **Restart authenticator app:**
   ```
   "Close the authenticator app completely (swipe up on iPhone,
   or tap Recent Apps on Android and swipe away). Then reopen
   it and try the new code."
   ```

3. **Verify correct account:**
   ```
   "Make sure you're using the code labeled 'BAPI' with your
   email address [user@example.com]. Some users have multiple
   BAPI accounts in their authenticator."
   ```

4. **Try next code:**
   ```
   "Wait for the current code to expire (watch the countdown
   timer). When the new code appears, enter that one immediately."
   ```

**If still failing:**
- Check if user is entering spaces or dashes
- Verify user is on BAPI's actual sign-in page (not phishing)
- Suggest using backup code instead
- Escalate if issue persists after trying 3 codes

---

### Issue 2: Lost Phone / No Access to Authenticator

**Identity Verification Required** ⚠️

**Step 1: Verify Identity**

Ask for **at least 3** of the following:
- Full name on account
- Email address
- Billing address (full)
- Last 4 digits of credit card on file
- Recent order number(s) with dates
- Phone number on account
- Company name (if B2B account)

**Step 2: Check for Backup Codes**

```
"Do you have the backup codes we provided when you set up
two-factor authentication? They're 8 characters with a hyphen,
like XXXX-XXXX."
```

**If Yes:**
- Guide user to "Use a backup code instead" link
- User can sign in and disable/re-enable 2FA
- No admin action needed

**If No:**
- Proceed to emergency access procedure

---

### Issue 3: Backup Codes Lost/Not Working

**Verify backup code format:**
- Should be uppercase letters and numbers
- Format: XXXX-XXXX (8 characters with hyphen)
- User may be entering extra characters

**Check usage:**
```
"Each backup code only works once. Have you used this code
before? If so, try a different one from your list of 10 codes."
```

**If all codes are used:**
- User needs emergency access (see below)
- After access restored, must disable and re-enable to get new codes

---

### Issue 4: Can't Scan QR Code

**Solution Hierarchy:**

1. **Adjust positioning:**
   ```
   "Try moving your phone closer to the screen, then slowly
   move it back until it focuses. Make sure your screen
   brightness is turned up."
   ```

2. **Use manual entry:**
   ```
   Click the 'Can't scan? Enter manually' link below the QR code.
   
   Then in your authenticator app:
   1. Tap the + or Add button
   2. Choose 'Manual Entry' or 'Enter Key'
   3. Copy the secret key from our website
   4. Paste it into the app
   5. Set Account Name to: BAPI
   6. Set Type to: Time-based
   7. Tap Save
   ```

3. **Try different app:**
   ```
   "Some authenticator apps scan better than others. Would you
   like to try Google Authenticator or Microsoft Authenticator?"
   ```

4. **Screenshot method (if app supports):**
   ```
   "Take a screenshot of the QR code. Then in your authenticator
   app, look for an option to import from Photos or Gallery."
   ```

---

### Issue 5: Too Many Failed Attempts (Rate Limited)

**Explanation:**
```
"For security, we lock accounts for 15 minutes after 5 failed
verification attempts. This protects against automated attacks."
```

**Options:**

1. **Wait it out:**
   ```
   "The lockout started at [time]. You can try again at [time + 15min].
   I'll stay on the line if you'd like."
   ```

2. **Use backup code:**
   ```
   "Alternatively, you can use one of your backup codes right now.
   Click 'Use a backup code instead' on the verification screen."
   ```

3. **Check for persistent issues:**
   - If user gets rate limited multiple times, escalate to dev team
   - May indicate brute force attempt or technical issue

---

### Issue 6: Wrong Account/Multiple Accounts

**Scenario:** User has multiple BAPI accounts with 2FA

**Solution:**
```
"It looks like you might have multiple BAPI accounts. Let's
figure out which one you're trying to sign into:

1. What email address are you using to sign in?
2. In your authenticator app, do you see multiple entries for BAPI?
3. Which one shows the email you're signing in with?

Use the code from that specific entry."
```

**Naming Tip:**
```
"To avoid confusion, you can rename entries in your authenticator:
1. Long-press the BAPI entry
2. Tap 'Edit' or the pencil icon
3. Change the name to 'BAPI - Work' or 'BAPI - Personal'"
```

---

## 🚨 Emergency Access Procedure

**CRITICAL:** Only perform after verifying user identity (see Issue 2, Step 1)

### When to Use

User needs immediate access and:
- Lost phone with no recovery
- No backup codes available
- Cannot wait for normal recovery process
- Business-critical need (urgent order, etc.)

### Procedure

**1. Document the Request**

Create ticket with:
- User's full name
- Account email
- Identity verification details (what you asked, what they provided)
- Reason for emergency access
- Timestamp
- Your agent ID

**2. Admin Disable 2FA** (WordPress Admin Required)

```bash
# Log into WordPress Admin Panel
URL: https://cms.bapi.com/wp-admin

# Navigate to:
Users → All Users → Search for [user email]

# Click on the user
# Scroll to "Two-Factor Authentication" section
# Check the box: "Administratively disable 2FA for this user"
# Click "Update User"
```

**OR via WP-CLI (if available):**
```bash
wp user meta delete [user_id] wp_two_factor_secret
wp user meta delete [user_id] wp_two_factor_backup_codes
wp user meta update [user_id] wp_two_factor_enabled 0
```

**3. Notify User**

**Email Template:**
```
Subject: Two-Factor Authentication Disabled - BAPI Account

Hi [Name],

Your two-factor authentication has been disabled by BAPI Support
as requested. You can now sign in using just your username and
password.

For security, we recommend re-enabling two-factor authentication:
1. Sign in to your account
2. Go to Account Settings → Security
3. Click "Enable Two-Factor Authentication"
4. Follow the setup wizard
5. Save your new backup codes

If you didn't request this change, please contact us immediately
at support@bapi.com or call 1-800-BAPI-XXX.

Ticket #: [ticket_number]
Agent: [Your Name]

Thank you,
BAPI Support Team
```

**4. Follow Up**

- Check if user successfully signed in (within 24 hours)
- Send reminder to re-enable 2FA (after 48 hours)
- Close ticket when user confirms re-enablement

---

## 🔄 Switching Devices

### Planned Device Change

**User is proactive:**

**Option 1: Transfer App Data (Best)**
```
"If you're using Authy, Microsoft Authenticator, or 1Password,
these apps support cloud backup. You can:

1. On old phone: Settings → Backup → Enable
2. On new phone: Install app → Sign in → Restore backup
3. BAPI will automatically appear on your new phone

No action needed on the BAPI website."
```

**Option 2: Disable & Re-enable**
```
1. While you still have your old phone:
   - Sign in to BAPI
   - Go to Account Settings → Security
   - Disable two-factor authentication (requires password + current code)
   
2. On your new phone:
   - Install authenticator app
   - Sign back in to BAPI
   - Re-enable two-factor authentication
   - Scan new QR code
   - Save new backup codes
```

### Emergency Device Change

**User already lost old phone:**
- Follow "Emergency Access Procedure" above
- User must have backup codes OR verified identity

---

## 📊 Metrics & Reporting

### Track These Metrics

**Support KPIs:**
- Average handle time for 2FA issues
- First-call resolution rate
- Escalation rate
- Emergency access requests per week
- User satisfaction score

**Issue Frequency:**
- "Invalid code" errors
- Lost phone requests
- Rate limit lockouts
- QR scanning problems
- Browser compatibility issues

**Report Weekly:**
- Total 2FA-related tickets
- Top 3 issues
- Trends (increasing/decreasing)
- Recommendations for improvements

---

## 🔒 Security Guidelines

### ✅ DO:

- Always verify identity before disabling 2FA
- Document all emergency access requests
- Educate users about backup codes during setup
- Report suspicious activity (multiple lockouts, etc.)
- Keep user data confidential

### ❌ DON'T:

- Disable 2FA without identity verification
- Share admin credentials
- Access user accounts without authorization
- Store user passwords or codes
- Skip documentation steps

### 🚩 Red Flags (Escalate Immediately):

- User can't answer identity verification questions
- User is asking to disable 2FA for someone else
- User has been locked out multiple times (possible hacking)
- User's email address was recently changed
- User mentions receiving suspicious emails/texts

---

## 🎓 Training Resources

### New Agent Onboarding

**Week 1: Theory**
- What is 2FA/TOTP?
- Why does BAPI use it?
- Security benefits overview
- Common user concerns

**Week 2: Practice**
- Set up 2FA on test account
- Try all authenticator apps (Google, Authy, Microsoft)
- Test backup codes
- Simulate lost phone scenario

**Week 3: Shadowing**
- Listen to 5 2FA support calls
- Review 10 2FA tickets
- Practice with mentor

**Week 4: Live with Review**
- Handle 2FA tickets with spot checks
- Escalate complex issues
- Document learnings

### Ongoing Training

**Monthly:**
- Review most common issues that month
- Share success stories
- Update procedures based on feedback

**Quarterly:**
- Security awareness training
- New feature announcements
- Team knowledge sharing

---

## 🔧 Technical Details (For Advanced Support)

### How TOTP Works

**Time-Based One-Time Password (TOTP):**
- Uses a shared secret + current time
- Generates new 6-digit code every 30 seconds
- Clock drift tolerance: ±1 window (30 seconds before/after)
- Algorithm: HMAC-SHA1
- Standard: RFC 6238

**Why codes expire:**
- Security: prevents replay attacks
- Synchronization: requires time sync between devices

### System Architecture

```
User Device                 BAPI Frontend              WordPress Backend
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│ Authenticator│            │  Next.js    │            │ WP GraphQL  │
│ App (Phone) │            │  (Vercel)   │            │  (Kinsta)   │
│             │            │             │            │             │
│ Generates   │────────────▶│ Receives    │────────────▶│ Verifies    │
│ TOTP Code   │  Enters    │ Code        │  Checks    │ Against     │
│ (345678)    │  in form   │             │  via API   │ Secret      │
└─────────────┘            └─────────────┘            └─────────────┘
```

**Key Points:**
- Secrets never leave WordPress database (encrypted)
- Verification happens server-side
- Rate limiting at Next.js layer
- Backup codes hashed with bcrypt

### Database Schema

**WordPress user_meta:**
```
meta_key: wp_two_factor_secret
meta_value: [encrypted secret] (libsodium)

meta_key: wp_two_factor_backup_codes
meta_value: [JSON array of hashed codes] (bcrypt)

meta_key: wp_two_factor_enabled
meta_value: 1 (enabled) or 0 (disabled)
```

### API Endpoints

**Setup:**
```
POST /api/auth/2fa/setup
Response: { qrCode, secret, uri, backupCodes }
```

**Enable:**
```
POST /api/auth/2fa/verify-setup
Body: { code }
Response: { success: true }
```

**Verify Login:**
```
POST /api/auth/2fa/verify-login
Body: { tempToken, code, isBackupCode }
Response: Sets auth_token cookie → authenticated
```

**Disable:**
```
POST /api/auth/2fa/disable
Body: { password, code }
Response: { success: true }
```

### Debugging Tools

**Check if user has 2FA enabled:**
```graphql
query {
  user(id: "email@example.com") {
    twoFactorEnabled
  }
}
```

**View rate limit status (dev only):**
```bash
# Check Redis cache (if available)
redis-cli
> GET rate-limit:[ip]:[username]
```

**Logs Location:**
```
Next.js: Vercel Dashboard → Logs
WordPress: Kinsta → Error Logs
```

---

## 📞 Escalation Paths

### Level 1: Support Team (You)
- Handle common issues (90% of tickets)
- Use documented procedures
- Emergency access (with approval)

### Level 2: Support Lead
- Complex identity verification
- Policy exceptions
- Multiple emergency access requests
- User claiming account compromise

### Level 3: Engineering Team
- System errors (500, timeouts)
- Rate limit issues persisting
- QR generation failures
- Backup code validation bugs
- Security vulnerabilities

### Level 4: Security Team
- Suspected account takeover
- Brute force detection
- Data breach inquiries
- Compliance questions

**Escalation Template:**
```
To: engineering@bapi.com
Subject: [URGENT/NORMAL] 2FA Issue - [Brief Description]

Ticket #: [number]
User: [email]
Issue: [detailed description]
Steps Taken: [what you tried]
Error Messages: [exact text or screenshots]
System Info: [browser, device, time]
Impact: [how many users affected]
```

---

## 🆘 Emergency Contacts

**During Business Hours (8am-5pm EST):**
- Support Lead: [lead@bapi.com](mailto:lead@bapi.com)
- Engineering: [eng@bapi.com](mailto:eng@bapi.com)
- Security: [security@bapi.com](mailto:security@bapi.com)

**After Hours (Critical Issues Only):**
- On-Call Engineer: [See PagerDuty]
- Security Hotline: [See confidential doc]

**Critical Issue Definition:**
- Multiple users unable to sign in
- System-wide 2FA failures
- Suspected security breach
- Data loss/corruption

---

## 📚 Additional Resources

**Internal Knowledge Base:**
- [Link to 2FA Setup Video]
- [Link to Admin Procedures]
- [Link to Security Policies]

**External Documentation:**
- User Guide: `/docs/USER-GUIDE-2FA.md`
- Technical Docs: `/docs/2FA-IMPLEMENTATION-PLAN.md`
- API Reference: `/docs/2FA-API-ROUTES-REVIEW.md`

---

## 🔄 Document Updates

**Change Log:**

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-02 | 1.0 | Initial document | GitHub Copilot |

**Review Schedule:**
- Monthly: Update metrics and common issues
- Quarterly: Full procedure review
- As needed: After system changes or security incidents

**Feedback:**
Submit suggestions to [support-docs@bapi.com](mailto:support-docs@bapi.com)

---

**Document Owner:** Support Team Lead  
**Last Reviewed:** March 2, 2026  
**Next Review:** June 2, 2026
