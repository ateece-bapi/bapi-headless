'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage mega menu state
 * Based on patterns from bapi-mega-menu repository
 */
export function useMegaMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);

  /**
   * Open menu with intent delay (80ms)
   * Prevents accidental opens when mouse quickly passes through
   */
  const openWithIntent = useCallback((index: number) => {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    const timer = window.setTimeout(() => {
      setOpenIndex(index);
    }, 80);
    setHoverTimer(timer);
  }, [hoverTimer]);

  /**
   * Close menu with grace period (140ms)
   * Allows user to move between trigger and panel without closing
   */
  const closeWithGrace = useCallback(() => {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    const timer = window.setTimeout(() => {
      setOpenIndex(null);
    }, 140);
    setHoverTimer(timer);
  }, [hoverTimer]);

  /**
   * Cancel any pending timers
   * Used when user re-enters hover zone
   */
  const cancelTimers = useCallback(() => {
    if (hoverTimer) {
      window.clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  }, [hoverTimer]);

  /**
   * Immediate close (for clicks, Escape key, outside clicks)
   */
  const closeImmediate = useCallback(() => {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    setOpenIndex(null);
  }, [hoverTimer]);

  /**
   * Toggle specific menu (for click interactions)
   */
  const toggle = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  /**
   * Global Escape key handler
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImmediate();
      }
    };

    if (openIndex !== null) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openIndex, closeImmediate]);

  /**
   * Cleanup timers on unmount
   */
  useEffect(() => {
    return () => {
      if (hoverTimer) window.clearTimeout(hoverTimer);
    };
  }, [hoverTimer]);

  return {
    openIndex,
    isOpen: (index: number) => openIndex === index,
    openWithIntent,
    closeWithGrace,
    cancelTimers,
    closeImmediate,
    toggle,
  };
}
