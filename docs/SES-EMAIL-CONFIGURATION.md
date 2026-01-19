# Amazon SES Email Configuration

This document describes the Amazon SES (Simple Email Service) email configuration used for both production and staging WordPress sites.

## Overview

Both the production (`www.bapihvac.com`) and staging (`bapiheadlessstaging.kinsta.cloud`) sites use **WP Offload SES Lite** plugin to send emails via Amazon SES.

## Plugin Information

- **Plugin Name:** WP Offload SES Lite (wp-ses)
- **Version:** 1.7.2
- **Purpose:** Reliable email delivery via Amazon SES
- **Documentation:** https://wordpress.org/plugins/wp-ses/

## AWS SES Configuration

### AWS Credentials

Stored in `wp-config.php`:

```php
/* Amazon SES Configuration */
define( 'WPOSES_AWS_ACCESS_KEY_ID',     'AKIAXXXXXXXXXXXX' );
define( 'WPOSES_AWS_SECRET_ACCESS_KEY', 'your-aws-secret-access-key-here' );
```

### AWS Region

- **Region:** us-east-2 (Ohio)

### Plugin Settings

Stored in WordPress options table as `wposes_settings`:

```json
{
  "completed-setup": "1",
  "default-email": "bapi@website.bapihvac.com",
  "default-email-name": "BAPI",
  "delete-successful": "0",
  "enable-click-tracking": "0",
  "enable-health-report": "1",
  "enable-open-tracking": "0",
  "enqueue-only": "0",
  "health-report-frequency": "weekly",
  "health-report-recipients": "site-admins",
  "log-duration": "90",
  "region": "us-east-2",
  "reply-to": "",
  "return-path": "chris@vendiadvertising.com",
  "send-via-ses": "1"
}
```

## Email Addresses

### WordPress Settings

- **Admin Email:** BAPI_Marketing@bapisensors.com
- **WP SES Default From:** bapi@website.bapihvac.com
- **WP SES Default Name:** BAPI

### WooCommerce Settings

- **From Email:** customerservice@bapisensors.com
- **From Name:** BAPI
- **Email Footer:** BAPI - Powered by WooCommerce

### Other Notifications

- **Stock Alerts:** customerservice@www.bapihvac.com
- **Purchase Log:** customerservice@bapisensors.com
- **Purchase Log CC:** accountsreceivable@bapisensors.com

## Verified Sender Addresses

All email addresses must be verified in Amazon SES (us-east-2 region):

- ✅ bapi@website.bapihvac.com
- ✅ customerservice@bapisensors.com
- ✅ BAPI_Marketing@bapisensors.com
- ✅ chris@vendiadvertising.com (return path)

## Installation (New Site)

### 1. Install Plugin

```bash
ssh -p PORT user@host
cd /path/to/wordpress
wp plugin install wp-ses --activate
```

### 2. Add AWS Credentials

Edit `wp-config.php` and add after database configuration:

```php
/* Amazon SES Configuration */
define( 'WPOSES_AWS_ACCESS_KEY_ID',     'AKIAXXXXXXXXXXXX' );
define( 'WPOSES_AWS_SECRET_ACCESS_KEY', 'your-aws-secret-access-key-here' );
```

### 3. Configure Plugin Settings

```bash
wp option update wposes_settings '{"completed-setup":"1","default-email":"bapi@website.bapihvac.com","default-email-name":"BAPI","delete-successful":"0","enable-click-tracking":"0","enable-health-report":"1","enable-open-tracking":"0","enqueue-only":"0","health-report-frequency":"weekly","health-report-recipients":"site-admins","log-duration":"90","region":"us-east-2","reply-to":"","return-path":"chris@vendiadvertising.com","send-via-ses":"1"}' --format=json
```

### 4. Update WooCommerce Email Settings

```bash
wp option update woocommerce_email_from_address 'customerservice@bapisensors.com'
wp option update woocommerce_email_from_name 'BAPI'
```

### 5. Test Email

```bash
wp eval 'wp_mail("your-email@example.com", "Test Email", "This is a test email from Amazon SES.");'
```

Check your email for the test message.

## Deactivating Other Email Plugins

If migrating from another email plugin (e.g., WP Mail SMTP):

```bash
wp plugin deactivate wp-mail-smtp
wp plugin deactivate easy-wp-smtp
# etc.
```

**Note:** Only one email plugin should be active at a time.

## Troubleshooting

### Emails Not Sending

1. **Check SES Sandbox Mode**
   - If AWS SES is in sandbox mode, you can only send to verified email addresses
   - Request production access via AWS Console

2. **Verify Sender Addresses**
   - All "From" addresses must be verified in AWS SES
   - Go to AWS SES Console → Verified identities

3. **Check AWS Credentials**
   - Ensure credentials in wp-config.php are correct
   - Verify credentials have SES send permissions

4. **Check Plugin Logs**
   - WordPress Admin → Tools → WP Offload SES
   - View email logs for error messages

5. **Test with WP-CLI**
   ```bash
   wp eval 'var_dump(wp_mail("test@example.com", "Test", "Test body"));'
   ```

### Common Error Messages

**"Email address not verified"**
- The "From" address needs to be verified in AWS SES
- Add and verify the address in AWS Console

**"Message rejected: Email address is not verified"**
- AWS SES is in sandbox mode
- Request production access or verify recipient address

**"Could not connect to AWS"**
- Check AWS credentials in wp-config.php
- Verify region is correct (us-east-2)

## AWS SES Production Access

To move out of SES sandbox mode:

1. Go to AWS SES Console
2. Navigate to Account Dashboard
3. Click "Request production access"
4. Fill out the request form:
   - **Use case:** Transactional emails for e-commerce site
   - **Website URL:** www.bapihvac.com
   - **Expected daily volume:** Start with 1000 emails/day
   - **Process for handling bounces:** Automatic bounce handling via plugin

## Security Notes

- ✅ AWS credentials are stored in wp-config.php (not in database)
- ✅ Credentials are never exposed to frontend
- ✅ Use IAM user with SES-only permissions (principle of least privilege)
- ⚠️ Never commit wp-config.php to version control

## Related Documentation

- [SMTP-CONFIGURATION.md](./SMTP-CONFIGURATION.md) - Previous Gmail SMTP setup (deprecated)
- [WORDPRESS-BACKEND-SETUP.md](./WORDPRESS-BACKEND-SETUP.md) - WordPress installation guide
- [EMAIL-NOTIFICATIONS.md](./EMAIL-NOTIFICATIONS.md) - Email notification system

## Staging vs Production

Both sites use identical configuration:

| Setting | Production | Staging |
|---------|-----------|---------|
| Plugin | wp-ses 1.7.2 | wp-ses 1.7.2 |
| AWS Access Key | AKIAXXXXXXXXXXXX | AKIAXXXXXXXXXXXX |
| AWS Region | us-east-2 | us-east-2 |
| Default From | bapi@website.bapihvac.com | bapi@website.bapihvac.com |
| WooCommerce From | customerservice@bapisensors.com | customerservice@bapisensors.com |

**Note:** Using same credentials ensures emails work identically on both sites.

---

**Last Updated:** January 19, 2026  
**Configured By:** ateece  
**Production Status:** ✅ Active  
**Staging Status:** ✅ Active
