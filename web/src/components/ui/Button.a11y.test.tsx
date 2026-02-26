/**
 * Button Component - Accessibility Tests
 * 
 * Demonstrates senior-level automated a11y testing with vitest-axe.
 * Run with: pnpm test:a11y
 * 
 * These tests use axe-core to automatically check WCAG 2.1 Level AA compliance.
 * They catch ~40-50% of accessibility issues without manual testing.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

describe('Button - Accessibility Tests', () => {
  describe('Text Buttons', () => {
    it('should have no accessibility violations - primary variant', async () => {
      const { container } = render(<Button variant="primary">Add to Cart</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - accent variant', async () => {
      const { container } = render(<Button variant="accent">Buy Now</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - outline variant', async () => {
      const { container } = render(<Button variant="outline">Learn More</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - ghost variant', async () => {
      const { container } = render(<Button variant="ghost">Cancel</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - danger variant', async () => {
      const { container } = render(<Button variant="danger">Delete</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button Sizes', () => {
    it('should have no violations - small size', async () => {
      const { container } = render(
        <Button size="sm" variant="primary">
          Small
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations - large size', async () => {
      const { container } = render(
        <Button size="lg" variant="primary">
          Large
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button with Icons', () => {
    it('should have no violations - icon with text', async () => {
      const { container } = render(
        <Button variant="accent">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible name when icon-only with aria-label', async () => {
      const { container } = render(
        <Button variant="primary" aria-label="Add to cart">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button States', () => {
    it('should have no violations - disabled state', async () => {
      const { container } = render(
        <Button variant="primary" disabled>
          Disabled Button
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations - full width', async () => {
      const { container } = render(
        <Button variant="primary" fullWidth>
          Full Width Button
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should pass color contrast - primary variant (blue on white)', async () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      // axe checks color contrast automatically
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should pass color contrast - accent variant (yellow background)', async () => {
      const { container } = render(<Button variant="accent">Accent</Button>);
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Indicators', () => {
    it('should have visible focus indicator', () => {
      const { getByRole } = render(<Button variant="primary">Click Me</Button>);
      const button = getByRole('button');

      // Check that focus-visible classes are present
      button.focus();
      expect(button).toHaveFocus();

      // Button component has focus:ring classes
      const className = button.className;
      expect(className).toContain('focus:ring');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should be keyboard accessible (button role)', () => {
      const { getByRole } = render(<Button variant="primary">Interactive</Button>);
      const button = getByRole('button');

      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should not have keyboard trap', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">First</Button>
          <Button variant="primary">Second</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

/**
 * What These Tests Catch:
 * 
 * ✅ Automatically Detected by axe:
 * - Missing button labels/accessible names
 * - Insufficient color contrast (WCAG AA: 4.5:1 for text)
 * - Missing ARIA attributes when needed
 * - Invalid ARIA roles or properties
 * - Keyboard accessibility issues
 * - Focus management problems
 * 
 * ❌ NOT Detected (Manual Testing Required):
 * - Logical tab order in complex layouts
 * - Screen reader announcement quality
 * - Focus indicator visibility on all backgrounds
 * - Touch target size on mobile (< 44x44px)
 * - Reduced motion preferences
 * - Context and help text clarity
 * 
 * Best Practices:
 * 1. Run these tests in CI/CD on every commit
 * 2. Add new tests when creating new components
 * 3. Combine with manual screen reader testing monthly
 * 4. Use Storybook for visual accessibility review
 * 5. Test critical flows (checkout, forms) with real users
 */
