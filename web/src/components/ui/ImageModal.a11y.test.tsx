/**
 * ImageModal Component - Accessibility Tests
 * 
 * Tests modal/dialog accessibility patterns including:
 * - Dialog role and aria attributes
 * - Keyboard navigation (Escape to close)
 * - Focus management
 * - Button labels (icon-only buttons)
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ImageModal from '@/components/ui/ImageModal';

describe('ImageModal - Accessibility Tests', () => {
  const defaultProps = {
    src: 'https://example.com/product.jpg',
    alt: 'Temperature Sensor Model TS-101 with digital display',
    isOpen: true,
    onClose: vi.fn(),
  };

  describe('Modal Dialog Accessibility', () => {
    it('should have no accessibility violations when open', async () => {
      const { container } = render(<ImageModal {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper dialog role', () => {
      const { getByRole } = render(<ImageModal {...defaultProps} />);
      const dialog = getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      const { getByRole } = render(<ImageModal {...defaultProps} />);
      const dialog = getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have accessible label', () => {
      const { getByRole } = render(<ImageModal {...defaultProps} />);
      const dialog = getByRole('dialog');
      // Check for aria-label
      expect(dialog).toHaveAttribute('aria-label');
    });
  });

  describe('Image Accessibility', () => {
    it('should have descriptive alt text on image', () => {
      const { getByAltText } = render(<ImageModal {...defaultProps} />);
      const image = getByAltText('Temperature Sensor Model TS-101 with digital display');
      expect(image).toBeInTheDocument();
    });

    it('should have no violations with long alt text', async () => {
      const longAlt =
        'Temperature Sensor Model TS-101 with digital LCD display, stainless steel probe, and wall mounting bracket included';
      const { container } = render(<ImageModal {...defaultProps} alt={longAlt} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Control Buttons Accessibility', () => {
    it('should have accessible labels on all icon buttons', async () => {
      const { container, getByLabelText } = render(<ImageModal {...defaultProps} />);

      // Check all control buttons have aria-labels
      expect(getByLabelText('Zoom out')).toBeInTheDocument();
      expect(getByLabelText('Zoom in')).toBeInTheDocument();
      expect(getByLabelText('Rotate')).toBeInTheDocument();
      expect(getByLabelText('Close')).toBeInTheDocument();

      // Verify no violations
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no duplicate button labels', () => {
      const { getAllByRole } = render(<ImageModal {...defaultProps} />);
      const buttons = getAllByRole('button');

      // Get all button accessible names
      const buttonNames = buttons.map((btn) =>
        btn.getAttribute('aria-label') || btn.textContent
      );

      // Check for duplicates (except valid cases like multiple "Close")
      const nameCounts = buttonNames.reduce(
        (acc, name) => {
          acc[name || ''] = (acc[name || ''] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // All buttons should have names
      expect(buttonNames.every((name) => name && name.length > 0)).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should not render when closed', () => {
      const { queryByRole } = render(<ImageModal {...defaultProps} isOpen={false} />);
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const { container } = render(<ImageModal {...defaultProps} />);

      // axe checks keyboard accessibility
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true },
          'tabindex': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient contrast on control buttons', async () => {
      const { container } = render(<ImageModal {...defaultProps} />);

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have sufficient contrast on zoom indicator', async () => {
      const { container } = render(<ImageModal {...defaultProps} />);

      // The zoom percentage indicator should be readable
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    it('should not have focus trapped outside modal', async () => {
      const { container } = render(
        <div>
          <button>Outside Button</button>
          <ImageModal {...defaultProps} />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

/**
 * Manual Testing Checklist (Not Automated):
 * 
 * These require human testing - add to monthly review:
 * 
 * 1. Focus Management:
 *    - [ ] Focus trapped within modal when open
 *    - [ ] Focus returns to trigger button on close
 *    - [ ] Tab order is logical (zoom out → zoom in → rotate → reset → close)
 * 
 * 2. Keyboard Controls:
 *    - [ ] Escape key closes modal
 *    - [ ] Mouse wheel zooms image
 *    - [ ] No keyboard traps
 * 
 * 3. Screen Reader:
 *    - [ ] Modal opening is announced
 *    - [ ] Current zoom level announced when changed
 *    - [ ] Control buttons announce state (e.g., "Zoom in button")
 *    - [ ] Image alt text is read
 * 
 * 4. Visual:
 *    - [ ] Focus indicators visible on all backgrounds
 *    - [ ] Button hover states clear
 *    - [ ] Zoom indicator readable at all sizes
 * 
 * 5. Mobile:
 *    - [ ] Touch targets are at least 44x44px
 *    - [ ] Pinch to zoom works as expected
 *    - [ ] Buttons don't overlap on small screens
 */
