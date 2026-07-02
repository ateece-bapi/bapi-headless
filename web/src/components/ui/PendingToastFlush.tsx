'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import type { ToastType } from '@/components/ui/Toast';

interface PendingToast {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export const PENDING_TOAST_KEY = 'bapi_pending_toast';

/**
 * Write a toast intent to sessionStorage to be fired after the next navigation.
 * Call this before router.replace() / router.push() so the toast survives remount.
 */
export function schedulePendingToast(toast: PendingToast) {
  try {
    sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(toast));
  } catch {
    // sessionStorage unavailable (e.g., private mode restriction) — silent fail
  }
}

/**
 * Reads and fires any pending toast written before a navigation.
 * Add once to the root layout inside ToastProvider — it runs on every page mount.
 */
export function PendingToastFlush() {
  const { showToast } = useToast();

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(PENDING_TOAST_KEY);
      if (raw) sessionStorage.removeItem(PENDING_TOAST_KEY);
    } catch {
      return; // sessionStorage unavailable
    }

    if (!raw) return;

    try {
      const { type, title, message, duration = 4000 } = JSON.parse(raw) as PendingToast;
      showToast(type, title, message, duration);
    } catch {
      // Corrupt entry — ignore
    }
  }, [showToast]);

  return null;
}
