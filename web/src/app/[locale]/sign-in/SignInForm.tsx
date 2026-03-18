'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/Toast';
import { TwoFactorVerify } from '@/components/auth/TwoFactorVerify';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, ShieldCheckIcon } from '@/lib/icons';
import logger from '@/lib/logger';

type SignInFormProps = {
  locale: string;
};

export function SignInForm({ locale }: SignInFormProps) {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const t = useTranslations('auth.signInPage');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA state
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('warning', t('toast.missingFields.title'), t('toast.missingFields.message'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if 2FA is required
        if (data.requires2FA && data.tempToken) {
          logger.info('2FA required for user', { username });
          setTempToken(data.tempToken);
          setShowTwoFactor(true);
          return;
        }

        // Standard login (no 2FA)
        showToast('success', t('toast.welcomeBack.title'), t('toast.welcomeBack.message'));

        // Redirect to intended page or account dashboard
        const redirect = searchParams?.get('redirect') || `/${locale}/account`;

        // Force full page reload to ensure cookies are sent to server
        // Client-side navigation (router.push) doesn't send httpOnly cookies
        // to Server Components, causing authentication to fail
        setTimeout(() => {
          window.location.href = redirect;
        }, 500);
      } else {
        logger.warn('Sign in failed', { username, error: data.message });

        // Decode HTML entities from WordPress error messages
        const errorMessage = data.message || t('toast.signInFailed.defaultMessage');
        const decodedMessage = errorMessage
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          // Strip HTML tags for clean error message
          .replace(/<[^>]*>/g, '');

        showToast('error', t('toast.signInFailed.title'), decodedMessage);
      }
    } catch (error) {
      // Normalize error to actual Error instance for proper logging
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(
              typeof error === 'string'
                ? error
                : `Non-Error thrown: ${JSON.stringify(error)}`
            );
      logger.error('Sign in error', normalizedError, { username });
      showToast('error', t('toast.connectionError.title'), t('toast.connectionError.message'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancellation of 2FA flow - return to login
   */
  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setTempToken('');
    setPassword('');
  };

  // Show 2FA verification if required
  if (showTwoFactor && tempToken) {
    const redirect = searchParams?.get('redirect') || `/${locale}/account`;
    return (
      <TwoFactorVerify
        tempToken={tempToken}
        redirectTo={redirect}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-6 rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-xl lg:p-10">
        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900"
          >
            <UserIcon className="h-4 w-4 text-primary-500" />
            {t('form.usernameLabel')}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="relative block w-full appearance-none rounded-xl border-2 border-neutral-300 px-4 py-3.5 text-base text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-50"
            placeholder={t('form.usernamePlaceholder')}
            disabled={isLoading}
            aria-label={t('form.usernameAriaLabel')}
          />
        </div>

        {/* Password Field with Toggle */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900"
          >
            <LockIcon className="h-4 w-4 text-primary-500" />
            {t('form.passwordLabel')}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full appearance-none rounded-xl border-2 border-neutral-300 px-4 py-3.5 pr-12 text-base text-neutral-900 placeholder-neutral-400 transition-all hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-50"
              placeholder={t('form.passwordPlaceholder')}
              disabled={isLoading}
              aria-label={t('form.passwordAriaLabel')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-700 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={showPassword ? t('form.hidePassword') : t('form.showPassword')}
              disabled={isLoading}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-primary-500 transition-all focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block cursor-pointer select-none text-sm text-neutral-700 transition-colors hover:text-neutral-900"
            >
              {t('form.rememberMe')}
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/contact"
              className="font-semibold text-primary-500 transition-colors hover:text-primary-600 focus:underline focus:outline-none"
            >
              {t('form.forgotPassword')}
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-primary-600 hover:to-primary-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-primary-500 disabled:hover:to-primary-700 disabled:active:scale-100"
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>{t('form.submittingButton')}</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon className="h-5 w-5" />
              <span>{t('form.submitButton')}</span>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
          <LockIcon className="h-4 w-4 text-primary-500" />
          <span className="font-medium">{t('security.secureConnection')}</span>
        </div>

        {/* Help Text */}
        <p className="text-sm text-neutral-700">
          {t('security.needHelp')}{' '}
          <Link
            href="/contact"
            className="font-semibold text-primary-500 transition-colors hover:text-primary-600 focus:underline focus:outline-none"
          >
            {t('security.contactSupport')}
          </Link>
        </p>
      </div>
    </form>
  );
}
