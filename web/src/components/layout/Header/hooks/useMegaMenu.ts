'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook to manage mega menu state
 * Based on patterns from bapi-mega-menu repository
 */
export function useMegaMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  /**
   * Detect touch/coarse-pointer devices using capability-based media query.
   * Uses (hover: none) or (pointer: coarse) so that touch-screen laptops and
   * tablets are detected regardless of screen width.
   */
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /**
   * Open menu with intent delay (80ms)
   * Prevents accidental opens when mouse quickly passes through
   */
  const openWithIntent = useCallback((index: number) => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setOpenIndex(index);
      hoverTimerRef.current = null;
    }, 80);
  }, []);

  /**
   * Close menu with grace period (140ms)
   * Allows user to move between trigger and panel without closing
   */
  const closeWithGrace = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setOpenIndex(null);
      hoverTimerRef.current = null;
    }, 140);
  }, []);

  /**
   * Cancel any pending timers
   * Used when user re-enters hover zone
   */
  const cancelTimers = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  /**
   * Immediate close (for clicks, Escape key, outside clicks)
   */
  const closeImmediate = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setOpenIndex(null);
  }, []);

  /**
   * Toggle specific menu (for click interactions)
   */
  const toggle = useCallback((index: number) => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  /**
   * Global Escape key handler
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openIndex !== null) {
        if (hoverTimerRef.current) {
          window.clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
        setOpenIndex(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openIndex]);

  /**
   * Cleanup timers on unmount
   */
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
  }, []);

  return {
    openIndex,
    isOpen: (index: number) => openIndex === index,
    isTouch,
    openWithIntent,
    closeWithGrace,
    cancelTimers,
    closeImmediate,
    toggle,
  };
}
