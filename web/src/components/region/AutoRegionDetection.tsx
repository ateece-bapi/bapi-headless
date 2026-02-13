'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from '@/lib/navigation';
import { useLocale } from 'next-intl';
import { useRegion, useSetRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import type { RegionCode, LanguageCode } from '@/types/region';
import { REGIONS, LANGUAGES } from '@/types/region';

interface DetectionResult {
  detected: boolean;
  country: string;
  countryName: string;
  city: string;
  region: RegionCode;
  language: LanguageCode;
}

/**
 * Auto-detect user's region and language on first visit
 * Pattern: Auto-apply + inform (non-intrusive)
 *
 * Behavior:
 * 1. On first visit only (checks localStorage)
 * 2. Detects country via Vercel Edge API
 * 3. Auto-applies region and language
 * 4. Shows friendly toast notification (10 seconds)
 * 5. User can change settings or dismiss
 * 6. Never shows again after first visit
 */
export function AutoRegionDetection() {
  const currentRegion = useRegion();
  const setRegion = useSetRegion();
  const currentLocale = useLocale() as LanguageCode;
  const router = useRouter();
  const { showToast } = useToast();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once per mount
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if user has seen the welcome message
    const hasSeenWelcome = localStorage.getItem('bapi-region-welcome-shown');
    const hasUserSetRegion = localStorage.getItem('bapi-region-storage');

    // Skip if either:
    // 1. User has already seen the welcome
    // 2. User has manually set a region before
    if (hasSeenWelcome || hasUserSetRegion) {
      return;
    }

    // Detect and apply region
    const detectAndApplyRegion = async () => {
      try {
        const response = await fetch('/api/detect-region');
        const data: DetectionResult = await response.json();

        if (!data.detected) {
          // Detection failed, silently use defaults (already set to US)
          return;
        }

        // Get region and language info
        const detectedRegion = REGIONS[data.region];
        const detectedLanguage = LANGUAGES[data.language];

        // Check if detected region is different from current
        const regionChanged = data.region !== currentRegion.code;
        const languageChanged = data.language !== currentLocale;

        // If nothing changed, mark as shown and skip
        if (!regionChanged && !languageChanged) {
          localStorage.setItem('bapi-region-welcome-shown', 'true');
          return;
        }

        // Auto-apply region if different
        if (regionChanged) {
          setRegion(data.region);
        }

        // Build welcome message
        let message = `We detected you're in ${data.countryName}`;
        if (data.city) {
          message += `, ${data.city}`;
        }

        const changes: string[] = [];
        if (regionChanged) {
          changes.push(`Region: ${detectedRegion.name} (${detectedRegion.currency})`);
        }
        if (languageChanged) {
          changes.push(`Language: ${detectedLanguage.nativeName}`);
        }

        if (changes.length > 0) {
          message += `\n${changes.join(' • ')}`;
        }

        // Show friendly, non-intrusive toast
        showToast('info', '🌍 Welcome to BAPI!', message, 10000, {
          action: languageChanged
            ? {
                label: `Switch to ${detectedLanguage.nativeName}`,
                onClick: () => {
                  // Change language by navigating to detected locale
                  router.replace(window.location.pathname, { locale: data.language });
                },
              }
            : undefined,
        });

        // Mark as shown (never show again)
        localStorage.setItem('bapi-region-welcome-shown', 'true');
      } catch (error) {
        // Detection failed, silently continue with defaults
        console.warn('Region auto-detection failed:', error);
      }
    };

    detectAndApplyRegion();
  }, [currentRegion.code, currentLocale, setRegion, router, showToast]);

  // This component doesn't render anything (invisible)
  return null;
}
