'use client';

import { useState, FormEvent } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  QrCode,
  Copy,
  Download,
  Check,
  AlertCircle,
  Smartphone,
  Key,
  Lock,
  ChevronRight,
} from 'lucide-react';
import logger from '@/lib/logger';

interface TwoFactorSetupProps {
  /**
   * Callback when 2FA is successfully enabled
   */
  onComplete?: () => void;

  /**
   * Callback when user cancels setup
   */
  onCancel?: () => void;
}

interface SetupData {
  qrCode: string; // Base64 PNG data URL
  secret: string; // For manual entry
  uri: string; // otpauth:// URI
  backupCodes: string[]; // Recovery codes
}

type SetupStep = 'intro' | 'scan' | 'verify' | 'backup' | 'complete';

/**
 * Two-Factor Authentication Setup Component
 *
 * Guides users through enabling 2FA:
 * 1. Introduction and requirements
 * 2. QR code scanning or manual entry
 * 3. Code verification
 * 4. Backup codes display and download
 * 5. Completion confirmation
 */
export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<SetupStep>('intro');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  /**
   * Step 1: Initiate 2FA setup - fetch QR code and backup codes
   */
  const handleInitiateSetup = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setSetupData(data);
        setCurrentStep('scan');
        logger.info('2FA setup initiated');
      } else {
        logger.error('Failed to initiate 2FA setup', { error: data.message });
        showToast('error', 'Setup Failed', data.message || 'Unable to start 2FA setup');
      }
    } catch (error) {
      logger.error('2FA setup error', { error });
      showToast('error', 'Connection Error', 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Verify code and enable 2FA
   */
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      showToast('warning', 'Invalid Code', 'Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        logger.info('2FA enabled successfully');
        setCurrentStep('backup');
        showToast('success', 'Verified!', 'Two-factor authentication is now enabled');
      } else {
        logger.warn('2FA verification failed', { error: data.message });
        showToast('error', 'Verification Failed', data.message || 'Invalid code. Please try again.');
        setVerificationCode('');
      }
    } catch (error) {
      logger.error('2FA verification error', { error });
      showToast('error', 'Connection Error', 'Unable to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Copy secret to clipboard
   */
  const handleCopySecret = async () => {
    if (!setupData) return;

    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      showToast('success', 'Copied!', 'Secret key copied to clipboard');
      setTimeout(() => setCopiedSecret(false), 3000);
    } catch (error) {
      logger.error('Failed to copy secret', { error });
      showToast('error', 'Copy Failed', 'Unable to copy to clipboard');
    }
  };

  /**
   * Copy backup codes to clipboard
   */
  const handleCopyBackupCodes = async () => {
    if (!setupData) return;

    try {
      const codesText = setupData.backupCodes.join('\n');
      await navigator.clipboard.writeText(codesText);
      setCopiedBackupCodes(true);
      showToast('success', 'Copied!', 'Backup codes copied to clipboard');
      setTimeout(() => setCopiedBackupCodes(false), 3000);
    } catch (error) {
      logger.error('Failed to copy backup codes', { error });
      showToast('error', 'Copy Failed', 'Unable to copy to clipboard');
    }
  };

  /**
   * Download backup codes as text file
   */
  const handleDownloadBackupCodes = () => {
    if (!setupData) return;

    const codesText = [
      'BAPI Two-Factor Authentication Backup Codes',
      '============================================',
      '',
      'Keep these codes safe! Each code can only be used once.',
      'Use them if you lose access to your authenticator app.',
      '',
      ...setupData.backupCodes.map((code, i) => `${i + 1}. ${code}`),
      '',
      `Generated: ${new Date().toLocaleString()}`,
    ].join('\n');

    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bapi-2fa-backup-codes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('success', 'Downloaded!', 'Backup codes saved to your computer');
  };

  /**
   * Complete setup
   */
  const handleComplete = () => {
    setCurrentStep('complete');
    if (onComplete) {
      setTimeout(() => onComplete(), 2000);
    }
  };

  // Intro Step
  if (currentStep === 'intro') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Enable Two-Factor Authentication
          </h2>
          <p className="mt-2 text-neutral-700">
            Add an extra layer of security to your account
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Smartphone className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">What You&apos;ll Need</h3>
                <p className="mt-1 text-sm text-neutral-700">
                  An authenticator app on your phone (like Google Authenticator, Authy, or 1Password)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <Lock className="h-6 w-6 text-neutral-900" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">How It Works</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    Scan a QR code with your authenticator app
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    Enter a 6-digit code to verify
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    Save backup codes for account recovery
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-error-200 bg-error-50 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <AlertCircle className="h-6 w-6 text-error-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Important</h3>
                <p className="mt-1 text-sm text-neutral-700">
                  You&apos;ll receive backup codes to save. Keep them safe! They&apos;re the only way to access
                  your account if you lose your phone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} fullWidth disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleInitiateSetup}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Setting up...' : 'Get Started'}
          </Button>
        </div>
      </div>
    );
  }

  // Scan Step
  if (currentStep === 'scan' && setupData) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <QrCode className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Scan QR Code</h2>
          <p className="mt-2 text-neutral-700">
            Open your authenticator app and scan this code
          </p>
        </div>

        {/* QR Code */}
        <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto inline-block rounded-xl border-4 border-primary-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={setupData.qrCode}
              alt="Two-factor authentication QR code"
              className="h-64 w-64"
            />
          </div>
          <p className="mt-4 text-sm text-neutral-700">
            Scan this QR code with your authenticator app
          </p>
        </div>

        {/* Manual Entry */}
        <details className="group rounded-xl border-2 border-neutral-200 bg-neutral-50">
          <summary className="cursor-pointer px-6 py-4 font-semibold text-neutral-900 hover:text-primary-600">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <span>Can&apos;t scan? Enter manually</span>
            </div>
          </summary>
          <div className="border-t-2 border-neutral-200 px-6 py-4">
            <p className="mb-3 text-sm text-neutral-700">
              Enter this secret key in your authenticator app:
            </p>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border-2 border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-neutral-900">
                {setupData.secret}
              </code>
              <Button
                variant="outline"
                size="md"
                onClick={handleCopySecret}
                aria-label="Copy secret key"
              >
                {copiedSecret ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </details>

        {/* Next Step */}
        <div className="rounded-xl border-2 border-accent-200 bg-accent-50 p-6">
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verify-code" className="mb-2 block font-semibold text-neutral-900">
                Enter the 6-digit code from your app
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="block w-full appearance-none rounded-xl border-2 border-neutral-300 px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-50"
                disabled={isLoading}
                autoComplete="off"
                autoFocus
                aria-label="Six digit verification code"
              />
              <p className="mt-2 text-sm text-neutral-700">
                The code changes every 30 seconds
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || verificationCode.length !== 6}
              fullWidth
            >
              {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
            </Button>
          </form>
        </div>

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} fullWidth disabled={isLoading}>
            Cancel Setup
          </Button>
        )}
      </div>
    );
  }

  // Backup Codes Step
  if (currentStep === 'backup' && setupData) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
            <Key className="h-8 w-8 text-neutral-900" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Save Your Backup Codes</h2>
          <p className="mt-2 text-neutral-700">
            Keep these codes safe - they&apos;re your account recovery method
          </p>
        </div>

        {/* Warning */}
        <div className="rounded-xl border-2 border-error-200 bg-error-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 shrink-0 text-error-600" />
            <div className="text-sm text-neutral-900">
              <p className="font-semibold">Important: Save these codes now!</p>
              <p className="mt-1 text-neutral-700">
                Each code can only be used once. If you lose access to your authenticator app, these
                codes are the only way to access your account.
              </p>
            </div>
          </div>
        </div>

        {/* Backup Codes */}
        <div className="rounded-xl border-2 border-neutral-200 bg-white p-6 shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            {setupData.backupCodes.map((code, index) => (
              <div
                key={code}
                className="rounded-lg border-2 border-neutral-200 bg-neutral-50 px-4 py-3 text-center"
              >
                <span className="text-xs text-neutral-700">#{index + 1}</span>
                <code className="mt-1 block font-mono text-base font-semibold text-neutral-900">
                  {code}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleCopyBackupCodes}
            fullWidth
            className="justify-center gap-2"
          >
            {copiedBackupCodes ? (
              <>
                <Check className="h-5 w-5" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Copy to Clipboard
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadBackupCodes}
            fullWidth
            className="justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download as Text File
          </Button>

          <Button variant="primary" onClick={handleComplete} fullWidth>
            I&apos;ve Saved My Backup Codes
          </Button>
        </div>
      </div>
    );
  }

  // Complete Step
  if (currentStep === 'complete') {
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
          <Check className="h-10 w-10 text-success-600" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900">All Set!</h2>
        <p className="text-lg text-neutral-700">
          Two-factor authentication is now enabled on your account
        </p>
        <div className="rounded-xl border-2 border-success-200 bg-success-50 p-6">
          <p className="text-sm text-neutral-900">
            From now on, you&apos;ll need to enter a code from your authenticator app when signing in.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
