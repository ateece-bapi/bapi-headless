# 2FA Staging Deployment Checklist

**Date Started:** March 2, 2026  
**Branch:** `deploy/2fa-staging`  
**Environment:** Kinsta Staging  
**Status:** 🔄 IN PROGRESS

---

## Pre-Deployment Checklist

- [x] All 2FA code merged to main
- [x] Integration tests passing (16/16)
- [x] Unit tests passing (52/52)
- [x] Documentation complete
- [x] Deployment branch created (`deploy/2fa-staging`)

---

## WordPress Plugin Deployment

### Step 1: Upload mu-plugin to Staging
**File:** `cms/wp-content/mu-plugins/graphql-2fa-extension.php`  
**Destination:** Kinsta staging `/wp-content/mu-plugins/`

**Methods:**
- [ ] **Option A:** Kinsta SFTP upload
  - Host: Get from Kinsta dashboard
  - Path: `/www/your-site/public/wp-content/mu-plugins/`
  - Upload: `graphql-2fa-extension.php`
  
- [ ] **Option B:** Git deployment (if configured)
  - Commit plugin to staging environment
  - Push to staging trigger branch

- [ ] **Option C:** WP-CLI (if SSH access available)
  ```bash
  # SSH into staging
  cd /www/your-site/public/wp-content/mu-plugins/
  # Upload file via SFTP first, then verify:
  wp plugin list --status=must-use
  ```

**Status:** ⏳ Pending  
**Notes:**

---

### Step 2: Configure Encryption Key
**File:** `wp-config.php` on staging  
**Required:** `TWO_FACTOR_ENCRYPTION_KEY` constant

**Generate Key:**
```bash
# Run locally to generate secure key
openssl rand -base64 32
```

**Add to wp-config.php (before "That's all, stop editing!"):**
```php
// Two-Factor Authentication Encryption Key
// WARNING: DO NOT commit this to version control
define('TWO_FACTOR_ENCRYPTION_KEY', 'YOUR-GENERATED-KEY-HERE');
```

**Access Methods:**
- [ ] Kinsta dashboard → Tools → wp-config.php editor
- [ ] SFTP download → edit → upload
- [ ] SSH + nano/vim (if available)

**Status:** ⏳ Pending  
**Key Generated:** ⏳ No  
**Key Added:** ⏳ No  
**Notes:**

---

### Step 3: Verify Plugin Installation
**GraphiQL Endpoint:** `https://staging.bapi.com/graphql`

**Test Query:**
```graphql
query TestTwoFactorFields {
  viewer {
    id
    email
    twoFactorEnabled
  }
}
```

**Expected Result:**
```json
{
  "data": {
    "viewer": {
      "id": "dXNlcjoxMjM=",
      "email": "test@example.com",
      "twoFactorEnabled": false
    }
  }
}
```

**Verification Steps:**
- [ ] GraphiQL loads without errors
- [ ] `twoFactorEnabled` field exists (should return `false` initially)
- [ ] No PHP errors in WordPress debug log
- [ ] Plugin appears in must-use plugins list

**Status:** ⏳ Pending  
**Notes:**

---

## GraphQL Mutation Testing

### Step 4: Test Setup Flow

**Mutation 1: Generate Secret (via Next.js API)**
```bash
# Call Next.js staging API
curl -X POST https://staging-frontend.vercel.app/api/auth/2fa/setup \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{}'
```

**Expected:**
- QR code data URL returned
- Secret string returned
- Backup codes array returned (10 codes)

**Status:** ⏳ Pending  
**Notes:**

---

**Mutation 2: Store Secret in WordPress**
```graphql
mutation EnableTwoFactor($secret: String!, $backupCodes: [String!]!) {
  updateTwoFactorSecret(
    input: {
      secret: $secret
      enabled: true
      backupCodes: $backupCodes
    }
  ) {
    success
    message
  }
}
```

**Variables:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": [
    "$2y$12$...", // bcrypt hashed codes
    "$2y$12$..."
    // ... 10 total
  ]
}
```

**Expected:**
```json
{
  "data": {
    "updateTwoFactorSecret": {
      "success": true,
      "message": "Two-factor authentication enabled successfully"
    }
  }
}
```

**Status:** ⏳ Pending  
**Notes:**

---

### Step 5: Test Verification Flow

**Test TOTP Code Verification:**
```bash
# Use authenticator app to generate code
# Then verify via Next.js API
curl -X POST https://staging-frontend.vercel.app/api/auth/2fa/verify-login \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "YOUR_TEMP_TOKEN",
    "code": "123456"
  }'
```

**Expected:**
- Valid code: Returns full auth token
- Invalid code: Returns error with rate limiting
- After 5 attempts: 15-minute lockout

**Status:** ⏳ Pending  
**Notes:**

---

### Step 6: Test Backup Code Flow

**Test Backup Code Usage:**
```bash
curl -X POST https://staging-frontend.vercel.app/api/auth/2fa/verify-login \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "YOUR_TEMP_TOKEN",
    "code": "1234-5678"
  }'
```

**Expected:**
- Valid backup code: Returns auth token, code marked as used
- Reused code: Returns error
- Invalid format: Returns error

**Status:** ⏳ Pending  
**Notes:**

---

### Step 7: Test Disable Flow

**Mutation: Disable 2FA**
```graphql
mutation DisableTwoFactor {
  disableTwoFactor(input: {}) {
    success
    message
  }
}
```

**Expected:**
```json
{
  "data": {
    "disableTwoFactor": {
      "success": true,
      "message": "Two-factor authentication disabled successfully"
    }
  }
}
```

**Verify:**
- [ ] `twoFactorEnabled` returns `false`
- [ ] `twoFactorSecret` returns `null`
- [ ] `twoFactorBackupCodes` returns `[]`

**Status:** ⏳ Pending  
**Notes:**

---

## Manual QA Testing

### Step 8: End-to-End User Flow

**Test Scenarios:**

#### Scenario A: First-Time Setup (Desktop)
- [ ] Navigate to /account/settings
- [ ] Click "Enable Two-Factor Authentication"
- [ ] See QR code displayed
- [ ] Scan with Google Authenticator (Android/iOS)
- [ ] Enter first TOTP code
- [ ] Verification succeeds
- [ ] Backup codes displayed
- [ ] Download backup codes .txt file
- [ ] Complete setup flow

**Browser:** Chrome, Firefox, Safari, Edge  
**Status:** ⏳ Pending  
**Issues Found:**

---

#### Scenario B: Login with 2FA (Mobile)
- [ ] Sign out of account
- [ ] Sign in with email/password
- [ ] Redirected to 2FA verification page
- [ ] See countdown timer (30 seconds)
- [ ] Open Google Authenticator app
- [ ] Enter 6-digit code
- [ ] Successfully logged in
- [ ] Redirected to dashboard

**Device:** iPhone (Safari), Android (Chrome)  
**Status:** ⏳ Pending  
**Issues Found:**

---

#### Scenario C: Backup Code Recovery
- [ ] Sign out of account
- [ ] Sign in with email/password
- [ ] At 2FA verification, click "Use backup code"
- [ ] Enter backup code (XXXX-XXXX format)
- [ ] Successfully logged in
- [ ] Try to reuse same backup code
- [ ] Verify code rejected (single-use)

**Status:** ⏳ Pending  
**Issues Found:**

---

#### Scenario D: Rate Limiting
- [ ] Sign out of account
- [ ] Sign in with email/password
- [ ] At 2FA verification, enter wrong code
- [ ] Repeat 4 more times (5 total)
- [ ] Verify account locked for 15 minutes
- [ ] Wait 15 minutes
- [ ] Verify can attempt again
- [ ] Enter correct code
- [ ] Successfully logged in

**Status:** ⏳ Pending  
**Issues Found:**

---

#### Scenario E: Disable 2FA
- [ ] Navigate to /account/settings
- [ ] See "Disable Two-Factor Authentication" button
- [ ] Click button
- [ ] Enter password confirmation
- [ ] Enter current TOTP code
- [ ] 2FA successfully disabled
- [ ] Badge shows "Disabled" status
- [ ] Sign out and sign in (no 2FA required)

**Status:** ⏳ Pending  
**Issues Found:**

---

## Security Verification

### Step 9: Security Checks

**Encryption Verification:**
- [ ] Check WordPress database `user_meta` table
- [ ] Verify `two_factor_secret` is encrypted (not plaintext)
- [ ] Verify backup codes are bcrypt hashed (start with `$2y$12$`)
- [ ] Verify no secrets in WordPress debug.log

**Token Security:**
- [ ] Temp tokens are JWT signed (not base64)
- [ ] Temp tokens expire after 5 minutes
- [ ] Auth tokens are HTTP-only cookies
- [ ] Secure flag enabled in production

**Rate Limiting:**
- [ ] Login rate limiting works (5 attempts)
- [ ] 2FA verification rate limiting works (5 attempts)
- [ ] IP + username tracking prevents bypass
- [ ] Lockout countdown timer accurate

**Status:** ⏳ Pending  
**Issues Found:**

---

## Performance Testing

### Step 10: Performance Metrics

**Baseline Measurements (without 2FA):**
- Login API response time: ___ ms
- GraphQL query response time: ___ ms
- Page load time: ___ ms

**With 2FA Enabled:**
- Setup API response time: ___ ms
- Verify-login API response time: ___ ms
- GraphQL query response time: ___ ms
- Page load time: ___ ms

**Acceptable Thresholds:**
- API overhead: < 50ms
- No degradation to non-2FA users
- QR code generation: < 500ms

**Status:** ⏳ Pending  
**Notes:**

---

## Documentation Review

### Step 11: Documentation Verification

**User-Facing Docs:**
- [ ] USER-GUIDE-2FA.md is accurate
- [ ] Authenticator app links work
- [ ] Screenshots match staging
- [ ] Troubleshooting steps tested

**Support Docs:**
- [ ] SUPPORT-2FA.md is complete
- [ ] Emergency access procedure documented
- [ ] Escalation paths defined
- [ ] Admin disable procedure tested

**Technical Docs:**
- [ ] WORDPRESS-2FA-EXTENSION-SETUP.md verified
- [ ] API route documentation accurate
- [ ] GraphQL schema examples work

**Status:** ⏳ Pending  
**Notes:**

---

## Deployment Completion

### Step 12: Final Checklist

**Pre-Production:**
- [ ] All staging tests passing
- [ ] No security issues found
- [ ] Performance within thresholds
- [ ] Documentation reviewed
- [ ] Support team trained
- [ ] Stakeholder demo complete

**Deployment Artifacts Created:**
- [ ] Deployment summary document
- [ ] Issues/bugs list (if any)
- [ ] Lessons learned
- [ ] Production deployment plan

**Status:** ⏳ Pending  
**Notes:**

---

## Issues Tracker

### Critical Issues
_None yet_

### Medium Priority Issues
_None yet_

### Low Priority / Enhancements
_None yet_

---

## Timeline

**Started:** March 2, 2026 (12:30 AM EST)  
**Plugin Upload:** ___  
**Encryption Key:** ___  
**GraphQL Testing:** ___  
**Manual QA:** ___  
**Security Verification:** ___  
**Completed:** ___

**Total Time:** ___ hours

---

## Next Steps

After staging deployment complete:
1. Create production deployment plan
2. Schedule production deployment window
3. Prepare rollback procedure
4. Brief support team
5. Set up monitoring alerts
6. Plan 24-hour post-deployment monitoring

**Production Target Date:** TBD (post-staging validation)
