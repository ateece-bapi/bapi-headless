<?php
/**
 * Plugin Name: GraphQL Two-Factor Authentication Extension
 * Description: Minimal WordPress extension for 2FA support via WPGraphQL
 * Version: 1.0.0
 * Author: BAPI Development Team
 * 
 * Purpose: Extends WPGraphQL schema with 2FA fields and mutations
 * Architecture: Headless - all business logic in Next.js frontend
 * Storage: WordPress user_meta table (existing schema)
 * Security: Secrets encrypted at rest, privacy enforced via GraphQL
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get encryption key from environment
 * Set in wp-config.php: define('TWO_FACTOR_ENCRYPTION_KEY', 'your-secret-key');
 */
function get_2fa_encryption_key() {
    if (defined('TWO_FACTOR_ENCRYPTION_KEY')) {
        return TWO_FACTOR_ENCRYPTION_KEY;
    }
    
    // Fallback for development (NOT for production)
    if (defined('WP_DEBUG') && WP_DEBUG) {
        return 'dev-encryption-key-change-in-production';
    }
    
    // Error if no key set in production
    error_log('TWO_FACTOR_ENCRYPTION_KEY not defined in wp-config.php');
    return false;
}

/**
 * Encrypt 2FA secret using libsodium (PHP 7.2+)
 * 
 * @param string $plaintext The secret to encrypt
 * @return string|false Base64-encoded encrypted data with nonce, or false on failure
 */
function encrypt_2fa_secret($plaintext) {
    $key = get_2fa_encryption_key();
    if (!$key) {
        return false;
    }
    
    // Generate encryption key from our key string
    $encryption_key = hash('sha256', $key, true);
    
    // Generate random nonce
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    
    // Encrypt
    $ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $encryption_key);
    
    // Combine nonce + ciphertext and encode
    return base64_encode($nonce . $ciphertext);
}

/**
 * Decrypt 2FA secret
 * 
 * @param string $encrypted Base64-encoded encrypted data with nonce
 * @return string|false Decrypted plaintext or false on failure
 */
function decrypt_2fa_secret($encrypted) {
    $key = get_2fa_encryption_key();
    if (!$key) {
        return false;
    }
    
    // Generate encryption key from our key string
    $encryption_key = hash('sha256', $key, true);
    
    // Decode
    $decoded = base64_decode($encrypted);
    if ($decoded === false) {
        return false;
    }
    
    // Extract nonce and ciphertext
    $nonce = mb_substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, '8bit');
    $ciphertext = mb_substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, null, '8bit');
    
    // Decrypt
    $plaintext = sodium_crypto_secretbox_open($ciphertext, $nonce, $encryption_key);
    
    return $plaintext !== false ? $plaintext : false;
}

/**
 * Hash backup code (like a password)
 * 
 * @param string $code The backup code to hash
 * @return string Hashed code
 */
function hash_backup_code($code) {
    return wp_hash_password($code);
}

/**
 * Verify backup code against hash
 * 
 * @param string $code The backup code to verify
 * @param string $hash The stored hash
 * @return bool True if valid
 */
function verify_backup_code($code, $hash) {
    return wp_check_password($code, $hash);
}

/**
 * Register GraphQL fields and mutations for 2FA
 */
add_action('graphql_register_types', function() {
    
    // Add 2FA fields to User type
    register_graphql_field('User', 'twoFactorEnabled', [
        'type' => 'Boolean',
        'description' => __('Whether two-factor authentication is enabled for this user', 'graphql-2fa'),
        'resolve' => function($user) {
            // Only allow user to see their own 2FA status
            $current_user_id = get_current_user_id();
            if ($current_user_id !== $user->userId) {
                return null;
            }
            
            return (bool) get_user_meta($user->userId, 'two_factor_enabled', true);
        }
    ]);
    
    register_graphql_field('User', 'twoFactorSecret', [
        'type' => 'String',
        'description' => __('Encrypted two-factor authentication secret (only accessible to own user)', 'graphql-2fa'),
        'resolve' => function($user) {
            // Strict privacy: only user can access their own secret
            $current_user_id = get_current_user_id();
            if ($current_user_id !== $user->userId) {
                return null;
            }
            
            $encrypted = get_user_meta($user->userId, 'two_factor_secret', true);
            if (!$encrypted) {
                return null;
            }
            
            // Return encrypted (Next.js will handle decryption if needed)
            // For now, we decrypt server-side for simplicity
            return decrypt_2fa_secret($encrypted);
        }
    ]);
    
    register_graphql_field('User', 'twoFactorBackupCodes', [
        'type' => ['list_of' => 'String'],
        'description' => __('Hashed backup codes for account recovery (only accessible to own user)', 'graphql-2fa'),
        'resolve' => function($user) {
            // Strict privacy: only user can access their own backup codes
            $current_user_id = get_current_user_id();
            if ($current_user_id !== $user->userId) {
                return null;
            }
            
            $codes_json = get_user_meta($user->userId, 'two_factor_backup_codes', true);
            if (!$codes_json) {
                return [];
            }
            
            $codes = json_decode($codes_json, true);
            return is_array($codes) ? $codes : [];
        }
    ]);
    
    // Mutation: Update 2FA Secret
    register_graphql_mutation('updateTwoFactorSecret', [
        'inputFields' => [
            'secret' => [
                'type' => 'String',
                'description' => __('The TOTP secret to store', 'graphql-2fa'),
            ],
            'enabled' => [
                'type' => 'Boolean',
                'description' => __('Whether to enable 2FA', 'graphql-2fa'),
            ],
            'backupCodes' => [
                'type' => ['list_of' => 'String'],
                'description' => __('Backup codes for account recovery', 'graphql-2fa'),
            ],
        ],
        'outputFields' => [
            'success' => [
                'type' => 'Boolean',
                'description' => __('Whether the operation succeeded', 'graphql-2fa'),
            ],
            'message' => [
                'type' => 'String',
                'description' => __('Success or error message', 'graphql-2fa'),
            ],
            'user' => [
                'type' => 'User',
                'description' => __('The updated user', 'graphql-2fa'),
            ],
        ],
        'mutateAndGetPayload' => function($input, $context) {
            // Must be authenticated
            if (!is_user_logged_in()) {
                return [
                    'success' => false,
                    'message' => __('You must be logged in to update 2FA settings', 'graphql-2fa'),
                    'user' => null,
                ];
            }
            
            $user_id = get_current_user_id();
            
            // Store secret (encrypted)
            if (!empty($input['secret'])) {
                $encrypted = encrypt_2fa_secret($input['secret']);
                if ($encrypted === false) {
                    return [
                        'success' => false,
                        'message' => __('Encryption failed. Check server configuration.', 'graphql-2fa'),
                        'user' => null,
                    ];
                }
                update_user_meta($user_id, 'two_factor_secret', $encrypted);
            }
            
            // Store enabled status
            if (isset($input['enabled'])) {
                update_user_meta($user_id, 'two_factor_enabled', (bool) $input['enabled']);
                
                // Log 2FA status change
                error_log(sprintf(
                    '2FA %s for user %d (%s)',
                    $input['enabled'] ? 'enabled' : 'disabled',
                    $user_id,
                    wp_get_current_user()->user_login
                ));
            }
            
            // Store backup codes (hashed)
            if (!empty($input['backupCodes']) && is_array($input['backupCodes'])) {
                $hashed_codes = array_map('hash_backup_code', $input['backupCodes']);
                update_user_meta($user_id, 'two_factor_backup_codes', json_encode($hashed_codes));
            }
            
            return [
                'success' => true,
                'message' => __('Two-factor authentication settings updated successfully', 'graphql-2fa'),
                'user' => get_user_by('id', $user_id),
            ];
        }
    ]);
    
    // Mutation: Verify and Consume Backup Code
    register_graphql_mutation('useTwoFactorBackupCode', [
        'inputFields' => [
            'code' => [
                'type' => ['non_null' => 'String'],
                'description' => __('The backup code to verify and consume', 'graphql-2fa'),
            ],
            'userId' => [
                'type' => 'Int',
                'description' => __('User ID (for login flow)', 'graphql-2fa'),
            ],
        ],
        'outputFields' => [
            'valid' => [
                'type' => 'Boolean',
                'description' => __('Whether the backup code was valid', 'graphql-2fa'),
            ],
            'message' => [
                'type' => 'String',
                'description' => __('Result message', 'graphql-2fa'),
            ],
        ],
        'mutateAndGetPayload' => function($input, $context) {
            $user_id = !empty($input['userId']) ? intval($input['userId']) : get_current_user_id();
            
            if (!$user_id) {
                return [
                    'valid' => false,
                    'message' => __('User ID required', 'graphql-2fa'),
                ];
            }
            
            $codes_json = get_user_meta($user_id, 'two_factor_backup_codes', true);
            if (!$codes_json) {
                return [
                    'valid' => false,
                    'message' => __('No backup codes found', 'graphql-2fa'),
                ];
            }
            
            $codes = json_decode($codes_json, true);
            if (!is_array($codes)) {
                return [
                    'valid' => false,
                    'message' => __('Invalid backup codes format', 'graphql-2fa'),
                ];
            }
            
            // Check if code matches any stored hash
            $code_to_verify = trim($input['code']);
            $valid_code_index = null;
            
            foreach ($codes as $index => $hashed_code) {
                if (verify_backup_code($code_to_verify, $hashed_code)) {
                    $valid_code_index = $index;
                    break;
                }
            }
            
            if ($valid_code_index === null) {
                return [
                    'valid' => false,
                    'message' => __('Invalid backup code', 'graphql-2fa'),
                ];
            }
            
            // Consume the backup code (remove from list)
            array_splice($codes, $valid_code_index, 1);
            update_user_meta($user_id, 'two_factor_backup_codes', json_encode($codes));
            
            // Log backup code usage
            $user = get_user_by('id', $user_id);
            error_log(sprintf(
                '2FA backup code used by user %d (%s). %d codes remaining.',
                $user_id,
                $user ? $user->user_login : 'unknown',
                count($codes)
            ));
            
            return [
                'valid' => true,
                'message' => sprintf(
                    __('Backup code accepted. %d backup codes remaining.', 'graphql-2fa'),
                    count($codes)
                ),
            ];
        }
    ]);
    
    // Mutation: Disable 2FA (requires password re-verification in frontend)
    register_graphql_mutation('disableTwoFactor', [
        'inputFields' => [
            'userId' => [
                'type' => 'Int',
                'description' => __('User ID (defaults to current user)', 'graphql-2fa'),
            ],
        ],
        'outputFields' => [
            'success' => [
                'type' => 'Boolean',
                'description' => __('Whether 2FA was disabled', 'graphql-2fa'),
            ],
            'message' => [
                'type' => 'String',
                'description' => __('Result message', 'graphql-2fa'),
            ],
        ],
        'mutateAndGetPayload' => function($input, $context) {
            $user_id = !empty($input['userId']) ? intval($input['userId']) : get_current_user_id();
            
            if (!$user_id) {
                return [
                    'success' => false,
                    'message' => __('User ID required', 'graphql-2fa'),
                ];
            }
            
            // Only user can disable their own 2FA (or admin)
            $current_user_id = get_current_user_id();
            if ($current_user_id !== $user_id && !current_user_can('manage_options')) {
                return [
                    'success' => false,
                    'message' => __('Unauthorized', 'graphql-2fa'),
                ];
            }
            
            // Clear all 2FA data
            delete_user_meta($user_id, 'two_factor_enabled');
            delete_user_meta($user_id, 'two_factor_secret');
            delete_user_meta($user_id, 'two_factor_backup_codes');
            
            // Log 2FA disable
            $user = get_user_by('id', $user_id);
            error_log(sprintf(
                '2FA disabled for user %d (%s)',
                $user_id,
                $user ? $user->user_login : 'unknown'
            ));
            
            return [
                'success' => true,
                'message' => __('Two-factor authentication has been disabled', 'graphql-2fa'),
            ];
        }
    ]);
});

/**
 * Add CORS headers for GraphQL endpoint if needed
 * (Only if WPGraphQL CORS plugin is not installed)
 */
add_filter('graphql_response_headers_to_send', function($headers) {
    // Allow credentials for authenticated requests
    if (!isset($headers['Access-Control-Allow-Credentials'])) {
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return $headers;
});

/**
 * Log plugin activation
 */
register_activation_hook(__FILE__, function() {
    error_log('GraphQL 2FA Extension activated');
});

/**
 * Add admin notice about encryption key
 */
add_action('admin_notices', function() {
    if (!defined('TWO_FACTOR_ENCRYPTION_KEY') && current_user_can('manage_options')) {
        echo '<div class="notice notice-warning is-dismissible">';
        echo '<p><strong>GraphQL 2FA Extension:</strong> Please define TWO_FACTOR_ENCRYPTION_KEY in wp-config.php for production use.</p>';
        echo '<p>Add this line: <code>define(\'TWO_FACTOR_ENCRYPTION_KEY\', \'your-secret-key-here\');</code></p>';
        echo '</div>';
    }
});
