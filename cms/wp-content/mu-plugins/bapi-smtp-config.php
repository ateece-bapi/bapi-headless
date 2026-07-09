<?php
/**
 * Plugin Name: BAPI SMTP Configuration
 * Description: Configures WooCommerce / WordPress transactional email via SMTP.
 *              Supports AWS SES (recommended for Kinsta) or any generic SMTP provider.
 *              All credentials are read from environment variables / wp-config.php constants —
 *              never hard-coded.
 *
 *   Required constants (set in wp-config.php or via Kinsta environment variables):
 *
 *     BAPI_SMTP_HOST        SMTP hostname              e.g. email-smtp.us-east-1.amazonaws.com
 *     BAPI_SMTP_PORT        SMTP port                  e.g. 587 (STARTTLS) or 465 (SSL)
 *     BAPI_SMTP_ENCRYPTION  'tls' | 'ssl' | ''         e.g. tls
 *     BAPI_SMTP_USERNAME    SMTP auth username          (AWS SES SMTP credentials)
 *     BAPI_SMTP_PASSWORD    SMTP auth password          (AWS SES SMTP credentials)
 *     BAPI_SMTP_FROM_EMAIL  Sender address              e.g. no-reply@bapi.com
 *     BAPI_SMTP_FROM_NAME   Sender display name         e.g. BAPI Automation
 *
 *   Optional:
 *     BAPI_SMTP_DEBUG       '1' to log SMTP commands to error_log (dev/staging only)
 *
 * Deployment checklist item: verify BAPI_SMTP_* vars are set before go-live.
 *
 * Version: 1.0.0
 * Author: BAPI Development Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ---------------------------------------------------------------------------
// Helper: read constant or fall back to getenv()
// ---------------------------------------------------------------------------

function bapi_smtp_env( string $name, string $default = '' ): string {
    if ( defined( $name ) ) {
        return (string) constant( $name );
    }
    $value = getenv( $name );
    return $value !== false ? $value : $default;
}

// ---------------------------------------------------------------------------
// Guard: skip if SMTP is not configured (avoids breaking non-configured envs)
// ---------------------------------------------------------------------------

function bapi_smtp_is_configured(): bool {
    return bapi_smtp_env( 'BAPI_SMTP_HOST' ) !== ''
        && bapi_smtp_env( 'BAPI_SMTP_USERNAME' ) !== ''
        && bapi_smtp_env( 'BAPI_SMTP_PASSWORD' ) !== '';
}

if ( ! bapi_smtp_is_configured() ) {
    // Log a notice in production so it shows up in Kinsta logs.
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        error_log( '[BAPI SMTP] SMTP not configured. Set BAPI_SMTP_* constants to enable transactional email.' );
    }
    return;
}

// ---------------------------------------------------------------------------
// Override phpmailer settings via action hook
// ---------------------------------------------------------------------------

add_action( 'phpmailer_init', function ( PHPMailer\PHPMailer\PHPMailer $phpmailer ) {
    $phpmailer->isSMTP();

    $phpmailer->Host       = bapi_smtp_env( 'BAPI_SMTP_HOST' );
    $phpmailer->Port       = (int) bapi_smtp_env( 'BAPI_SMTP_PORT', '587' );
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Username   = bapi_smtp_env( 'BAPI_SMTP_USERNAME' );
    $phpmailer->Password   = bapi_smtp_env( 'BAPI_SMTP_PASSWORD' );

    $encryption = strtolower( bapi_smtp_env( 'BAPI_SMTP_ENCRYPTION', 'tls' ) );
    if ( $encryption === 'ssl' ) {
        $phpmailer->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    } elseif ( $encryption === 'tls' ) {
        $phpmailer->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $phpmailer->SMTPSecure = '';
        $phpmailer->SMTPAutoTLS = false;
    }

    // Debug SMTP to error_log (staging only — never enable in production).
    if ( bapi_smtp_env( 'BAPI_SMTP_DEBUG' ) === '1' ) {
        $phpmailer->SMTPDebug  = 2; // SMTP::DEBUG_SERVER
        $phpmailer->Debugoutput = 'error_log';
    }

    // Override From headers only if the message has no explicit From set.
    $from_email = bapi_smtp_env( 'BAPI_SMTP_FROM_EMAIL' );
    $from_name  = bapi_smtp_env( 'BAPI_SMTP_FROM_NAME', get_bloginfo( 'name' ) );

    if ( $from_email !== '' ) {
        $phpmailer->setFrom( $from_email, $from_name );
    }
} );

// ---------------------------------------------------------------------------
// Override WordPress wp_mail_from / wp_mail_from_name filters
// ---------------------------------------------------------------------------

add_filter( 'wp_mail_from', function ( string $from_email ): string {
    $configured = bapi_smtp_env( 'BAPI_SMTP_FROM_EMAIL' );
    return $configured !== '' ? $configured : $from_email;
} );

add_filter( 'wp_mail_from_name', function ( string $from_name ): string {
    $configured = bapi_smtp_env( 'BAPI_SMTP_FROM_NAME' );
    return $configured !== '' ? $configured : $from_name;
} );

// ---------------------------------------------------------------------------
// REST endpoint: POST /wp-json/bapi/v1/test-email
// Sends a test email to verify SMTP config. Admin-only.
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
    register_rest_route( 'bapi/v1', '/test-email', [
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'bapi_smtp_test_endpoint',
        'permission_callback' => fn() => current_user_can( 'manage_options' ),
        'args'                => [
            'to' => [
                'required'          => true,
                'sanitize_callback' => 'sanitize_email',
                'validate_callback' => 'is_email',
                'description'       => 'Recipient email address for the test message.',
            ],
        ],
    ] );
} );

function bapi_smtp_test_endpoint( WP_REST_Request $request ): WP_REST_Response {
    $to      = $request->get_param( 'to' );
    $subject = '[BAPI] SMTP Test — ' . gmdate( 'Y-m-d H:i:s' ) . ' UTC';
    $message = "This is an automated SMTP test from BAPI Headless.\n\n"
             . "Host:       " . bapi_smtp_env( 'BAPI_SMTP_HOST' ) . "\n"
             . "Port:       " . bapi_smtp_env( 'BAPI_SMTP_PORT', '587' ) . "\n"
             . "Encryption: " . bapi_smtp_env( 'BAPI_SMTP_ENCRYPTION', 'tls' ) . "\n"
             . "From:       " . bapi_smtp_env( 'BAPI_SMTP_FROM_EMAIL' ) . "\n"
             . "\nIf you received this, SMTP is configured correctly.";

    $sent = wp_mail( $to, $subject, $message );

    if ( $sent ) {
        return new WP_REST_Response( [ 'success' => true, 'message' => "Test email sent to {$to}" ], 200 );
    }

    global $phpmailer;
    $error = isset( $phpmailer ) ? $phpmailer->ErrorInfo : 'Unknown error';

    return new WP_REST_Response(
        [ 'success' => false, 'message' => 'Failed to send test email', 'error' => $error ],
        500
    );
}
