import { Metadata } from 'next';
import { SignInForm } from './SignInForm';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In - BAPI',
  description: 'Sign in to your BAPI account to access orders, favorites, and quotes.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* BAPI Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-primary-500/20">
              <Building2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-neutral-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-3 text-base text-neutral-600 max-w-sm mx-auto">
            Sign in to access your orders, saved products, and quote requests
          </p>
        </div>

        {/* Sign In Form Component */}
        <SignInForm />

        {/* Help Text */}
        <div className="text-center space-y-3 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <a
              href="/contact"
              className="font-semibold text-primary-500 hover:text-primary-600 transition-colors focus:outline-none focus:underline"
            >
              Contact your sales representative
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
