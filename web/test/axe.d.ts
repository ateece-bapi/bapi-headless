/**
 * Type declarations for vitest-axe
 * Extends Vitest's Assertion interface with axe accessibility matchers
 */

import 'vitest';
import type { AxeResults } from 'axe-core';

declare module 'vitest' {
  interface Assertion<T = any> {
    /**
     * Check for axe accessibility violations
     * @example
     * const results = await axe(container);
     * expect(results).toHaveNoViolations();
     */
    toHaveNoViolations(): void;
  }
  
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
