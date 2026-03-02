'use client';

import { useState, FormEvent } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { TwoFactorSetup } from './TwoFactorSetup';
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import logger from '@/lib/logger';

interface TwoFactorSettingsProps {
  /**
   * Whether 2FA is currently enabled
   */
  isEnabled: boolean;

  /**
   * Optional callback when 2FA status changes
   */
  onStatusChange?: (enabled: boolean) => void;
}

type ViewMode = 'status' | 'setup' | 'disable';

/**
 * Two-Factor Authentication Settings Component
 *
 * Manages 2FA status in user account settings:
 * - Enable 2FA (shows setup flow)
 * - Disable 2FA (requires password + TOTP confirmation)
 * - View current status
 */
export function TwoFactorSettings({ isEnabled, onStatusChange }: TwoFactorSettingsProps) {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<ViewMode>('status');
  const [localIsEnabled, setLocalIsEnabled] = useState(isEnabled);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle successful 2FA setup
   */
  const handleSetupComplete = () => {
    setLocalIsEnabled(true);
    setCurrentView('status');
    showToast('success', '2FA Enabled', 'Your account is now protected with two-factor authentication');
    
    if (onStatusChange) {
      onStatusChange(true);
    }

    // Full page reload to refresh auth state
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  /**
   * Handle 2FA disable request
   */
  const handleDisable = async (e: FormEvent) => {
    e.preventDefault();

    if (!disablePassword || !disableCode) {
      showToast('warning', 'Required Fields', 'Please enter your password and verification code');
      return;
    }

    if (!/^\d{6}$/.test(disableCode)) {
      showToast('warning', 'Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: disablePassword,
          code: disableCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        logger.info('2FA disabled successfully');
        setLocalIsEnabled(false);
        setShowDisableForm(false);
        setDisablePassword('');
        setDisableCode('');
        showToast('success', '2FA Disabled', 'Two-factor authentication has been turned off');
        
        if (onStatusChange) {
          onStatusChange(false);
        }

        // Refresh to update auth state
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        logger.warn('2FA disable failed', { error: data.message });
        showToast('error', 'Unable to Disable', data.message || 'Verification failed. Please try again.');
        setDisableCode('');
      }
    } catch (error) {
      logger.error('2FA disable error', { error });
      showToast('error', 'Connection Error', 'Unable to disable 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  // Setup View
  if (currentView === 'setup') {
    return (
      <TwoFactorSetup
        onComplete={handleSetupComplete}
        onCancel={() => setCurrentView('status')}
      />
    );
  }

  // Status View
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Two-Factor Authentication</h2>
        <p className="mt-2 text-neutral-600">
          Add an extra layer of security to your account
        </p>
      </div>

      {/* Current Status Card */}
      <div
        className={`rounded-xl border-2 p-6 ${
          localIsEnabled
            ? 'border-success-200 bg-success-50'
            : 'border-neutral-200 bg-neutral-50'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {localIsEnabled ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                <ShieldCheck className="h-6 w-6 text-success-600" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200">
                <ShieldOff className="h-6 w-6 text-neutral-600" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-neutral-900">
                {localIsEnabled ? 'Enabled' : 'Disabled'}
              </h3>
              {localIsEnabled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-600 px-3 py-1 text-xs font-bold text-white">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-700">
              {localIsEnabled
                ? 'Your account is protected with two-factor authentication. You need your password and a verification code to sign in.'
                : 'Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account.'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      {!localIsEnabled && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 shrink-0 text-primary-600" />
              <div>
                <h3 className="font-semibold text-neutral-900">Why Enable 2FA?</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  <li>• Protect your account from unauthorized access</li>
                  <li>• Prevent credential stuffing attacks</li>
                  <li>• Add security for sensitive operations</li>
                  <li>• Meet industry security standards</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
            <div className="flex items-start gap-4">
              <Key className="h-6 w-6 shrink-0 text-neutral-900" />
              <div>
                <h3 className="font-semibold text-neutral-900">What You&apos;ll Need</h3>
                <p className="mt-1 text-sm text-neutral-700">
                  An authenticator app like Google Authenticator, Authy, 1Password, or Microsoft
                  Authenticator on your phone or computer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Codes Warning (If Enabled) */}
      {localIsEnabled && (
        <div className="rounded-xl border-2 border-error-200 bg-error-50 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 shrink-0 text-error-600" />
            <div>
              <h3 className="font-semibold text-neutral-900">Keep Your Backup Codes Safe</h3>
              <p className="mt-1 text-sm text-neutral-700">
                Make sure you&apos;ve saved your backup codes in a secure location. If you lose access to
                your authenticator app, backup codes are the only way to access your account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!localIsEnabled ? (
        <Button
          variant="primary"
          onClick={() => setCurrentView('setup')}
          fullWidth
          className="justify-center gap-2"
        >
          <Shield className="h-5 w-5" />
          Enable Two-Factor Authentication
        </Button>
      ) : (
        <>
          {!showDisableForm ? (
            <Button
              variant="outline"
              onClick={() => setShowDisableForm(true)}
              fullWidth
              className="justify-center gap-2 border-error-300 text-error-700 hover:border-error-400 hover:bg-error-50"
            >
              <ShieldOff className="h-5 w-5" />
              Disable Two-Factor Authentication
            </Button>
          ) : (
            <div className="space-y-4 rounded-xl border-2 border-error-200 bg-error-50 p-6">
              {/* Warning */}
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-error-600" />
                <div className="text-sm">
                  <p className="font-semibold text-neutral-900">Are you sure?</p>
                  <p className="mt-1 text-neutral-700">
                    Disabling 2FA will make your account less secure. You&apos;ll only need your password to sign in.
                  </p>
                </div>
              </div>

              {/* Disable Form */}
              <form onSubmit={handleDisable} className="space-y-4">
                {/* Password */}
                <div>
                  <label htmlFor="disable-password" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Confirm Your Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="disable-password"
                      type={showPassword ? 'text' : 'password'}
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full appearance-none rounded-xl border-2 border-neutral-300 py-3 pl-12 pr-12 text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-100"
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Verification Code */}
                <div>
                  <label htmlFor="disable-code" className="mb-2 block text-sm font-semibold text-neutral-900">
                    Verification Code
                  </label>
                  <input
                    id="disable-code"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="block w-full appearance-none rounded-xl border-2 border-neutral-300 px-4 py-3 text-center text-xl font-bold tracking-widest text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-100"
                    disabled={isLoading}
                    autoComplete="off"
                    required
                    aria-label="Six digit verification code"
                  />
                  <p className="mt-2 text-sm text-neutral-600">
                    Enter the code from your authenticator app
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDisableForm(false);
                      setDisablePassword('');
                      setDisableCode('');
                    }}
                    disabled={isLoading}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={isLoading || !disablePassword || disableCode.length !== 6}
                    fullWidth
                  >
                    {isLoading ? 'Disabling...' : 'Disable 2FA'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* Security Tip */}
      <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <Lock className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Security Tip</h3>
            <p className="mt-1 text-sm text-neutral-700">
              Two-factor authentication significantly improves account security. Even if someone
              obtains your password, they won&apos;t be able to access your account without access to
              your authenticator app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
