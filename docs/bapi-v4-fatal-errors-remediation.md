# Three fatal errors in the bapi-v4 pricing code

**Site:** www.bapihvac.com · **Theme:** bapi-v4 · **Site root:** `/sites/www.bapihvac.com/files`
**Source:** WooCommerce → Status → Logs, `fatal-errors-2026-09-09` — 17 entries, 3 distinct faults

The product page that broke is not a bad product. All 17 fatals in the log trace back to the theme's
customer-multiplier pricing code, which was written for PHP 7 semantics and is now running on PHP 8.
Two of the three faults affect the cart and checkout, not just the one product.

---

## What the log shows

### Finding 1 — 10 hits — product page

```
Uncaught TypeError: Unsupported operand types: string * float
```

| | |
|---|---|
| **Where** | `themes/bapi-v4/includes/class-bapi-customer.php:22` — `BAPI_Customer::apply_customer_multipler_to_price()` |
| **Window** | 13:38–15:35 UTC (08:38–10:35 Central) — matches when the product page was being tested |
| **Path in** | Stripe express checkout calls `WC_Product_Variable::get_available_variations()` on `template_redirect`, which runs the multiplier filter across every variation |
| **Cause** | Line 22 multiplies the price by the multiplier. One variation's price is a non-numeric string — almost certainly `''`, a variation with no price set. PHP 7 coerced that to zero; PHP 8 throws. |

### Finding 2 — 5 hits — cart / Store API

```
Uncaught Error: Call to undefined method WC_Customer::get_multiplier_for_product()
```

| | |
|---|---|
| **Where** | `themes/bapi-v4/includes/class-bapi.php:69` — `BAPI::apply_multipliers()`, on `woocommerce_before_calculate_totals` |
| **Window** | 00:00, 09:45, 13:01, 13:14, 15:37 UTC — spread across the whole day, so this is real customer traffic, not testing |
| **Path in** | WooCommerce Store API cart route (the Cart / Checkout blocks) → `WC_Cart::calculate_totals()` |
| **Cause** | The theme assumes `WC()->customer` is its own `BAPI_Customer` subclass. On Store API requests WooCommerce instantiates a plain `WC_Customer`, so the method does not exist and the request returns a 500. |

### Finding 3 — 2 hits — checkout fields

```
Uncaught TypeError: Illegal offset type
```

| | |
|---|---|
| **Where** | `plugins/woocommerce/includes/class-wc-checkout.php:236` — `WC_Checkout::initialize_checkout_fields()` |
| **Window** | 02:43 and 06:11 UTC, on search pages |
| **Path in** | `WC_Stripe_Express_Checkout_Custom_Fields::get_custom_checkout_fields()` during `wp_enqueue_scripts` — Stripe builds the full checkout field set on every page |
| **Cause** | Core is the victim, not the culprit: something is registering a checkout field with a non-string key, so an array is used as an array index. |

All three are PHP 8 error classes. If the host bumped PHP recently, that single change is the root cause
of the whole set — worth confirming before you start, because it also predicts what else in the theme is
about to break.

## Resolution record — 2026-09-09

The reported product was confirmed as [Room Pressure Pickup Ports with Temperature Sensor](https://www.bapihvac.com/product/room-pressure-pickup-ports-with-temperature-sensor/), product ID `50160`.

The fatal variation was identified and corrected:

| Field | Value |
|---|---|
| **Variation** | `141869` |
| **SKU** | `ZPS-ACC04-103` |
| **Description** | BAPI-Stat "Quantum" enclosure pickup, 10K-3 thermistor |
| **Attributes** | Quantum room enclosure with static pickup; Thermistor 10K-3 |
| **Problem** | `_price` and `_regular_price` were both missing |
| **Resolution** | Regular price saved as `33`; WooCommerce populated `_price` as `33` |

The missing variation price was the confirmed source of the PHP 8 `string * float` fatal. The variation
was a valid, published, in-stock SKU and was not deleted.

Two production safeguards were also applied to the live `bapi-v4` checkout:

- `class-bapi-customer.php`: `apply_customer_multipler_to_price()` now returns non-numeric prices before multiplication.
- `class-bapi.php`: `apply_multipliers()` now checks that `WC()->customer` implements `get_multiplier_for_product()` and logs a `bapi-multipliers` warning before skipping incompatible Store API requests.

Both files passed `php -l`. Rollback copies were created on the server at:

```text
wp-content/themes/bapi-v4/includes/class-bapi-customer.php.bak-20260909-162945
wp-content/themes/bapi-v4/includes/class-bapi.php.bak-20260909-162945
```

The checkout field scan found no non-string field keys when Stripe was excluded. The remaining
`Illegal offset type` fault is therefore still open for investigation in the Stripe express checkout
custom-fields path or another active plugin. Active versions observed were WooCommerce `10.4.4` and
WooCommerce Stripe Gateway `10.2.1`.

The live theme checkout contains unrelated pre-existing uncommitted changes. The two safeguards must be
committed to the maintained source repository so a future deployment does not overwrite the production fix.

---

## Work items

### 1. Guard non-numeric prices in the multiplier filter — P0, unblocks the page

**Where:** `class-bapi-customer.php` line 22 — and check line 113, where the filter is applied.

This is the one-line change that stops the product page from dying. Read the real method first — the
snippet below is the shape of the fix, not a drop-in patch.

Read:

```bash
cd /sites/www.bapihvac.com/files/wp-content/themes/bapi-v4/includes
sed -n '1,40p'    class-bapi-customer.php
sed -n '100,125p' class-bapi-customer.php
```

Change:

```php
public function apply_customer_multipler_to_price( $price ) {
    // WooCommerce passes '' for a variation with no price set, and can also
    // pass null or a formatted string. PHP 8 fatals on '' * float instead of
    // coercing to 0, so pass anything non-numeric straight through.
    if ( ! is_numeric( $price ) ) {
        return $price;
    }

    return (float) $price * $this->get_multiplier(); // keep the existing lookup
}
```

If prices can arrive formatted (`"1,234.00"`), normalize with WooCommerce's own helper first:
`$price = wc_format_decimal( $price );` then test for `''`.

> **Before you edit over SSH:** if bapi-v4 is deployed from a git repo, a direct file edit gets reverted
> on the next deploy. Commit the change to the repo rather than only patching the running site — and
> either way, `cp class-bapi-customer.php{,.bak-20260909}` first.

### 2. Find the variations that have no price — P1, data

Item 1 stops the crash; it doesn't make the product priced. A blank variation price still renders blank
and still can't be bought. Find every one of them, not just today's:

```bash
wp config get table_prefix   # swap wp_ below if it differs

wp db query "SELECT v.ID AS variation, v.post_parent AS product_id,
       pp.post_title AS product, pm.meta_value AS price
FROM wp_posts v
JOIN wp_posts pp ON pp.ID = v.post_parent
LEFT JOIN wp_postmeta pm ON pm.post_id = v.ID AND pm.meta_key = '_price'
WHERE v.post_type = 'product_variation'
  AND v.post_status IN ('publish','private')
  AND ( pm.meta_value IS NULL
        OR TRIM(pm.meta_value) = ''
        OR pm.meta_value NOT REGEXP '^-?[0-9]+(\.[0-9]+)?$' )
ORDER BY pp.post_title"
```

Run it again for `_regular_price` to catch variations that have a computed `_price` but no entered
price. Then either set a price on each one or delete the variation if it isn't sold — and re-save the
product in admin afterwards so WooCommerce rebuilds its price lookup table.

### 3. Stop the multiplier depending on the customer class — P0, cart & checkout

**Where:** `class-bapi.php` line 69 — `BAPI::apply_multipliers()`

This one is arguably more urgent than the product page: it 500s the Store API cart route, so any
customer whose cart recalculates through the Cart or Checkout blocks hits it. Five entries today across
normal traffic hours.

Read:

```bash
sed -n '55,85p' class-bapi.php
grep -rn "woocommerce_customer_class\|BAPI_Customer(" \
     /sites/www.bapihvac.com/files/wp-content/themes/bapi-v4
```

Immediate guard:

```php
$customer = WC()->customer;

if ( ! $customer || ! method_exists( $customer, 'get_multiplier_for_product' ) ) {
    wc_get_logger()->warning(
        'BAPI multipliers skipped: customer is ' . ( $customer ? get_class( $customer ) : 'null' ),
        array( 'source' => 'bapi-multipliers' )
    );
    return;
}
```

Log it rather than returning silently — a silent skip means dealer pricing quietly falls back to list
price on those requests, which is worse than an error nobody sees.

**Real fix:** move the lookup off the customer object into a standalone helper that takes IDs —
something like `BAPI_Multipliers::for_user( $user_id, $product_id )` — and call it from both the theme
and the cart hook. A method that only exists on a subclass WooCommerce doesn't always instantiate will
keep breaking as WooCommerce moves more of the cart to the Store API.

### 4. Track down the malformed checkout field — P2, investigate

Only two hits, but it fires on ordinary pages because Stripe's express checkout builds the checkout
field set during `wp_enqueue_scripts` everywhere. Find what's registering a field with a non-string key:

```bash
sed -n '225,245p' /sites/www.bapihvac.com/files/wp-content/plugins/woocommerce/includes/class-wc-checkout.php

grep -rn "woocommerce_checkout_fields\|woocommerce_billing_fields\|\
woocommerce_shipping_fields\|woocommerce_default_address_fields\|\
woocommerce_get_country_locale" \
  /sites/www.bapihvac.com/files/wp-content/themes/bapi-v4 \
  /sites/www.bapihvac.com/files/wp-content/mu-plugins 2>/dev/null

wp plugin list --status=active --fields=name,version
wp core version
```

Note the Stripe and WooCommerce versions while you're there — Stripe's express-checkout custom-fields
support is recent, and a version mismatch is a plausible cause on its own.

> **Interim, no code:** WooCommerce → Settings → Payments → Stripe → Express checkout — unchecking the
> product page and other non-checkout locations stops both this and the eager variation loading in
> finding 1 from firing site-wide. Fully reversible, and useful while the code fixes go through review.

### 5. Sweep the theme for the rest of the PHP 8 breakage — P2, prevents the next one

Three faults surfaced today because someone happened to click the right product. The theme does
arithmetic on values straight out of `get_post_meta()` and WooCommerce getters in several places, and
every one of those is the same bug waiting for the right row of data.

```bash
php -v
wp eval 'echo PHP_VERSION . PHP_EOL;'

grep -rn "get_post_meta" ./includes | head -50
grep -rnE '\$[a-z_]+\s*\*\s*\$' ./includes
```

Ask the host when PHP was last changed — that date should line up with when odd pricing behaviour
started. For a proper pass, run the theme through
[PHPCompatibilityWP](https://github.com/PHPCompatibility/PHPCompatibilityWP) in PHPCS against your
current PHP version.

---

## Verify — after items 1–3

- [ ] The reported product page loads as a guest
- [ ] It loads for a logged-in account that has a multiplier, and prices are multiplied
- [ ] Every variation combination shows a price in the dropdown
- [ ] Add to cart → cart → checkout completes with no 500
- [ ] `tail -f wp-content/uploads/wc-logs/fatal-errors-*.log` stays quiet under traffic
- [ ] WooCommerce → Status → Logs shows no new fatal-errors entry after 30 minutes
- [ ] No `bapi-multipliers` warnings in the log — if there are, item 3's guard is masking a live pricing gap

---

## Basis for this plan

**Confirmed from the log**

- File paths, line numbers and error strings for all three faults
- Full call stacks, including which plugin initiates each path
- Occurrence counts and timestamps (17 entries, 2026-09-09 UTC)
- The site is on PHP 8 — all three error types are PHP 8-only

**Inferred — verify in code**

- That the non-numeric price is an empty variation price. It's the most common source of `''` in that
  filter, but the log doesn't name the value.
- Method signatures and the multiplier lookup in both snippets — the theme source hasn't been read, so
  adapt rather than paste.
- That `class-wc-cart.php:1463` is `woocommerce_before_calculate_totals` in your WooCommerce version.

---

Items 1 and 3 are theme code changes and want a review and a staging pass if there's an environment for
it; item 4 has a settings-only workaround in the meantime.
