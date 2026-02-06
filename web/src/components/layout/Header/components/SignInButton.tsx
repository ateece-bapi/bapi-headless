'use client';

import Link from 'next/link';
import { User, LogOut, Settings, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="px-3 lg:px-6 py-2 rounded-xl bg-white border-2 border-neutral-200">
        <div className="w-5 h-5 animate-pulse bg-neutral-200 rounded" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="group flex items-center gap-2 px-3 lg:px-6 py-2 rounded-xl bg-white text-primary-500 hover:bg-primary-50 transition-all duration-200 border-2 border-primary-500 hover:border-primary-600 shadow-sm hover:shadow-md font-semibold text-sm lg:text-base"
          aria-label="User menu"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:inline">{user.displayName || user.username}</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-neutral-200 py-2 z-50">
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Package className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <hr className="my-2 border-neutral-200" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="group relative flex items-center gap-2 px-3 lg:px-6 py-2 rounded-xl bg-white text-primary-500 hover:bg-primary-50 transition-all duration-200 border-2 border-primary-500 hover:border-primary-600 shadow-sm hover:shadow-md font-semibold text-sm lg:text-base"
      aria-label="Sign in to your account"
    >
      <User className="w-5 h-5" />
      <span className="hidden lg:inline">Sign In</span>
    </Link>
  );
};

export default SignInButton;
