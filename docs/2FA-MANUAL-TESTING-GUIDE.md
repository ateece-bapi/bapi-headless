# 2FA API Routes - Manual Testing Guide

This guide provides step-by-step instructions for manually testing the 2FA API routes using curl or a REST client (Postman/Insomnia).

## Prerequisites

1. **WordPress Backend**: Ensure the `graphql-2fa-extension.php` mu-plugin is installed
2. **Environment**: Set `TWO_FACTOR_ENCRYPTION_KEY` in WordPress `wp-config.php`
3. **Test User**: Create a test user account (or use existing)
4. **Tools**: curl, Postman, or Insomnia

## Environment Setup

```bash
# Set your environment
export API_BASE="http://localhost:3000"  # Local development
# export API_BASE="https://staging.bapi.com"  # Staging
# export API_BASE="https://bapi.com"  # Production

# Test credentials
export TEST_USERNAME="testuser"
export TEST_PASSWORD="test-password-123"
export TEST_EMAIL="testuser@example.com"
```

## Test Flow Overview

```
1. Login → Get auth token
2. Setup 2FA → Get QR code + backup codes
3. Scan QR code in authenticator app (Google Authenticator, Authy, etc.)
4. Verify setup → Enable 2FA
5. Logout → Clear cookies
6. Login again → Requires 2FA
7. Verify login → Complete authentication
8. Disable 2FA (optional)
```

---

## Test 1: Initial Login (No 2FA)

**Purpose**: Get authentication token for subsequent requests

```bash
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$TEST_USERNAME"'",
    "password": "'"$TEST_PASSWORD"'"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "testuser@example.com",
    "displayName": "Test User",
    "username": "testuser"
  }
}
```

**Verification**:
- ✅ Response has `success: true`
- ✅ User object is present
- ✅ Cookies file created with `auth_token` and `refresh_token`

---

## Test 2: Setup 2FA

**Purpose**: Generate TOTP secret and backup codes

```bash
curl -X POST "$API_BASE/api/auth/2fa/setup" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "secret": "JBSWY3DPEHPK3PXP",
  "uri": "otpauth://totp/BAPI:testuser@example.com?secret=JBSWY3DP...",
  "backupCodes": [
    "A3B7K9Q2",
    "X5M2P8L4",
    "K9N4T6R1",
    "M8P3L5S7",
    "Q2W9E4R6",
    "T7Y1U3I5",
    "O8P0A2S4",
    "D9F6G3H8",
    "J4K5L7Z9",
    "X1C2V3B4"
  ]
}
```

**Verification**:
- ✅ `qrCode` is a base64 PNG data URL
- ✅ `secret` is alphanumeric (16+ characters)
- ✅ `uri` starts with `otpauth://totp/`
- ✅ `backupCodes` array has 10 codes (8 chars each)

**Manual Step**: 
1. Save the `secret` value for next test
2. Open authenticator app (Google Authenticator, Authy, etc.)
3. Add account manually using the secret OR scan the QR code
4. App should show 6-digit codes that change every 30 seconds

---

## Test 3: Verify Setup (Enable 2FA)

**Purpose**: Verify first TOTP code to enable 2FA

```bash
# Get code from your authenticator app (e.g., "123456")
export TOTP_CODE="123456"

curl -X POST "$API_BASE/api/auth/2fa/verify-setup" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "code": "'"$TOTP_CODE"'"
  }' \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Two-factor authentication enabled successfully"
}
```

**Error Cases**:

**Invalid Code Format** (400):
```bash
# Code too short
curl -X POST "$API_BASE/api/auth/2fa/verify-setup" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code": "123"}' \
  -v
```
Expected: `{ "error": "Invalid code format" }`

**Wrong Code** (400):
```bash
curl -X POST "$API_BASE/api/auth/2fa/verify-setup" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code": "000000"}' \
  -v
```
Expected: `{ "error": "Invalid code" }`

**Verification**:
- ✅ Success response returned
- ✅ 2FA is now enabled for the user

---

## Test 4: Logout

**Purpose**: Clear authentication cookies

```bash
# Delete cookies file to simulate logout
rm cookies.txt
```

---

## Test 5: Login with 2FA

**Purpose**: Verify login flow branches correctly for 2FA-enabled user

```bash
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$TEST_USERNAME"'",
    "password": "'"$TEST_PASSWORD"'"
  }' \
  -c cookies-temp.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": false,
  "requires2FA": true,
  "tempToken": "eyJ1c2VySWQiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImF1...",
  "message": "Two-factor authentication required"
}
```

**Verification**:
- ✅ `success: false` (login not complete yet)
- ✅ `requires2FA: true`
- ✅ `tempToken` is present (base64 string)
- ✅ NO cookies set (auth incomplete)

**Save the tempToken**:
```bash
export TEMP_TOKEN="<tempToken value from response>"
```

---

## Test 6: Verify Login with TOTP Code

**Purpose**: Complete authentication using TOTP code

```bash
# Get current code from authenticator app
export TOTP_CODE="654321"

curl -X POST "$API_BASE/api/auth/2fa/verify-login" \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "'"$TEMP_TOKEN"'",
    "code": "'"$TOTP_CODE"'",
    "useBackupCode": false
  }' \
  -c cookies.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

**Verification**:
- ✅ Success response
- ✅ Cookies file created with `auth_token` and `refresh_token`
- ✅ User is now authenticated

---

## Test 7: Verify Login with Backup Code

**Purpose**: Test backup code flow (one-time use)

```bash
# Use one of the backup codes from Test 2
export BACKUP_CODE="A3B7K9Q2"

# Logout first
rm cookies.txt

# Login to get tempToken
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$TEST_USERNAME"'",
    "password": "'"$TEST_PASSWORD"'"
  }' \
  -s | jq -r '.tempToken' > /tmp/temptoken.txt

export TEMP_TOKEN=$(cat /tmp/temptoken.txt)

# Verify with backup code
curl -X POST "$API_BASE/api/auth/2fa/verify-login" \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "'"$TEMP_TOKEN"'",
    "code": "'"$BACKUP_CODE"'",
    "useBackupCode": true
  }' \
  -c cookies.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

**Verification**:
- ✅ Backup code accepted (first use)
- ✅ Authentication completed
- ✅ Cookies set

**Try same backup code again** (should fail):
```bash
# Logout and login again
rm cookies.txt
# ... repeat login to get new tempToken ...

# Try same backup code
curl -X POST "$API_BASE/api/auth/2fa/verify-login" \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "'"$TEMP_TOKEN"'",
    "code": "'"$BACKUP_CODE"'",
    "useBackupCode": true
  }' \
  -v
```

Expected: `{ "error": "Invalid code" }` (code already used)

---

## Test 8: Disable 2FA

**Purpose**: Turn off 2FA for the account

```bash
# Must be authenticated
export TOTP_CODE="789012"  # Current code from app

curl -X POST "$API_BASE/api/auth/2fa/disable" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "'"$TEST_PASSWORD"'",
    "code": "'"$TOTP_CODE"'"
  }' \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Two-factor authentication has been disabled"
}
```

**Error Cases**:

**Wrong Password** (401):
```bash
curl -X POST "$API_BASE/api/auth/2fa/disable" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "wrong-password",
    "code": "'"$TOTP_CODE"'"
  }' \
  -v
```
Expected: `{ "error": "Invalid password" }`

**Wrong TOTP Code** (401):
```bash
curl -X POST "$API_BASE/api/auth/2fa/disable" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "password": "'"$TEST_PASSWORD"'",
    "code": "000000"
  }' \
  -v
```
Expected: `{ "error": "Invalid code" }`

**Verification**:
- ✅ 2FA disabled successfully
- ✅ Next login will NOT require 2FA

---

## Test 9: Verify 2FA Disabled

**Purpose**: Confirm login works without 2FA

```bash
# Logout
rm cookies.txt

# Login
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$TEST_USERNAME"'",
    "password": "'"$TEST_PASSWORD"'"
  }' \
  -c cookies.txt \
  -v
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "testuser@example.com",
    "displayName": "Test User",
    "username": "testuser"
  }
}
```

**Verification**:
- ✅ `success: true`
- ✅ NO `requires2FA` flag
- ✅ Cookies set immediately
- ✅ User authenticated without 2FA

---

## Edge Case Testing

### Test 10: Expired Temp Token

```bash
# Wait 6+ minutes after getting tempToken, then try verify-login
# Expected: 401 "Invalid token" (expired)
```

### Test 11: Rate Limiting

```bash
# Try 5 failed logins rapidly
for i in {1..5}; do
  curl -X POST "$API_BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "username": "'"$TEST_USERNAME"'",
      "password": "wrong-password"
    }'
done

# 6th attempt should be rate limited
curl -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$TEST_USERNAME"'",
    "password": "'"$TEST_PASSWORD"'"
  }' \
  -v
```

Expected: 429 Too Many Requests

### Test 12: Clock Drift Tolerance

```bash
# TOTP codes are valid for ±30 seconds (1 window)
# Generate code, wait 25 seconds, should still work
# Generate code, wait 65 seconds, should fail
```

---

## Automated Testing

Run the integration tests:

```bash
cd /home/ateece/bapi-headless/web
pnpm test src/app/api/auth/2fa/__tests__/2fa-routes.test.ts
```

Expected: All tests passing

---

## WordPress Admin Verification

### Check User Meta

```sql
-- In WordPress database
SELECT meta_key, meta_value 
FROM wp_usermeta 
WHERE user_id = 1 
AND meta_key LIKE 'two_factor%';
```

**Expected rows**:
- `two_factor_enabled` → `1` or `0`
- `two_factor_secret` → Encrypted blob (gibberish)
- `two_factor_backup_codes` → JSON array of hashed codes

### GraphiQL Testing

Navigate to `{WORDPRESS_URL}/graphql` (GraphiQL IDE)

**Query user's 2FA status**:
```graphql
query {
  viewer {
    id
    email
    twoFactorEnabled
  }
}
```

**Note**: `twoFactorSecret` and `twoFactorBackupCodes` are private and won't be returned unless you're the user.

---

## Troubleshooting

### Issue: "Failed to store 2FA secret"
- Check WordPress `TWO_FACTOR_ENCRYPTION_KEY` is set in `wp-config.php`
- Verify `graphql-2fa-extension.php` is in `wp-content/mu-plugins/`
- Check WordPress error logs: `wp-content/debug.log`

### Issue: "Invalid code" (but code looks correct)
- Verify server time is accurate (NTP sync)
- Check authenticator app time sync
- TOTP requires accurate clocks (±30 seconds)

### Issue: "Not authenticated"
- Verify cookies are being sent with request
- Check cookie `auth_token` is present and valid
- Try logging in again to refresh token

### Issue: Rate limiting triggered
- Wait 15 minutes for rate limit to reset
- Or clear rate limit: restart Next.js dev server (memory-based)

---

## Security Testing

### Test 13: Unauthorized Access

```bash
# Try setup without authentication
curl -X POST "$API_BASE/api/auth/2fa/setup" \
  -H "Content-Type: application/json" \
  -v
```
Expected: 401 "Not authenticated"

### Test 14: Cross-User Access

```bash
# Try to disable another user's 2FA
# Should only affect authenticated user
# WordPress enforces user context
```

### Test 15: SQL Injection

```bash
# Try malicious input
curl -X POST "$API_BASE/api/auth/2fa/verify-setup" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code": "123456; DROP TABLE wp_users;--"}' \
  -v
```
Expected: Input validation rejects (not 6 digits)

---

## Success Criteria

- ✅ All API routes respond with correct status codes
- ✅ Setup generates valid QR code and backup codes
- ✅ TOTP codes verify correctly
- ✅ Backup codes work (one-time use)
- ✅ Login flow branches correctly (2FA vs non-2FA)
- ✅ Temp token expires after 5 minutes
- ✅ Disable requires password + TOTP confirmation
- ✅ Rate limiting protects against brute force
- ✅ Error messages are user-friendly
- ✅ Logs generated for audit trail

---

## Next Steps

After manual testing passes:
1. Run automated tests: `pnpm test`
2. Test in staging environment
3. Configure encryption key in production WordPress
4. Plan admin 2FA rollout (mandatory)
5. Plan user 2FA rollout (optional, post-launch)
