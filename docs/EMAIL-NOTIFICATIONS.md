# Email Notifications System

## Overview

This document covers the email notification system for the BAPI headless e-commerce platform. Email notifications are handled by **WooCommerce** on the WordPress backend and are automatically triggered when orders are created.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend                                            │
│  - User completes checkout                                   │
│  - Payment processed (Stripe)                                │
│  - Order created via GraphQL                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  WordPress/WooCommerce Backend                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WooCommerce Order Created                            │  │
│  │  - Triggers email hooks automatically                 │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WooCommerce Email System                             │  │
│  │  - Customer email (order confirmation)                │  │
│  │  - Admin email (new order notification)              │  │
│  │  - Processing email (order being processed)          │  │
│  │  - Completed email (order shipped/complete)          │  │
│  │  - Refund email (if order refunded)                  │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  Email Service Provider                                      │
│  - Kinsta SMTP (default)                                    │
│  - OR SendGrid, Mailgun, etc. (configured)                  │
└─────────────────────────────────────────────────────────────┘
```

## WooCommerce Email Types

### Customer Emails

| Email Type | Trigger | Purpose | Status Required |
|------------|---------|---------|-----------------|
| **New Order** | Order created | Order confirmation | Pending, On-hold |
| **Processing Order** | Order status → Processing | Payment confirmed, preparing | Processing |
| **Completed Order** | Order status → Completed | Order shipped/delivered | Completed |
| **Cancelled Order** | Order status → Cancelled | Order cancelled notification | Cancelled |
| **Refunded Order** | Order refunded | Refund processed | Refunded |
| **Customer Note** | Note added to order | Additional order information | Any |
| **Failed Order** | Payment failed | Payment failure notice | Failed |

### Admin Emails

| Email Type | Trigger | Recipients |
|------------|---------|------------|
| **New Order** | Order created | Admin, shop manager |
| **Cancelled Order** | Order cancelled | Admin, shop manager |
| **Failed Order** | Payment failed | Admin |

## Default WooCommerce Configuration

### Email Settings Location

WordPress Admin → **WooCommerce** → **Settings** → **Emails**

### Default Settings

```php
// From Name: BAPI
// From Email: orders@bapihvac.com
// Header Image: https://yourdomain.com/logo.png
// Footer Text: BAPI - Building Automation Products Inc.
// Base Color: #1479bc (BAPI Blue)
```

### Email Templates Location

WordPress theme: `wp-content/themes/your-theme/woocommerce/emails/`

WooCommerce default: `wp-content/plugins/woocommerce/templates/emails/`

## Customization Guide

### Method 1: WordPress Admin Dashboard

**Navigate to:** WooCommerce → Settings → Emails

For each email type, you can customize:

1. **Enable/Disable** - Toggle email on/off
2. **Subject** - Email subject line
3. **Heading** - Email header text
4. **Additional Content** - Extra text at bottom
5. **Email Type** - Plain text or HTML

**Example: Customize "Processing Order" Email**

```
Enable/Disable: ✓ Enable this email notification
Subject: Your BAPI order is being processed
Heading: Thank you for your order!
Additional Content: Track your order at: https://bapi-headless.vercel.app/account/orders
Email Type: HTML
```

### Method 2: Custom Email Templates

**Copy template to theme:**

```bash
# From WooCommerce plugin
wp-content/plugins/woocommerce/templates/emails/customer-processing-order.php

# To your theme (create directories if needed)
wp-content/themes/your-theme/woocommerce/emails/customer-processing-order.php
```

**Edit template with custom HTML:**

```php
<?php
/**
 * Customer processing order email
 *
 * @var WC_Order $order Order object
 * @var string $email_heading Email heading
 * @var bool $sent_to_admin Sent to admin flag
 */

defined('ABSPATH') || exit;

do_action('woocommerce_email_header', $email_heading, $email);
?>

<p>Hi <?php echo esc_html($order->get_billing_first_name()); ?>,</p>

<p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>

<p><strong>Order Number:</strong> <?php echo esc_html($order->get_order_number()); ?></p>

<?php
// Order details table
do_action('woocommerce_email_order_details', $order, $sent_to_admin, $plain_text = false, $email);

// Customer details
do_action('woocommerce_email_customer_details', $order, $sent_to_admin, $plain_text = false, $email);

// Footer
do_action('woocommerce_email_footer', $email);
?>
```

### Method 3: Custom Email Plugin

For advanced customization, use a plugin:

**Recommended Plugins:**
- [WooCommerce Email Customizer](https://wordpress.org/plugins/woo-email-customizer/)
- [Kadence WooCommerce Email Designer](https://wordpress.org/plugins/kadence-woocommerce-email-designer/)
- [YayMail - WooCommerce Email Customizer](https://wordpress.org/plugins/yaymail/)

**Install via WP-CLI:**

```bash
wp plugin install kadence-woocommerce-email-designer --activate
```

## SMTP Configuration

### Why Configure SMTP?

WordPress default `mail()` function has issues:
- Emails go to spam
- Delivery is unreliable
- No tracking or analytics
- Limited sending capacity

### Recommended SMTP Providers

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **SendGrid** | 100 emails/day | Transactional emails |
| **Mailgun** | 5,000 emails/month | Developers |
| **Amazon SES** | 62,000 emails/month | High volume |
| **Postmark** | 100 emails/month | Deliverability |
| **Kinsta** | Built-in | Kinsta hosting customers |

### Configure SMTP with Plugin

**Install WP Mail SMTP:**

```bash
wp plugin install wp-mail-smtp --activate
```

**Configure via WordPress Admin:**

1. Go to: **WP Mail SMTP** → **Settings**
2. Choose mailer (SendGrid, Mailgun, etc.)
3. Enter API keys
4. Set From Email: `orders@bapihvac.com`
5. Set From Name: `BAPI`
6. Save settings
7. Send test email

### Example: SendGrid Configuration

```php
// wp-config.php (alternative to plugin)
define('WPMS_ON', true);
define('WPMS_SMTP_HOST', 'smtp.sendgrid.net');
define('WPMS_SMTP_PORT', 587);
define('WPMS_SMTP_USER', 'apikey');
define('WPMS_SMTP_PASS', 'your-sendgrid-api-key');
define('WPMS_SSL', 'tls');
define('WPMS_SMTP_FROM', 'orders@bapihvac.com');
define('WPMS_SMTP_FROM_NAME', 'BAPI');
```

## Email Template Variables

### Available in All Templates

```php
$order->get_order_number()           // Order number
$order->get_billing_first_name()     // Customer first name
$order->get_billing_email()          // Customer email
$order->get_date_created()           // Order date
$order->get_total()                  // Order total
$order->get_status()                 // Order status
$order->get_payment_method_title()   // Payment method
$order->get_shipping_method()        // Shipping method
```

### Order Items Loop

```php
foreach ($order->get_items() as $item_id => $item) {
    echo $item->get_name();        // Product name
    echo $item->get_quantity();    // Quantity
    echo $item->get_total();       // Item total
}
```

### Order Meta

```php
$order->get_meta('_stripe_intent_id');          // Stripe payment intent
$order->get_meta('_transaction_id');            // Transaction ID
$order->get_meta('_customer_user');             // Customer user ID
$order->get_meta('order_notes');                // Order notes
```

## BAPI Brand Customization

### Brand Colors

Apply BAPI colors to email templates:

```php
// In email template or customizer
$brand_colors = [
    'primary'   => '#1479bc',  // BAPI Blue
    'accent'    => '#ffc843',  // BAPI Yellow
    'text'      => '#282829',  // Dark text
    'bg'        => '#ffffff',  // White background
];
```

### Header Image

Upload BAPI logo:

1. Upload logo to WordPress Media Library
2. Copy image URL
3. Go to: **WooCommerce** → **Settings** → **Emails**
4. Paste URL in **Header Image** field

**Recommended size:** 600px × 100-150px

### Email Footer

**Standard footer text:**

```
BAPI - Building Automation Products Inc.
750 North Blackhawk Avenue
Grayslake, IL 60030
Phone: (815) 546-8090
Email: support@bapihvac.com
Website: https://www.bapihvac.com
```

## Testing Email Notifications

### Method 1: WooCommerce Test Order

1. Enable test mode in WooCommerce
2. Create a test product
3. Complete checkout with test payment
4. Check email inbox for confirmation

### Method 2: Manual Email Trigger

```php
// In WordPress theme functions.php or custom plugin
add_action('init', function() {
    if (isset($_GET['test_email'])) {
        $order_id = 12345; // Replace with real order ID
        $order = wc_get_order($order_id);
        
        if ($order) {
            // Trigger specific email
            WC()->mailer()->emails['WC_Email_Customer_Processing_Order']->trigger($order_id);
            echo 'Email sent to: ' . $order->get_billing_email();
        }
    }
});
```

Visit: `https://yourdomain.com/?test_email=1`

### Method 3: WP Mail SMTP Test

1. Go to: **WP Mail SMTP** → **Tools** → **Email Test**
2. Enter test email address
3. Click **Send Email**
4. Check inbox and spam folder

## Email Deliverability Best Practices

### SPF Record

Add to your domain DNS:

```
v=spf1 include:_spf.google.com include:sendgrid.net ~all
```

### DKIM

Configure DKIM in your email provider:
- SendGrid: Automated via dashboard
- Mailgun: Generate keys in settings
- Amazon SES: Enable in SES console

### DMARC

Add DMARC record to DNS:

```
_dmarc.bapihvac.com TXT "v=DMARC1; p=none; rua=mailto:dmarc@bapihvac.com"
```

### From Email Domain

**✅ DO:** Use your domain email
```
orders@bapihvac.com
noreply@bapihvac.com
```

**❌ DON'T:** Use generic domains
```
noreply@gmail.com
info@wordpress.org
```

## Monitoring & Analytics

### Track Email Opens/Clicks

Use an email service provider that tracks:
- Open rate
- Click-through rate
- Bounce rate
- Spam complaints

### WooCommerce Order Emails Report

Install plugin: **WooCommerce Email Log**

```bash
wp plugin install email-log --activate
```

Features:
- Log all outgoing emails
- View sent emails
- Resend emails
- Export logs

## Troubleshooting

### Emails Not Sending

**Check:**
1. WooCommerce → Settings → Emails → Verify emails are enabled
2. Test with WP Mail SMTP plugin
3. Check spam folder
4. Review server mail logs: `/var/log/mail.log`
5. Verify SMTP credentials

**Debug:**

```php
// Enable WP debug logging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Check logs at: wp-content/debug.log
```

### Emails Go to Spam

**Fixes:**
- Configure proper SMTP provider
- Set up SPF, DKIM, DMARC records
- Use domain-based From address
- Avoid spam trigger words in subject
- Include unsubscribe link
- Warm up new sending domain gradually

### Emails Have Wrong Format

**Check:**
1. Email Type set to **HTML** (not plain text)
2. Theme templates are properly overridden
3. Clear WooCommerce cache
4. Test with default WooCommerce template

## Custom Email Types

### Create Custom Email

```php
// In theme functions.php or custom plugin
add_filter('woocommerce_email_classes', 'add_custom_email_class');

function add_custom_email_class($email_classes) {
    require_once 'includes/class-wc-shipping-notification-email.php';
    $email_classes['WC_Shipping_Notification_Email'] = new WC_Shipping_Notification_Email();
    return $email_classes;
}
```

**Email class example:**

```php
// includes/class-wc-shipping-notification-email.php
class WC_Shipping_Notification_Email extends WC_Email {
    public function __construct() {
        $this->id             = 'shipping_notification';
        $this->title          = 'Shipping Notification';
        $this->description    = 'Sent when order ships';
        $this->template_html  = 'emails/shipping-notification.php';
        $this->template_plain = 'emails/plain/shipping-notification.php';
        
        // Trigger on custom action
        add_action('woocommerce_order_status_shipped', [$this, 'trigger'], 10, 2);
        
        parent::__construct();
    }
    
    public function trigger($order_id, $order = false) {
        $this->object = wc_get_order($order_id);
        $this->recipient = $this->object->get_billing_email();
        
        if ($this->is_enabled() && $this->get_recipient()) {
            $this->send($this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments());
        }
    }
}
```

## Integration with Next.js Frontend

### Email Notification on Order Creation

When order is created via GraphQL mutation:

```typescript
// web/src/app/api/payment/confirm/route.ts
const order = await createWooCommerceOrder({
  payment_method: 'stripe',
  transaction_id: paymentIntentId,
  billing: billingAddress,
  shipping: shippingAddress,
  line_items: cartItems,
});

// WooCommerce automatically sends:
// 1. Customer "New Order" email
// 2. Admin "New Order" email
```

### Manual Email Trigger (if needed)

```typescript
// Trigger specific email via GraphQL or REST API
await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders/${orderId}/emails`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${WC_KEY}:${WC_SECRET}`)}`,
  },
  body: JSON.stringify({
    email_type: 'customer_processing_order',
  }),
});
```

## Production Checklist

**Before Launch:**

- [ ] Configure SMTP provider (SendGrid, Mailgun, etc.)
- [ ] Set up SPF, DKIM, DMARC records
- [ ] Test all email types with real orders
- [ ] Verify emails don't go to spam
- [ ] Customize email templates with BAPI branding
- [ ] Set proper From name and email address
- [ ] Add BAPI logo to email header
- [ ] Test on multiple email clients (Gmail, Outlook, Apple Mail)
- [ ] Enable email logging for monitoring
- [ ] Set up email tracking/analytics
- [ ] Configure customer support email address
- [ ] Test email unsubscribe functionality
- [ ] Review email content for accuracy
- [ ] Verify order details display correctly
- [ ] Test mobile email rendering

## Email Templates Customization Priority

### High Priority (Launch Required)

1. ✅ **Customer Order Confirmation** (New Order)
2. ✅ **Order Processing** (Payment confirmed)
3. ✅ **Admin New Order Notification**

### Medium Priority (Post-Launch)

4. **Order Completed** (Shipped)
5. **Customer Note** (Order updates)
6. **Refund Confirmation**

### Low Priority (Nice to Have)

7. Password reset
8. Account creation
9. Newsletter signups (if implemented)

## Resources

- [WooCommerce Email Documentation](https://woocommerce.com/document/email-faq/)
- [Email Template Overrides](https://woocommerce.com/document/template-structure/)
- [WP Mail SMTP Plugin](https://wordpress.org/plugins/wp-mail-smtp/)
- [SendGrid WordPress Integration](https://sendgrid.com/docs/for-developers/sending-email/wordpress/)
- [Email on Acid](https://www.emailonacid.com/) - Email testing tool
- [Litmus](https://www.litmus.com/) - Email previews across clients

---

**Last Updated**: January 15, 2026
**Version**: 1.0
**Status**: ✅ Documentation Complete

**Summary**: WooCommerce handles all email notifications automatically when orders are created. Configuration is done through WordPress Admin → WooCommerce → Settings → Emails. For production, configure SMTP provider (SendGrid recommended) and customize templates with BAPI branding.

