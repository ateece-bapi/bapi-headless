<?php
/**
 * Plugin Name: BAPI Category Validation
 * Description: Prevents numeric-only product category names and logs source
 * Version: 2.0.0
 * Author: BAPI Development Team
 * 
 * Purpose: Prevent duplicate numeric categories like 746-754 (March 30) and 762 (April 22)
 * This is a senior-level fix - prevent at source, not UI band-aid
 * 
 * Architecture: Uses filters (pre_insert_term, wp_update_term_data) to block BEFORE
 * creation/update, providing clear WP_Error feedback instead of silent deletion.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Determine whether a category name is numeric-only.
 *
 * @param string $name Category name to validate.
 * @return bool
 */
function bapi_is_numeric_only_category_name($name) {
    return is_string($name) && preg_match('/^\d+$/', trim($name)) === 1;
}

/**
 * Build a simple source trace for logging.
 *
 * @return string
 */
function bapi_get_category_validation_source() {
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
    $source = [];

    foreach ($backtrace as $trace) {
        if (isset($trace['function'])) {
            $source[] = $trace['function'];
        }
    }

    return implode(' → ', $source);
}

/**
 * Log blocked numeric-only category attempts.
 *
 * @param string   $name    Category name that was blocked.
 * @param string   $context Operation context, e.g. "create" or "update".
 * @param int|null $term_id Optional term ID for updates.
 * @return void
 */
function bapi_log_blocked_category_name($name, $context, $term_id = null) {
    $message = sprintf(
        '[BAPI CATEGORY BLOCKED] Numeric category "%s" rejected during %s%s. Source: %s',
        $name,
        $context,
        $term_id ? sprintf(' (ID: %d)', $term_id) : '',
        bapi_get_category_validation_source()
    );

    error_log($message);
    
    // Send email alert (optional - comment out if too noisy)
    wp_mail(
        get_option('admin_email'),
        '[ALERT] WordPress: Numeric Category Blocked',
        sprintf(
            "A numeric-only category was blocked during %s:\n\n" .
            "Name: %s\n" .
            "%s" .
            "Source: %s\n\n" .
            "This prevents the breadcrumb '755' bug from recurring.",
            $context,
            $name,
            $term_id ? "ID: $term_id\n" : '',
            bapi_get_category_validation_source()
        )
    );
}

/**
 * Validate product category names before insertion.
 * Prevents numeric-only names like "755", "762", etc.
 */
add_filter('pre_insert_term', 'bapi_validate_category_name_before_insert', 10, 2);

function bapi_validate_category_name_before_insert($term, $taxonomy) {
    if ($taxonomy !== 'product_cat') {
        return $term;
    }

    if (bapi_is_numeric_only_category_name($term)) {
        bapi_log_blocked_category_name($term, 'create');

        return new WP_Error(
            'bapi_numeric_category_name',
            __('Category names cannot be numeric-only (prevents breadcrumb bugs).', 'bapi-category-validation')
        );
    }

    return $term;
}

/**
 * Validate product category names before updates are persisted.
 */
add_filter('wp_update_term_data', 'bapi_validate_category_name_before_update', 10, 4);

function bapi_validate_category_name_before_update($data, $term_id, $taxonomy, $args) {
    if ($taxonomy !== 'product_cat') {
        return $data;
    }

    $name = isset($data['name']) ? $data['name'] : '';

    if (!bapi_is_numeric_only_category_name($name)) {
        return $data;
    }

    bapi_log_blocked_category_name($name, 'update', (int) $term_id);

    // Block the update with a clear error message
    wp_die(
        esc_html__('Category names cannot be numeric-only (prevents breadcrumb bugs).', 'bapi-category-validation'),
        esc_html__('BAPI Category Validation', 'bapi-category-validation'),
        ['response' => 400]
    );
}

/**
 * Log plugin activation
 */
add_action('plugins_loaded', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[BAPI] Category validation plugin loaded (v2.0.0 - filter-based)');
    }
});
