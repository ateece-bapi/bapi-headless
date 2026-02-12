import { Metadata } from 'next';
import { SignInForm } from './SignInForm';
import { Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In - BAPI',
  description: 'Sign in to your BAPI account to access orders, favorites, and quotes.',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* BAPI Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl ring-4 ring-primary-500/20">
              <Building2 className="h-10 w-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900">
            Welcome Back
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-base text-neutral-600">
            Sign in to access your orders, saved products, and quote requests
          </p>
        </div>

        {/* Sign In Form Component */}
        <SignInForm />

        {/* Help Text */}
        <div className="space-y-3 border-t border-neutral-200 pt-4 text-center">
          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <a
              href="/contact"
              className="font-semibold text-primary-500 transition-colors hover:text-primary-600 focus:underline focus:outline-none"
            >
              Contact your sales representative
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
