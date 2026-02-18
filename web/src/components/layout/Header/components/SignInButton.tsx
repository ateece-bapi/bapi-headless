'use client';

import Link from 'next/link';
import { User, LogOut, Settings, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import logger from '@/lib/logger';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  username: string;
}

/**
 * Sign In button for header
 * Shows sign in link when user is not authenticated
 * Shows user menu with sign out when authenticated
 */
const SignInButton: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      logger.error('Auth check failed', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        showToast('success', 'Signed Out', 'You have been logged out successfully');
        setUser(null);
        setShowMenu(false);
        // Force full page reload to clear auth state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        showToast('error', 'Sign Out Failed', 'Unable to sign out. Please try again.');
      }
    } catch (error) {
      logger.error('Sign out error', { error });
      showToast('error', 'Connection Error', 'Unable to connect to server.');
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 lg:px-6">
        <div className="h-5 w-5 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="group flex items-center gap-2 rounded-xl border-2 border-primary-500 bg-white px-3 py-2 text-sm font-semibold text-primary-500 shadow-sm transition-all duration-200 hover:border-primary-600 hover:bg-primary-50 hover:shadow-md lg:px-6 lg:text-base"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
          <span className="hidden lg:inline">{user.displayName || user.username}</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border-2 border-neutral-200 bg-white py-2 shadow-xl">
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              onClick={() => setShowMenu(false)}
            >
              <Package className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              onClick={() => setShowMenu(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <hr className="my-2 border-neutral-200" />
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <Link
      href={`/${locale}/sign-in`}
      className="group relative flex items-center gap-2 rounded-xl border-2 border-primary-500 bg-white px-3 py-2 text-sm font-semibold text-primary-500 shadow-sm transition-all duration-200 hover:border-primary-600 hover:bg-primary-50 hover:shadow-md lg:px-6 lg:text-base"
      aria-label="Sign in to your account"
    >
      <User className="h-5 w-5" />
      <span className="hidden lg:inline">Sign In</span>
    </Link>
  );
};

export default SignInButton;
