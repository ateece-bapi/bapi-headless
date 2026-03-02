# Two-Factor Authentication User Guide

**Last Updated:** March 2, 2026  
**Audience:** BAPI Customers

---

## 🔐 What is Two-Factor Authentication?

Two-factor authentication (2FA) adds an extra layer of security to your BAPI account. Even if someone learns your password, they won't be able to access your account without the second factor—a time-based code from your phone.

**Benefits:**
- 🛡️ **Enhanced Security** - Protects against password theft
- 📱 **Mobile Protection** - Requires physical access to your phone
- ✅ **Industry Standard** - Used by banks, email providers, and major platforms
- 🔒 **Peace of Mind** - Secure access to orders, quotes, and account details

---

## 📱 What You'll Need

### Authenticator App

You'll need an authenticator app on your smartphone or computer. We recommend:

**iOS:**
- [**Google Authenticator**](https://apps.apple.com/app/google-authenticator/id388497605) (Free)
- [**Authy**](https://apps.apple.com/app/authy/id494168017) (Free, multi-device sync)
- [**1Password**](https://apps.apple.com/app/1password-password-manager/id568903335) (Paid, includes password manager)

**Android:**
- [**Google Authenticator**](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2) (Free)
- [**Authy**](https://play.google.com/store/apps/details?id=com.authy.authy) (Free, multi-device sync)
- [**Microsoft Authenticator**](https://play.google.com/store/apps/details?id=com.azure.authenticator) (Free)

**Desktop:**
- [**1Password**](https://1password.com/) (Windows, Mac, Linux)
- [**Authy Desktop**](https://authy.com/download/) (Windows, Mac, Linux)

---

## 🚀 How to Enable Two-Factor Authentication

### Step 1: Navigate to Security Settings

1. Sign in to your BAPI account
2. Click your name in the top right corner
3. Select **Account Settings**
4. Click **Security** in the left sidebar
5. Find the **Two-Factor Authentication** section
6. Click **Enable Two-Factor Authentication**

### Step 2: Scan the QR Code

1. Open your authenticator app
2. Tap the **+** or **Add** button
3. Select **Scan QR Code**
4. Point your camera at the QR code on screen
5. Your app will add "BAPI (your-email@example.com)"

**Can't scan the QR code?**
- Click **Can't scan? Enter manually**
- Copy the secret key shown
- In your app, tap **Manual Entry**
- Paste the secret key
- Enter **BAPI** as the account name
- Select **Time-based** (not counter-based)
- Click **Save**

### Step 3: Verify Setup

1. Your authenticator app will show a 6-digit code
2. Enter this code in the verification box
3. Click **Verify & Enable 2FA**
4. The code changes every 30 seconds—use the current code

**If verification fails:**
- Make sure your phone's time is set to automatic
- Wait for the code to refresh and try the new one
- Check that you entered all 6 digits correctly

### Step 4: Save Your Backup Codes

⚠️ **CRITICAL: Save these codes immediately!**

You'll see 10 backup codes displayed. These are your emergency access codes if you lose your phone.

**Save them by:**
- ✅ **Download as Text File** - Click "Download as Text File"
- ✅ **Copy to Password Manager** - Paste into 1Password, Bitwarden, etc.
- ✅ **Print and Store Safely** - Print and keep in a secure location

**Important Notes:**
- Each backup code works **only once**
- You cannot view these codes again after this screen
- Without backup codes or your phone, you'll lose account access
- Store them separately from your password

### Step 5: Complete Setup

1. After saving your backup codes, click **I've Saved My Backup Codes**
2. You'll see a confirmation screen
3. Two-factor authentication is now active!

---

## 🔑 Signing In with Two-Factor Authentication

### Standard Sign-In Process

1. Go to [bapi.com/sign-in](https://bapi.com/sign-in)
2. Enter your **username** or **email**
3. Enter your **password**
4. Click **Sign In**
5. You'll see the two-factor verification screen
6. Open your authenticator app
7. Find the 6-digit code for BAPI
8. Enter the code in the verification box
9. Click **Verify & Sign In**

**Tips:**
- The code changes every 30 seconds
- A countdown timer shows time remaining
- Enter the code before it expires
- If it expires, just enter the new code

### Using a Backup Code

If you don't have access to your authenticator app:

1. On the two-factor verification screen, click **Use a backup code instead**
2. Enter one of your 10 backup codes (format: XXXX-XXXX)
3. Click **Verify & Sign In**
4. ⚠️ That backup code is now used and won't work again
5. You have 9 remaining codes

**After using a backup code:**
- You should disable and re-enable 2FA to get new backup codes
- Or contact support for assistance

---

## 🔧 Managing Two-Factor Authentication

### Check Your 2FA Status

1. Sign in to your account
2. Go to **Account Settings** → **Security**
3. Look for the **Two-Factor Authentication** section
4. You'll see "**Enabled**" with an active badge

### Disable Two-Factor Authentication

⚠️ **Warning:** Disabling 2FA makes your account less secure.

1. Go to **Account Settings** → **Security**
2. Find the **Two-Factor Authentication** section
3. Click **Disable Two-Factor Authentication**
4. Enter your **password**
5. Enter a **verification code** from your authenticator app
6. Click **Disable 2FA**
7. Two-factor authentication is now turned off

**Why disable 2FA?**
- You're switching to a new phone
- You lost access to your authenticator app
- You prefer less secure but convenient access

**Re-enabling 2FA:**
- You can re-enable at any time
- You'll get new backup codes when you re-enable

---

## 📱 Changing Phones

### Before Getting a New Phone

**Option 1: Transfer Authenticator Data (Easiest)**
- Most apps support backup/restore (Authy, Microsoft Authenticator)
- Export your codes from old phone
- Restore on new phone
- No action needed on BAPI website

**Option 2: Switch Devices**
1. On your old phone, note down a verification code
2. On your new phone, install authenticator app
3. Go to BAPI Account Settings → Security
4. Disable 2FA (requires password + code from old phone)
5. Re-enable 2FA
6. Scan new QR code with new phone
7. Save new backup codes

### After Getting a New Phone (Lost Old Phone)

1. Use a **backup code** to sign in
2. Go to **Account Settings** → **Security**
3. Disable 2FA (use password + another backup code)
4. Re-enable 2FA with your new phone
5. Save new backup codes

**If you don't have backup codes:**
- Contact BAPI Support: [support@bapi.com](mailto:support@bapi.com)
- Provide proof of identity (order history, account details)
- Support will disable 2FA for your account
- You can then re-enable with your new device

---

## 🆘 Troubleshooting

### "Invalid code" Error

**Causes & Solutions:**

**1. Code Expired**
- Codes change every 30 seconds
- Wait for the next code and try again

**2. Phone Time Incorrect**
- Settings → Date & Time → Set Automatically (ON)
- Restart your authenticator app
- Try the new code

**3. Wrong Code**
- Make sure you're looking at BAPI's code (not another service)
- Enter all 6 digits without spaces
- Don't include the countdown timer or label

**4. Too Many Failed Attempts**
- After 5 failed attempts, you'll be locked out for 15 minutes
- Wait 15 minutes and try again
- Use a backup code to sign in immediately

### Can't Scan QR Code

**Solutions:**
1. Increase screen brightness
2. Move phone closer/farther from screen
3. Use manual entry instead (click "Can't scan? Enter manually")
4. Try a different authenticator app
5. Take a screenshot and scan from Photos (some apps support this)

### Lost Phone and Backup Codes

**If you're signed in:**
1. Go to Account Settings → Security
2. Disable 2FA (requires password + TOTP code)
3. Wait—you might be able to recover your old codes from cloud backup

**If you're signed out:**
1. Contact BAPI Support: [support@bapi.com](mailto:support@bapi.com)
2. Subject: "Lost 2FA Access - [Your Account Email]"
3. Provide:
   - Full name
   - Account email
   - Recent order numbers
   - Last 4 digits of card on file
   - Billing address
4. Support will verify your identity and disable 2FA
5. You'll receive an email when 2FA is disabled
6. Sign in and re-enable 2FA with your new device

**Typical Response Time:** 1-2 business days

### Code Works in App But Not on BAPI

**Check:**
1. **Clock Sync**: Phone time must be automatic
2. **Account**: Make sure you're signing into the correct BAPI account
3. **Browser**: Try incognito/private browsing mode
4. **Cache**: Clear browser cookies and try again
5. **Network**: Check if you're behind a firewall or VPN

### Can't Find Authenticator App Code

**In your app:**
1. Scroll through your accounts list
2. Look for "BAPI" or your email address
3. Check if BAPI is in a folder or category

**If BAPI is missing:**
- You may have deleted it accidentally
- Use a backup code to sign in
- Disable and re-enable 2FA to set up again

---

## 🛡️ Security Best Practices

### Protect Your Backup Codes

✅ **Do:**
- Store in a password manager (encrypted)
- Print and keep in a locked drawer or safe
- Save in a secure note app with biometric lock
- Keep separate from your password

❌ **Don't:**
- Email them to yourself
- Store in plain text on your computer
- Save in cloud storage (Google Drive, Dropbox) without encryption
- Share with others

### Protect Your Authenticator App

✅ **Do:**
- Enable biometric lock (Face ID, Touch ID)
- Set a strong device passcode
- Enable cloud backup (Authy, Microsoft Authenticator)
- Keep your phone updated

❌ **Don't:**
- Leave your phone unlocked in public
- Share your device with others
- Use the same code twice (codes expire after 30 seconds)

### Account Security

✅ **Do:**
- Use a strong, unique password for BAPI
- Enable 2FA on your email account too
- Review active sessions regularly
- Sign out on shared computers

❌ **Don't:**
- Reuse passwords across sites
- Share your password with others
- Use public Wi-Fi without VPN
- Click suspicious email links claiming to be from BAPI

---

## ❓ Frequently Asked Questions

### Is two-factor authentication required?

No, 2FA is optional but **strongly recommended**. It significantly improves account security, especially for accounts with:
- Purchase history
- Saved payment methods
- Company/wholesale pricing
- Quote history

### Does 2FA work on mobile browsers?

Yes! 2FA works on any device with internet access:
- Mobile browsers (Safari, Chrome, Firefox)
- Tablet browsers
- Desktop browsers
- Native apps (if we build one)

### How long do backup codes last?

Backup codes **never expire** and remain valid until:
- You use them (each code works once)
- You disable and re-enable 2FA (generates new codes)
- You manually regenerate codes (future feature)

### Can I use SMS text messages instead?

Currently, we only support **authenticator apps** (TOTP). SMS 2FA is:
- Less secure (SIM swapping attacks)
- Less reliable (network issues)
- Not recommended by security experts

We may add SMS as a backup option in the future.

### Can multiple people use the same code?

No. TOTP codes are:
- **Time-based**: Generated using current time
- **Secret-based**: Unique to your account
- **One-time**: Each code is valid for 30 seconds only

### What if I have multiple BAPI accounts?

Each account needs its own 2FA setup:
1. Your authenticator app will show multiple BAPI entries
2. Each entry will have your email address
3. Use the code from the correct account when signing in

**Tip:** Label accounts in your authenticator app:
- "BAPI - Personal"
- "BAPI - Work"
- "BAPI - Company Account"

### Does 2FA slow down sign-in?

Only slightly:
- Standard sign-in: 5-10 seconds
- With 2FA: 15-20 seconds (includes opening app + entering code)

**Benefits outweigh the minor inconvenience:**
- Prevents unauthorized access
- Protects sensitive order data
- Required for wholesale accounts (coming soon)

---

## 📞 Getting Help

### BAPI Support

**Email:** [support@bapi.com](mailto:support@bapi.com)  
**Phone:** 1-800-BAPI-XXX  
**Hours:** Monday-Friday, 8am-5pm EST

**For 2FA issues, include:**
- Your account email
- Description of the problem
- Steps you've already tried
- Screenshots (if applicable)

### Emergency Access

If you're completely locked out:
1. Email support immediately
2. Use subject: "URGENT: Locked Out - [Your Email]"
3. Provide proof of identity
4. Support will expedite your request

---

## 📚 Additional Resources

**Understanding TOTP:**
- [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) - Technical standard
- [Wikipedia: TOTP](https://en.wikipedia.org/wiki/Time-based_one-time_password) - Plain English explanation

**Authenticator App Guides:**
- [Google Authenticator Guide](https://support.google.com/accounts/answer/1066447)
- [Authy User Guide](https://authy.com/guides/)
- [1Password 2FA Guide](https://support.1password.com/one-time-passwords/)

**Security Resources:**
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Document Version:** 1.0  
**Effective Date:** April 10, 2026 (Launch)  
**Contact:** [support@bapi.com](mailto:support@bapi.com)
