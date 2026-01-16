# WordPress Application Password Rotation Guide

## 🚨 **IMMEDIATE ACTION REQUIRED**

The WordPress Application Password `vKCBU6YCLacPFSCkQ0VI5tqT` was exposed in git history and must be rotated immediately.

---

## 📋 **Quick Checklist**

- [ ] Revoke old application password in WordPress
- [ ] Generate new application password
- [ ] Update local `.env.local`
- [ ] Update Vercel environment variables
- [ ] Test order creation with new credentials
- [ ] Update any scripts or documentation

---

## 🔄 **Step-by-Step Rotation Process**

### Step 1: SSH into Kinsta WordPress

```bash
ssh -p 17338 bapiheadlessstaging@35.224.70.159
# Password: Andrea@19762
cd ~/public
```

### Step 2: Revoke Old Password via WP-CLI

```bash
# List all application passwords for user 'ateece'
wp user application-password list ateece

# Find the UUID of the exposed password and revoke it
wp user application-password delete ateece <UUID>
```

**Alternative: Via WordPress Admin UI**
1. Log into WordPress admin: https://bapiheadlessstaging.kinsta.cloud/wp-admin
2. Go to: Users → Profile → Application Passwords
3. Find the password (may be named "Next.js Frontend" or similar)
4. Click "Revoke" next to the old password

### Step 3: Generate New Application Password

**Via WP-CLI (Recommended):**
```bash
wp user application-password create ateece "Next.js Headless Frontend" --porcelain
```

This will output a new password like: `xxxx xxxx xxxx xxxx xxxx xxxx`
(Remove spaces for environment variable: `xxxxxxxxxxxxxxxxxxxxxxxx`)

**Via WordPress Admin UI:**
1. Users → Profile → Application Passwords
2. New Application Password Name: "Next.js Headless Frontend (Jan 2026)"
3. Click "Add New Application Password"
4. Copy the generated password (remove spaces)

### Step 4: Update Local Environment

Edit `web/.env.local`:
```env
WORDPRESS_API_USER=ateece
WORDPRESS_API_PASSWORD=your_new_password_here_no_spaces
```

Test locally:
```bash
cd web
pnpm run dev
# Visit http://localhost:3000 and test checkout
```

### Step 5: Update Vercel Environment Variables

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/ateece-bapi/bapi-headless
2. Settings → Environment Variables
3. Find `WORDPRESS_API_PASSWORD`
4. Click Edit → Update value with new password
5. Apply to: Production, Preview, and Development
6. Click "Save"

**Via Vercel CLI:**
```bash
cd web
vercel env add WORDPRESS_API_PASSWORD production
# Paste new password when prompted

vercel env add WORDPRESS_API_PASSWORD preview
# Paste new password when prompted
```

### Step 6: Trigger Redeploy

**Via Vercel Dashboard:**
1. Deployments tab
2. Click ⋯ on latest deployment
3. Click "Redeploy"

**Via CLI:**
```bash
vercel --prod
```

### Step 7: Test Production

1. Visit staging site: https://bapi-headless.vercel.app
2. Add product to cart
3. Complete checkout with Stripe test card: `4242 4242 4242 4242`
4. Verify order appears in WordPress admin
5. Check order details API: `/api/orders/[orderId]`

---

## ✅ **Verification Checklist**

After rotation, verify:

- [ ] Local development works (checkout creates order)
- [ ] Staging deployment works
- [ ] Order history page loads orders
- [ ] GraphQL authenticated queries work
- [ ] No 401 errors in browser console
- [ ] WordPress admin shows new application password
- [ ] Old password is revoked

---

## 🔐 **Security Best Practices**

### Never Commit Credentials

**Bad:**
```env
# ❌ Never do this in committed files
WORDPRESS_API_PASSWORD=vKCBU6YCLacPFSCkQ0VI5tqT
```

**Good:**
```env
# ✅ Use placeholders in documentation
WORDPRESS_API_PASSWORD=your-wordpress-app-password
```

### Use `.env.local` (Git-Ignored)

The `.env.local` file is already in `.gitignore`. Always use it for secrets:

```bash
# web/.gitignore already includes:
.env*.local
```

### Rotate Regularly

- **Application Passwords**: Every 90 days
- **After exposure**: Immediately
- **Before major launches**: Within 7 days

### Use Vercel Environment Variables

Vercel encrypts environment variables at rest. Always use the dashboard or CLI to set secrets, never commit them.

---

## 📞 **Emergency Contacts**

If password cannot be rotated:
- **Kinsta Support**: support@kinsta.com
- **WordPress Admin**: Access via Kinsta dashboard → Tools → WP Admin
- **Vercel Support**: support@vercel.com

---

## 📚 **Related Documentation**

- [WordPress Application Passwords](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [ERROR_HANDLING.md](../web/ERROR_HANDLING.md) - Auth error handling

---

**Last Updated**: January 16, 2026  
**Exposed Password (REVOKED)**: `vKCBU6YCLacPFSCkQ0VI5tqT`  
**Next Rotation Due**: April 16, 2026 (90 days)
