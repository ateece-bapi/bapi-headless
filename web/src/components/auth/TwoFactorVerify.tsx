'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Shield, Key, AlertCircle, Loader2, Clock } from 'lucide-react';
import logger from '@/lib/logger';

interface TwoFactorVerifyProps {
  /**
   * Temporary JWT token from initial login
   */
  tempToken: string;

  /**
   * Optional redirect path after successful verification
   */
  redirectTo?: string;

  /**
   * Callback when verification succeeds
   */
  onSuccess?: () => void;

  /**
   * Callback to return to login screen
   */
  onCancel?: () => void;
}

type InputMode = 'totp' | 'backup';

/**
 * Two-Factor Authentication Verification Component
 *
 * Used during login to verify 2FA code after username/password authentication.
 * Supports both TOTP codes (6 digits) and backup codes (8 characters with hyphen).
 */
export function TwoFactorVerify({
  tempToken,
  redirectTo = '/account/orders',
  onSuccess,
  onCancel,
}: TwoFactorVerifyProps) {
  const { showToast } = useToast();
  const [inputMode, setInputMode] = useState<InputMode>('totp');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount and mode change
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputMode]);

  // TOTP countdown timer
  useEffect(() => {
    if (inputMode !== 'totp') return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [inputMode]);

  /**
   * Verify 2FA code
   */
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (inputMode === 'totp' && !/^\d{6}$/.test(code)) {
      showToast('warning', 'Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    if (inputMode === 'backup' && !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(code)) {
      showToast('warning', 'Invalid Code', 'Backup codes are 8 characters with a hyphen (XXXX-XXXX)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          code: code.trim(),
          isBackupCode: inputMode === 'backup',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        logger.info('2FA verification successful');
        showToast('success', 'Verified!', 'Sign in successful');

        if (onSuccess) {
          onSuccess();
        }

        // Full page reload to ensure cookie propagation
        window.location.href = redirectTo;
      } else {
        // Handle rate limiting
        if (response.status === 429) {
          logger.warn('2FA rate limit reached');
          showToast(
            'error',
            'Too Many Attempts',
            'Please wait 15 minutes before trying again'
          );
          setCode('');
          return;
        }

        // Extract attempts remaining from error message
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }

        logger.warn('2FA verification failed', { error: data.message });

        if (attemptsRemaining !== null && attemptsRemaining <= 2) {
          showToast(
            'error',
            'Verification Failed',
            `${data.message}. ${attemptsRemaining} attempts remaining.`
          );
        } else {
          showToast('error', 'Verification Failed', data.message || 'Invalid code. Please try again.');
        }

        setCode('');
      }
    } catch (error) {
      logger.error('2FA verification error', { error });
      showToast('error', 'Connection Error', 'Unable to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle between TOTP and backup code input
   */
  const handleToggleMode = () => {
    setInputMode((prev) => (prev === 'totp' ? 'backup' : 'totp'));
    setCode('');
    setAttemptsRemaining(null);
  };

  /**
   * Format backup code with hyphen (XXXX-XXXX)
   */
  const formatBackupCode = (value: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Insert hyphen after 4 characters
    if (cleaned.length <= 4) {
      return cleaned;
    }
    
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
  };

  /**
   * Handle input change with validation
   */
  const handleCodeChange = (value: string) => {
    if (inputMode === 'totp') {
      // Only digits, max 6
      const digits = value.replace(/\D/g, '');
      setCode(digits.slice(0, 6));
    } else {
      // Backup code formatting
      const formatted = formatBackupCode(value);
      setCode(formatted);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Shield className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">
          Two-Factor Authentication
        </h2>
        <p className="mt-2 text-neutral-700">
          {inputMode === 'totp'
            ? 'Enter the code from your authenticator app'
            : 'Enter one of your backup codes'}
        </p>
      </div>

      {/* Rate Limit Warning */}
      {attemptsRemaining !== null && attemptsRemaining <= 2 && (
        <div className="rounded-xl border-2 border-error-200 bg-error-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-error-600" />
            <div className="text-sm">
              <p className="font-semibold text-neutral-900">Warning</p>
              <p className="mt-1 text-neutral-700">
                Only {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
                before your account is temporarily locked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="verification-code" className="mb-2 block font-semibold text-neutral-900">
              {inputMode === 'totp' ? 'Verification Code' : 'Backup Code'}
            </label>
            {inputMode === 'totp' && (
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="h-4 w-4" />
                <span>{timeRemaining}s</span>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              id="verification-code"
              type="text"
              inputMode={inputMode === 'totp' ? 'numeric' : 'text'}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder={inputMode === 'totp' ? '000000' : 'XXXX-XXXX'}
              maxLength={inputMode === 'totp' ? 6 : 9}
              className="block w-full appearance-none rounded-xl border-2 border-neutral-300 px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-50"
              disabled={isLoading}
              autoComplete="off"
              aria-label={inputMode === 'totp' ? 'Six digit verification code' : 'Eight character backup code'}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            )}
          </div>

          <p className="mt-2 text-sm text-neutral-700">
            {inputMode === 'totp'
              ? 'The code changes every 30 seconds'
              : 'Each backup code can only be used once'}
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={
            isLoading ||
            (inputMode === 'totp' && code.length !== 6) ||
            (inputMode === 'backup' && !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code))
          }
          fullWidth
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify & Sign In'
          )}
        </Button>
      </form>

      {/* Toggle Input Mode */}
      <div className="border-t-2 border-neutral-200 pt-6">
        <button
          type="button"
          onClick={handleToggleMode}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 px-4 py-3 font-semibold text-neutral-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Key className="h-5 w-5" />
          {inputMode === 'totp' ? 'Use a backup code instead' : 'Use authenticator app'}
        </button>
      </div>

      {/* Help Text */}
      <div className="rounded-xl border-2 border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-700">
          <strong className="text-neutral-900">Lost access to your authenticator?</strong>
          <br />
          Use one of your backup codes to sign in. Each code works only once. Contact support if you&apos;ve
          lost both your authenticator and backup codes.
        </p>
      </div>

      {/* Cancel */}
      {onCancel && (
        <Button variant="ghost" onClick={onCancel} fullWidth disabled={isLoading}>
          Back to Sign In
        </Button>
      )}
    </div>
  );
}
