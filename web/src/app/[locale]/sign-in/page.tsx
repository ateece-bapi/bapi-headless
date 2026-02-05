import { Metadata } from 'next';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - BAPI',
  description: 'Sign in to your BAPI account to access orders, favorites, and quotes.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* BAPI Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">B</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Access your orders, favorites, and quote requests
          </p>
        </div>

        {/* Sign In Form Component */}
        <SignInForm />

        {/* Help Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600">
            Need help?{' '}
            <a
              href="/contact"
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Contact Support
            </a>
          </p>
          <p className="text-xs text-neutral-500">
            Don&apos;t have an account? Contact your sales representative.
          </p>
        </div>
      </div>
    </div>
  );
}
