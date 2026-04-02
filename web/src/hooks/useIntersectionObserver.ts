'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  onIntersect?: () => void;
  triggerOnce?: boolean;
}

/**
 * Hook for Intersection Observer API
 *
 * Observes when an element enters the viewport
 * Useful for lazy loading, animations, analytics
 *
 * @param options - IntersectionObserver options
 * @returns ref to attach to element and isVisible state
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useIntersectionObserver();
 *
 * <div ref={ref}>
 *   {isVisible && <ExpensiveComponent />}
 * </div>
 * ```
 *
 * @example With analytics callback
 * ```tsx
 * const { ref } = useIntersectionObserver({
 *   onIntersect: () => trackCardView(),
 *   triggerOnce: true,
 * });
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    rootMargin = '50px',
    freezeOnceVisible = false,
    onIntersect,
    triggerOnce = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);
  const hasTriggered = useRef(false);
  
  // Store onIntersect in a ref to avoid recreating observer on callback changes
  const onIntersectRef = useRef(onIntersect);
  
  // Update ref when callback changes (separate effect to avoid observer recreation)
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already visible and freeze enabled, don't observe
    if (freezeOnceVisible && isVisible) return;

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // Call onIntersect callback when element becomes visible (use ref for latest callback)
        if (isIntersecting && onIntersectRef.current) {
          if (!triggerOnce || !hasTriggered.current) {
            onIntersectRef.current();
            hasTriggered.current = true;
          }
        }

        // If freeze enabled and now visible, disconnect
        if (freezeOnceVisible && isIntersecting && element) {
          observer.unobserve(element);
        }

        // If triggerOnce enabled and now visible, disconnect
        if (triggerOnce && isIntersecting && element) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, freezeOnceVisible, isVisible, triggerOnce]);

  return { ref, isVisible };
}
