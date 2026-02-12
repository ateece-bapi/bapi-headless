'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
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
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0, rootMargin = '50px', freezeOnceVisible = false } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already visible and freeze enabled, don't observe
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // If freeze enabled and now visible, disconnect
        if (freezeOnceVisible && isIntersecting && element) {
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
  }, [threshold, rootMargin, freezeOnceVisible, isVisible]);

  return { ref, isVisible };
}
