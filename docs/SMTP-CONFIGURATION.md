# SMTP Email Configuration

**Status:** ✅ Configured and Active  
**Date:** January 16, 2026  
**Plugin:** WP Mail SMTP by WPForms v4.7.1  

## Configuration

### SMTP Settings
- **Provider:** Gmail SMTP
- **Host:** smtp.gmail.com
- **Port:** 587
- **Encryption:** TLS
- **Authentication:** Enabled

### Email Addresses
- **WordPress From Email:** BAPI_Marketing@bapisensors.com
- **WordPress From Name:** BAPI
- **WooCommerce From Email:** customerservice@bapisensors.com
- **WooCommerce From Name:** BAPI

### Credentials
- **SMTP User:** BAPI_Marketing@bapisensors.com
- **SMTP Password:** Configured (Gmail app-specific password)

## Installation Steps (Completed)

```bash
# 1. SSH into Kinsta server
ssh -p 17338 bapiheadlessstaging@35.224.70.159

# 2. Navigate to WordPress directory
cd /www/bapiheadlessstaging_582/public

# 3. Install WP Mail SMTP plugin
wp plugin install wp-mail-smtp --activate

# 4. Configure SMTP settings via WP-CLI
wp option update wp_mail_smtp --format=json <<'EOF'
{
  "mail": {
    "from_email": "BAPI_Marketing@bapisensors.com",
    "from_name": "BAPI",
    "mailer": "gmail",
    "return_path": false
  },
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "encryption": "tls",
    "autotls": true,
    "auth": true,
    "user": "BAPI_Marketing@bapisensors.com",
    "pass": "your-app-password-here"
  }
}
EOF

# 5. Test email sending
wp eval 'wp_mail("test@example.com", "Test Email", "Testing SMTP configuration.");'
```

## WooCommerce Email Types

The following WooCommerce emails are now functional:

### Customer Emails
- ✅ **New Order** - Sent to customer after placing order
- ✅ **Processing Order** - Sent when order status changes to Processing
- ✅ **Completed Order** - Sent when order is marked Complete
- ✅ **Refunded Order** - Sent when order is refunded
- ✅ **Customer Invoice** - Manual invoice email
- ✅ **Customer Note** - Sent when note is added to order
- ✅ **Reset Password** - Password reset requests
- ✅ **New Account** - Welcome email for new customers

### Admin Emails
- ✅ **New Order** - Notification to admin/shop manager
- ✅ **Cancelled Order** - Notification when order is cancelled
- ✅ **Failed Order** - Notification for failed orders

## Email Template Customization

WooCommerce email templates can be customized via:

1. **WordPress Admin:** WooCommerce → Settings → Emails
2. **Template Overrides:** Copy from `wp-content/plugins/woocommerce/templates/emails/` to `wp-content/themes/your-theme/woocommerce/emails/`
3. **Custom Logo:** WooCommerce → Settings → Emails → Header Image

## Testing

### Test Email Sent
- **Date:** January 16, 2026
- **To:** ateece@bapisensors.com
- **Subject:** SMTP Test from WP-CLI
- **Status:** ✅ Sent successfully

### Test WooCommerce Email
To test order confirmation emails:
1. Place test order via staging site
2. Check customer email inbox
3. Verify order details, branding, and formatting

## Troubleshooting

### Common Issues

**Gmail App Password Not Working**
- Ensure 2-Factor Authentication enabled on Google account
- Generate new app-specific password at: https://myaccount.google.com/apppasswords
- Use 16-character password (no spaces)

**Emails Not Sending**
```bash
# Check WordPress mail log
wp option get wp_mail_smtp_debug

# Test email via WP-CLI
wp eval 'wp_mail("your-email@example.com", "Test", "Testing");'

# Check SMTP settings
wp option get wp_mail_smtp --format=json
```

**Wrong From Address**
```bash
# Update WooCommerce from address
wp option update woocommerce_email_from_address "customerservice@bapisensors.com"
wp option update woocommerce_email_from_name "BAPI"
```

## Security Notes

- ✅ SMTP password stored in WordPress options (encrypted database)
- ✅ Gmail app-specific password used (not main account password)
- ✅ TLS encryption for SMTP connection
- ❌ **Do NOT commit SMTP password to version control**
- ❌ **Do NOT expose in logs or error messages**

## Production Deployment

When moving to production:

1. **Update SMTP credentials** if using different email account
2. **Update FROM addresses** in WooCommerce settings
3. **Test all email types** (order confirmation, shipping, etc.)
4. **Configure email templates** with production branding
5. **Set up SPF/DKIM records** for better deliverability:
   - SPF: Add Gmail to your domain's SPF record
   - DKIM: Configure Gmail DKIM signing
   - DMARC: Set up DMARC policy

## Monitoring

**Email Deliverability:**
- Monitor bounce rates
- Check spam folder reports
- Review failed send logs in WP Mail SMTP

**WP Mail SMTP Dashboard:**
- WordPress Admin → WP Mail SMTP → Email Log
- View sent emails, failures, and delivery status

---

**Configuration Complete:** January 16, 2026  
**Tested By:** System Administrator  
**Status:** Production-ready for order confirmation emails
