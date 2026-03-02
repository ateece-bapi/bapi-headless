# WordPress 2FA Extension Setup

**File:** `cms/wp-content/mu-plugins/graphql-2fa-extension.php`  
**Type:** Must-Use Plugin (auto-loaded, cannot be disabled)  
**Purpose:** Minimal GraphQL schema extension for 2FA support

---

## Installation

### 1. Copy Plugin File

```bash
# File is already in mu-plugins directory
# WordPress will auto-load it on next request
```

### 2. Add Encryption Key to wp-config.php

**REQUIRED for production:**

```php
// Add to wp-config.php (before "That's all, stop editing!")
define('TWO_FACTOR_ENCRYPTION_KEY', 'your-secret-key-here');
```

**Generate a secure key:**

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: PHP
php -r "echo bin2hex(random_bytes(32));"

# Option 3: WordPress Salt Generator
# Visit: https://api.wordpress.org/secret-key/1.1/salt/
```

**Example:**
```php
define('TWO_FACTOR_ENCRYPTION_KEY', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6');
```

### 3. Verify Installation

```bash
# Check if plugin is loaded
wp plugin list --status=must-use

# Should show:
# graphql-2fa-extension    must-use    GraphQL Two-Factor Authentication Extension
```

### 4. Test GraphQL Schema

Visit: `https://your-site.com/graphql` (GraphiQL IDE)

**Query to check if fields exist:**

```graphql
query TestTwoFactorFields {
  viewer {
    id
    email
    twoFactorEnabled
  }
}
```

---

## GraphQL Schema Reference

### User Fields (Read)

```graphql
type User {
  # Whether 2FA is enabled for this user
  twoFactorEnabled: Boolean
  
  # Decrypted TOTP secret (only accessible to own user)
  twoFactorSecret: String
  
  # List of hashed backup codes (only accessible to own user)
  twoFactorBackupCodes: [String]
}
```

**Privacy:** All 2FA fields return `null` if querying another user's data.

### Mutations (Write)

#### 1. Update 2FA Secret

```graphql
mutation EnableTwoFactor($secret: String!, $enabled: Boolean!, $backupCodes: [String!]) {
  updateTwoFactorSecret(
    input: {
      secret: $secret
      enabled: $enabled
      backupCodes: $backupCodes
    }
  ) {
    success
    message
    user {
      id
      twoFactorEnabled
    }
  }
}
```

**Variables:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "enabled": true,
  "backupCodes": [
    "ABC123DEF",
    "XYZ789GHI"
  ]
}
```

#### 2. Verify Backup Code

```graphql
mutation UseBackupCode($code: String!, $userId: Int) {
  useTwoFactorBackupCode(
    input: {
      code: $code
      userId: $userId
    }
  ) {
    valid
    message
  }
}
```

**Use Case:** During login when user doesn't have authenticator app

#### 3. Disable 2FA

```graphql
mutation DisableTwoFactor($userId: Int) {
  disableTwoFactor(
    input: {
      userId: $userId
    }
  ) {
    success
    message
  }
}
```

**Note:** Frontend should require password + TOTP verification before calling this.

---

## Security Features

### Encryption (libsodium)

- **Algorithm:** XSalsa20-Poly1305 (via `sodium_crypto_secretbox`)
- **Key Derivation:** SHA-256 hash of `TWO_FACTOR_ENCRYPTION_KEY`
- **Nonce:** Random 24 bytes per encryption
- **Storage:** Base64-encoded (nonce + ciphertext)

**Why libsodium?**
- Built into PHP 7.2+ (no external dependencies)
- Authenticated encryption (prevents tampering)
- Industry-standard cryptography
- Constant-time operations (timing attack resistant)

### Backup Code Hashing

- **Algorithm:** WordPress `wp_hash_password()` (bcrypt)
- **One-time use:** Code removed after successful verification
- **Storage:** JSON array of hashed codes in `user_meta`

### Access Control

- **Read:** User can only access their own 2FA data
- **Write:** User can only modify their own 2FA data
- **Admin Override:** Admins can disable 2FA for users (security support)

### Audit Logging

All 2FA events logged via `error_log()`:
- 2FA enabled/disabled
- Backup code usage
- Remaining backup codes count

**View logs:**
```bash
# Kinsta: SSH → logs directory
tail -f /www/your-site/logs/error.log | grep "2FA"
```

---

## Database Schema

**Storage:** WordPress `wp_usermeta` table (existing schema)

| meta_key | meta_value | Description |
|----------|------------|-------------|
| `two_factor_enabled` | `1` or `0` | Boolean: Is 2FA active |
| `two_factor_secret` | Base64 string | Encrypted TOTP secret |
| `two_factor_backup_codes` | JSON array | Hashed backup codes |

**No new tables required** ✅

**Query example:**
```sql
SELECT meta_key, meta_value 
FROM wp_usermeta 
WHERE user_id = 123 
AND meta_key LIKE 'two_factor%';
```

---

## Testing Checklist

### Manual Testing (WordPress Admin)

1. **Plugin Loaded:**
   ```bash
   wp plugin list --status=must-use
   ```

2. **GraphiQL Available:**
   - Visit: `https://your-site.com/graphql`
   - Should see GraphiQL IDE interface

3. **Schema Extended:**
   ```graphql
   {
     __type(name: "User") {
       fields {
         name
       }
     }
   }
   ```
   - Should include: `twoFactorEnabled`, `twoFactorSecret`, `twoFactorBackupCodes`

4. **Mutations Available:**
   ```graphql
   {
     __schema {
       mutationType {
         fields {
           name
         }
       }
     }
   }
   ```
   - Should include: `updateTwoFactorSecret`, `useTwoFactorBackupCode`, `disableTwoFactor`

### Functional Testing

#### Test 1: Enable 2FA

```graphql
mutation {
  updateTwoFactorSecret(
    input: {
      secret: "TESTSECRET123456"
      enabled: true
      backupCodes: ["CODE1", "CODE2", "CODE3"]
    }
  ) {
    success
    message
    user {
      twoFactorEnabled
    }
  }
}
```

**Expected:** `success: true`, `twoFactorEnabled: true`

#### Test 2: Read 2FA Status

```graphql
query {
  viewer {
    id
    email
    twoFactorEnabled
    twoFactorSecret
  }
}
```

**Expected:** Returns current user's 2FA data (not null)

#### Test 3: Use Backup Code

```graphql
mutation {
  useTwoFactorBackupCode(
    input: {
      code: "CODE1"
    }
  ) {
    valid
    message
  }
}
```

**Expected:** `valid: true`, code removed from database

**Re-using same code:** `valid: false`

#### Test 4: Disable 2FA

```graphql
mutation {
  disableTwoFactor(input: {}) {
    success
    message
  }
}
```

**Expected:** All 2FA user_meta cleared

### Privacy Testing

#### Test 5: Can't Access Other Users' 2FA

```graphql
query {
  user(id: "otherUserId") {
    twoFactorEnabled
    twoFactorSecret
  }
}
```

**Expected:** `twoFactorEnabled: null`, `twoFactorSecret: null`

---

## Troubleshooting

### "Encryption failed" Error

**Cause:** `TWO_FACTOR_ENCRYPTION_KEY` not defined

**Fix:**
```php
// Add to wp-config.php
define('TWO_FACTOR_ENCRYPTION_KEY', 'generate-secure-key-here');
```

### Plugin Not Showing in GraphiQL

**Cause:** MU plugins cache issue

**Fix:**
```bash
# Flush rewrite rules
wp rewrite flush

# Or visit WordPress Admin → Settings → Permalinks → Save
```

### Backup Codes Not Verifying

**Cause:** Code already used (one-time use)

**Fix:** Generate new backup codes via `updateTwoFactorSecret` mutation

---

## Production Deployment Checklist

- [ ] Encryption key set in `wp-config.php`
- [ ] Encryption key is 32+ characters
- [ ] Encryption key stored securely (environment variable)
- [ ] GraphQL endpoint protected (rate limiting, CORS)
- [ ] Audit logging enabled
- [ ] Test 2FA enable/disable flow
- [ ] Test backup code usage
- [ ] Test privacy controls
- [ ] Monitor error logs for 24 hours
- [ ] Document admin support process (disable 2FA for users)

---

## Maintenance

### Key Rotation

If encryption key is compromised:

1. Stop accepting new 2FA setups
2. Generate new encryption key
3. Update `TWO_FACTOR_ENCRYPTION_KEY`
4. Force all users to re-setup 2FA
5. Clear old secrets:
   ```sql
   DELETE FROM wp_usermeta WHERE meta_key = 'two_factor_secret';
   ```

### Backup Code Regeneration

Users can regenerate backup codes anytime:

```graphql
mutation RegenerateBackupCodes {
  updateTwoFactorSecret(
    input: {
      backupCodes: ["NEW1", "NEW2", "NEW3", ...]
    }
  ) {
    success
  }
}
```

---

## Support

**Technical Issues:** Development team  
**Security Concerns:** Security team lead  
**User Help:** Admin can disable 2FA:

```graphql
mutation DisableUserTwoFactor {
  disableTwoFactor(
    input: { userId: 123 }
  ) {
    success
  }
}
```

**Verification:** Require identity proof before disabling.
