# Two-Factor Authentication Implementation Plan

**Branch:** `feat/two-factor-authentication`  
**Start Date:** March 2, 2026  
**Estimated Effort:** 2 days (11-13 hours)  
**Launch Impact:** 37-day buffer remaining (from 39 days)

---

## 🎯 Objective

Implement custom 2FA solution for BAPI Headless e-commerce platform following headless architecture principles:
- **Minimal WordPress plugins** - Core principle of headless migration
- **Business logic in Next.js** - Aligns with BFF (Backend for Frontend) pattern
- **Response to real threat** - November 2025 brute force attack validated need

---

## 🏗️ Architecture Philosophy

```
┌─────────────────────────────────────────────────────┐
│  Next.js (Frontend + Business Logic)               │
│  - Rate limiting                                    │
│  - 2FA verification logic                           │
│  - TOTP generation/validation                       │
│  - Session management                               │
│  - User experience                                  │
└─────────────────────────────────────────────────────┘
                        ↓ GraphQL
┌─────────────────────────────────────────────────────┐
│  WordPress (Minimal Auth Provider)                  │
│  - JWT token generation                             │
│  - User storage (existing)                          │
│  - 2FA metadata storage (user_meta)                 │
│  - GraphQL endpoint ONLY                            │
└─────────────────────────────────────────────────────┘
```

**Why This Design:**
- ✅ Zero WordPress plugins (avoid attack surface)
- ✅ All logic testable in TypeScript
- ✅ Easy to extend (SMS, WebAuthn, passkeys)
- ✅ Full control over UX
- ✅ Respects headless migration goals

---

## 📋 Implementation Phases

### **Phase 1: Rate Limiting (TODAY - 2-3 hours)** 🚨

**Priority:** CRITICAL - Stops brute force attacks immediately

**Addresses:** November 2025 brute force attack incident

#### WordPress Component (Minimal)
**File:** `cms/wp-content/mu-plugins/security-hardening.php`

**Features:**
- Track failed login attempts via WordPress transients
- Uses existing Redis cache (already installed)
- 5 attempts = 15-minute lockout
- IP + username tracking
- Automatic cleanup on success
- Zero database schema changes
- ~60 lines of code

#### Next.js Component
**File:** `web/src/lib/auth/rate-limit.ts`

**Features:**
- In-memory rate limiting (production: Redis)
- 5 attempts per 5-minute window
- 15-minute lockout after threshold
- IP + username identifier
- Integration with login route

**File:** `web/src/app/api/auth/login/route.ts` (update)

**Changes:**
- Add rate limit check before authentication
- Record failed attempts
- Clear attempts on success
- Return 429 status when rate limited

**Testing:**
- Test 5 failed attempts trigger lockout
- Test successful login clears attempts
- Test lockout expires after 15 minutes
- Test different IPs don't interfere

**Success Criteria:**
- ✅ Rate limiting active in Next.js login route
- ✅ WordPress login rate limited
- ✅ Error messages user-friendly
- ✅ Logging captures lockout events

---

### **Phase 2: WordPress 2FA Extension (Day 1 - 3-4 hours)** 🔐

**Priority:** HIGH - Foundation for 2FA system

#### WordPress Component
**File:** `cms/wp-content/mu-plugins/graphql-2fa-extension.php`

**Features:**
- GraphQL field: `User.twoFactorEnabled` (Boolean)
- GraphQL field: `User.twoFactorSecret` (String, private)
- GraphQL field: `User.twoFactorBackupCodes` (JSON, private)
- GraphQL mutation: `updateTwoFactorSecret`
- GraphQL mutation: `useTwoFactorBackupCode`
- Privacy: Users can only access own 2FA data
- Storage: WordPress `user_meta` table (existing)
- Encryption: Secrets encrypted at rest (PHP libsodium)

**Schema Extension:**
```graphql
type User {
  twoFactorEnabled: Boolean
  twoFactorSecret: String  # Only accessible to own user
  twoFactorBackupCodes: [String]  # Only accessible to own user
}

input UpdateTwoFactorSecretInput {
  secret: String!
  enabled: Boolean!
  backupCodes: [String!]
}

type UpdateTwoFactorSecretPayload {
  success: Boolean!
  user: User
}

mutation updateTwoFactorSecret(input: UpdateTwoFactorSecretInput!): UpdateTwoFactorSecretPayload
```

**Security Considerations:**
- Encrypt secrets with `libsodium` (built into PHP 7.2+)
- Store encryption key in `wp-config.php` environment variable
- Hash backup codes (like passwords)
- Rate limit GraphQL mutations
- Audit log for 2FA changes

**Testing:**
- Test field access control (users can't see others' secrets)
- Test mutation authentication (must be logged in)
- Test encryption/decryption roundtrip
- Test GraphQL schema validation

**Success Criteria:**
- ✅ GraphQL fields exposed in schema
- ✅ Mutations work via GraphiQL
- ✅ Privacy enforced (can't access other users)
- ✅ Secrets encrypted in database
- ✅ Documentation updated

---

### **Phase 3: Next.js 2FA Logic (Day 2 - 4-5 hours)** 🔑

**Priority:** HIGH - Core 2FA functionality

#### Dependencies
```bash
pnpm add otpauth qrcode
pnpm add -D @types/qrcode
```

#### Core Service
**File:** `web/src/lib/auth/two-factor.ts`

**Functions:**
- `generateTwoFactorSecret(username: string)` - Create TOTP secret + QR code
- `verifyTwoFactorCode(secret: string, code: string)` - Validate 6-digit code
- `generateBackupCodes(count: number)` - Generate recovery codes
- `hashBackupCode(code: string)` - Hash for storage
- `verifyBackupCode(code: string, hash: string)` - Verify recovery code

**TOTP Configuration:**
- Algorithm: SHA1 (standard)
- Digits: 6
- Period: 30 seconds
- Window: ±1 period (clock drift tolerance)
- Issuer: "BAPI"

#### API Routes

**1. Setup 2FA**
**File:** `web/src/app/api/auth/2fa/setup/route.ts`

```typescript
POST /api/auth/2fa/setup
Response: { qrCode: string, secret: string, backupCodes: string[] }
```

**Flow:**
1. Check user is authenticated
2. Generate TOTP secret
3. Generate QR code
4. Generate 10 backup codes
5. Store in WordPress (not enabled yet)
6. Return setup data to user

**2. Verify Setup**
**File:** `web/src/app/api/auth/2fa/verify-setup/route.ts`

```typescript
POST /api/auth/2fa/verify-setup
Body: { code: string }
Response: { success: boolean }
```

**Flow:**
1. Check user is authenticated
2. Retrieve stored secret from WordPress
3. Verify code using TOTP
4. If valid, enable 2FA in WordPress
5. Return success

**3. Disable 2FA**
**File:** `web/src/app/api/auth/2fa/disable/route.ts`

```typescript
POST /api/auth/2fa/disable
Body: { password: string, code: string }
Response: { success: boolean }
```

**Flow:**
1. Check user is authenticated
2. Re-verify password (security check)
3. Verify current 2FA code
4. Disable 2FA in WordPress
5. Clear secret and backup codes

**4. Verify During Login**
**File:** `web/src/app/api/auth/2fa/verify-login/route.ts`

```typescript
POST /api/auth/2fa/verify-login
Body: { tempToken: string, code: string, useBackupCode: boolean }
Response: { success: boolean, authToken: string, refreshToken: string }
```

**Flow:**
1. Validate temp token from initial login
2. Retrieve user's 2FA secret
3. If `useBackupCode=true`, verify and consume backup code
4. Else verify TOTP code
5. If valid, return full auth tokens (complete login)

#### Update Login Flow
**File:** `web/src/app/api/auth/login/route.ts`

**Changes:**
```typescript
// After successful WordPress authentication
if (data.login.authToken) {
  // Query if user has 2FA enabled
  const user2FAStatus = await getUserTwoFactorStatus(data.login.user.id);
  
  if (user2FAStatus.enabled) {
    // Generate temporary token (5 minutes)
    const tempToken = generateTempToken(data.login.user.id);
    
    return NextResponse.json({
      requires2FA: true,
      tempToken,
      userId: data.login.user.id,
    });
  }
  
  // Normal flow if no 2FA
  cookieStore.set('auth_token', data.login.authToken, { ...cookieOptions });
  cookieStore.set('refresh_token', data.login.refreshToken, { ...cookieOptions });
  
  return NextResponse.json({ success: true, user: data.login.user });
}
```

**Testing:**
- Test QR code generation
- Test TOTP validation with valid codes
- Test TOTP validation with invalid codes
- Test backup code consumption (one-time use)
- Test clock drift tolerance (±30 seconds)
- Test temp token expiration
- Test 2FA required flow
- Test 2FA bypass for users without it

**Success Criteria:**
- ✅ QR codes generate correctly
- ✅ Authenticator apps can scan QR codes
- ✅ 6-digit codes verify correctly
- ✅ Backup codes work once only
- ✅ Login flow branches correctly (2FA vs. no 2FA)
- ✅ All API routes return proper errors

---

### **Phase 4: UI Components (Day 3 - 3-4 hours)** 🎨

**Priority:** MEDIUM - User experience

#### Components

**1. 2FA Setup Wizard**
**File:** `web/src/components/auth/TwoFactorSetup.tsx`

**Features:**
- Step 1: Introduction & benefits
- Step 2: QR code display + manual entry option
- Step 3: Backup codes (download, print, copy)
- Step 4: Verification (enter code to confirm)
- Success state with confirmation

**Accessibility:**
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements
- High contrast QR code
- Copy-to-clipboard for backup codes

**2. 2FA Verification (Login)**
**File:** `web/src/components/auth/TwoFactorVerify.tsx`

**Features:**
- 6-digit code input (auto-focus, auto-submit)
- "Use backup code" toggle
- "Lost device?" help link
- Countdown timer showing code validity (30s)
- Error handling with retry

**3. 2FA Settings Management**
**File:** `web/src/components/account/TwoFactorSettings.tsx`

**Features:**
- Enable 2FA button (if not enabled)
- Status badge (Enabled/Disabled)
- "Disable 2FA" button (requires password + code)
- "View backup codes" (requires re-authentication)
- "Regenerate backup codes" option

**4. Updated Login Form**
**File:** `web/src/components/auth/SignInForm.tsx`

**Changes:**
- Detect `requires2FA` response
- Show `TwoFactorVerify` component
- Store temp token in state
- Handle verification success/failure

#### Pages

**1. Account Settings Page**
**File:** `web/src/app/(authenticated)/account/security/page.tsx`

**Sections:**
- Password change
- Two-factor authentication
- Active sessions
- Login history (future)

**2. 2FA Setup Flow Page**
**File:** `web/src/app/(authenticated)/account/security/2fa/setup/page.tsx`

**Flow:**
- Protected route (must be authenticated)
- Redirect if 2FA already enabled
- Full-page wizard experience

**Styling:**
- Use existing design system tokens
- BAPI Blue (#1479BC) for primary actions
- Warning colors for backup codes
- Success green for confirmation

**Testing:**
- Test QR code renders correctly
- Test backup codes downloadable
- Test verification code input
- Test enable/disable flows
- Test responsive design
- Test accessibility with screen reader
- Test keyboard navigation

**Success Criteria:**
- ✅ QR codes display clearly
- ✅ Backup codes downloadable as .txt
- ✅ Verification code input smooth UX
- ✅ Error messages helpful
- ✅ Mobile responsive
- ✅ WCAG 2.1 AA compliant

---

### **Phase 5: Testing & Documentation (Day 3 - 2 hours)** ✅

**Priority:** HIGH - Ensure quality

#### Automated Tests

**1. Unit Tests**
**File:** `web/src/lib/auth/__tests__/two-factor.test.ts`

Tests:
- TOTP secret generation
- TOTP code validation (valid codes)
- TOTP code validation (invalid codes)
- Clock drift tolerance
- Backup code generation
- Backup code hashing
- Backup code verification

**2. Integration Tests**
**File:** `web/src/app/api/auth/2fa/__tests__/setup.test.ts`

Tests:
- Setup endpoint requires authentication
- Setup generates valid QR code
- Setup stores secret in WordPress
- Verify endpoint validates codes correctly
- Verify endpoint enables 2FA
- Disable endpoint requires password

**3. E2E Tests**
**File:** `web/tests/e2e/two-factor.spec.ts`

Tests:
- Full setup flow (QR → backup codes → verification)
- Login with 2FA (success)
- Login with 2FA (invalid code)
- Login with backup code
- Disable 2FA flow

#### Manual Testing Checklist

**Setup Flow:**
- [ ] QR code scannable by Google Authenticator
- [ ] QR code scannable by Authy
- [ ] QR code scannable by 1Password
- [ ] Manual entry code works
- [ ] Backup codes downloadable
- [ ] Verification code accepted
- [ ] 2FA enabled in WordPress user_meta

**Login Flow:**
- [ ] User without 2FA logs in normally
- [ ] User with 2FA sees verification screen
- [ ] Valid TOTP code completes login
- [ ] Invalid TOTP code shows error
- [ ] Backup code completes login
- [ ] Backup code can only be used once
- [ ] Temp token expires after 5 minutes

**Disable Flow:**
- [ ] Requires password re-entry
- [ ] Requires valid TOTP code
- [ ] 2FA disabled in WordPress
- [ ] Next login doesn't ask for 2FA

**Error Cases:**
- [ ] Expired TOTP codes rejected
- [ ] Reused backup codes rejected
- [ ] Network errors handled gracefully
- [ ] User feedback clear and helpful

#### Documentation

**1. User Documentation**
**File:** `docs/USER-GUIDE-2FA.md`

Sections:
- What is Two-Factor Authentication?
- Why should I enable it?
- How to set up 2FA
- Recommended authenticator apps
- How to use backup codes
- What if I lose my device?
- How to disable 2FA

**2. Developer Documentation**
**File:** `docs/DEVELOPER-GUIDE-2FA.md`

Sections:
- Architecture overview
- API endpoints
- WordPress extension details
- Testing instructions
- Deployment checklist
- Troubleshooting guide

**3. Support Documentation**
**File:** `docs/SUPPORT-2FA.md`

Sections:
- Common user issues
- How to help users reset 2FA
- Database queries for troubleshooting
- Security incident response

**Success Criteria:**
- ✅ All automated tests passing
- ✅ Manual testing checklist complete
- ✅ Documentation complete
- ✅ Support team trained

---

## 🚀 Deployment Checklist

### Pre-Deploy (Staging)

- [ ] WordPress mu-plugin deployed to staging
- [ ] GraphQL schema introspection updated
- [ ] Next.js environment variables set
- [ ] Redis configured for rate limiting
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] Documentation reviewed

### Deploy to Production

- [ ] WordPress mu-plugin deployed
- [ ] Encryption key in wp-config.php
- [ ] Redis cache available
- [ ] Next.js deployed to Vercel
- [ ] Smoke test login flow
- [ ] Monitor error rates
- [ ] Support team notified

### Post-Deploy Monitoring (First 24h)

- [ ] Monitor login success rates
- [ ] Check error logs for 2FA issues
- [ ] Track 2FA adoption rate
- [ ] Watch support tickets
- [ ] Verify rate limiting working

---

## 📊 Success Metrics

**Security:**
- ❌ Brute force attacks blocked (rate limiting)
- 📈 Admin accounts with 2FA: Target 100% by Week 2
- 📈 Customer accounts with 2FA: Target 25% by Month 1
- 📉 Account compromise incidents: Target 0

**User Experience:**
- ⏱️ 2FA setup time: < 2 minutes average
- 🎯 2FA setup completion rate: > 80%
- 📞 Support tickets: < 5% of 2FA setups
- ⭐ User satisfaction: > 4.0/5.0

**Technical:**
- ✅ Zero downtime during rollout
- ✅ Login latency increase: < 100ms
- ✅ Test coverage: > 90%
- ✅ Zero critical bugs in first week

---

## 🎯 Rollout Strategy

### Week 1 (March 2-8)
**Target:** Admins and Shop Managers

1. Deploy rate limiting immediately
2. Deploy 2FA functionality
3. Enable for all admin accounts (mandatory)
4. Training session for admin users
5. Monitor and fix any issues

### Week 2 (March 9-15)
**Target:** Soft launch to all users

1. Announce 2FA availability
2. Add banner in account settings
3. Send email campaign explaining benefits
4. Track adoption rate
5. Collect user feedback

### Month 2 (Post-Launch)
**Target:** Risk-based enforcement

1. Analyze adoption data
2. Consider mandatory for:
   - Distributors with special pricing
   - Users with saved payment methods
   - High-value accounts (>$10k annual)
3. Implement risk-based triggers:
   - New device/location
   - After password reset
   - Unusual order patterns

---

## 🔒 Security Considerations

**Encryption:**
- TOTP secrets encrypted at rest (libsodium)
- Backup codes hashed (bcrypt)
- Encryption key environment variable
- Never log secrets in plaintext

**Rate Limiting:**
- 5 failed TOTP attempts = temporary lockout
- Prevents brute force of 6-digit codes
- Separate from login rate limiting

**Session Management:**
- Temp tokens expire in 5 minutes
- Auth tokens remain 7 days
- 2FA verification doesn't extend session

**Backup Codes:**
- Generated securely (crypto random)
- One-time use only
- Stored hashed (like passwords)
- 10 codes provided initially

**WordPress Security:**
- mu-plugin not editable via admin
- GraphQL mutations require authentication
- User isolation (can't access others' 2FA data)
- Audit log for 2FA changes

---

## 🐛 Known Issues & Mitigations

**Issue 1: Clock Drift**
- **Problem:** Server/client time mismatch causes code rejection
- **Mitigation:** ±1 period window (90 seconds total validity)
- **User feedback:** "Code expired, please try next code"

**Issue 2: Lost Device**
- **Problem:** User loses phone with authenticator app
- **Mitigation:** Backup codes (10 provided)
- **Support process:** Admin can disable 2FA after identity verification

**Issue 3: Phone Replacement**
- **Problem:** New phone, need to re-setup authenticator
- **Mitigation:** User can disable 2FA (requires current code)
- **Improvement:** Future: add SMS backup option

**Issue 4: Rate Limiting False Positives**
- **Problem:** Shared IP addresses (office, VPN)
- **Mitigation:** Track IP + username combination
- **Monitoring:** Log lockout events for review

---

## 📅 Timeline Summary

| Phase | Duration | Start | Deliverable |
|-------|----------|-------|-------------|
| **1. Rate Limiting** | 2-3 hours | Today | Login protection active |
| **2. WordPress Extension** | 3-4 hours | Day 1 | GraphQL 2FA schema |
| **3. Next.js Logic** | 4-5 hours | Day 2 | 2FA verification working |
| **4. UI Components** | 3-4 hours | Day 3 | User-facing components |
| **5. Testing & Docs** | 2 hours | Day 3 | Production ready |

**Total Effort:** 14-18 hours (~2 days)  
**Launch Impact:** 37-day buffer (from 39 days)  
**Risk:** LOW - Phased rollout, extensive testing

---

## ✅ Definition of Done

- [ ] Rate limiting prevents brute force attacks
- [ ] WordPress mu-plugin stores 2FA data
- [ ] TOTP codes verify correctly
- [ ] Backup codes work (one-time use)
- [ ] QR codes scannable by all major apps
- [ ] Login flow branches correctly (2FA vs. no 2FA)
- [ ] UI components accessible (WCAG 2.1 AA)
- [ ] All tests passing (unit, integration, e2e)
- [ ] Documentation complete (user, dev, support)
- [ ] No performance degradation
- [ ] Admin accounts using 2FA
- [ ] Support team trained
- [ ] Deployed to production
- [ ] 24-hour monitoring complete
- [ ] Zero critical bugs

---

## 📞 Support

**Technical Questions:** Development team  
**Security Concerns:** Security team lead  
**User Issues:** Customer support (with escalation to dev)  
**Emergency:** Admin can disable user 2FA via WordPress admin

---

## 🎓 Learning Resources

**TOTP Standard:** RFC 6238  
**OATH Toolkit:** https://www.nongnu.org/oath-toolkit/  
**Security Best Practices:** OWASP Authentication Cheat Sheet  
**PHP Encryption:** Libsodium documentation  
**WordPress Security:** WordPress Hardening Guide

---

**Status:** Ready to begin implementation  
**Next Step:** Phase 1 - Rate Limiting (TODAY)
