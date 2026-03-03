'use client';

import { useEffect, useState } from 'react';
import TwoFactorBanner from '@/components/account/TwoFactorBanner';

interface AccountDashboardClientProps {
  locale: string;
  userId: string;
}

export default function AccountDashboardClient({ locale, userId }: AccountDashboardClientProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTwoFactorStatus() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setTwoFactorEnabled(data.twoFactorEnabled || false);
        }
      } catch (error) {
        console.error('Failed to fetch 2FA status:', error);
        setTwoFactorEnabled(false); // Default to false on error
      } finally {
        setLoading(false);
      }
    }

    fetchTwoFactorStatus();
  }, [userId]);

  // Don't render anything while loading
  if (loading || twoFactorEnabled === null) {
    return null;
  }

  return <TwoFactorBanner locale={locale} isEnabled={twoFactorEnabled} />;
}
