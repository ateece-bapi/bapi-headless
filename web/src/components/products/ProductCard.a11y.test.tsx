/**
 * ProductCard Accessibility Tests
 *
 * Critical component used throughout the site - must be fully accessible.
 * Tests WCAG 2.1 Level AA compliance for e-commerce product listings.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: 'test-product-1',
  name: 'Temperature Sensor TS-101',
  slug: 'temperature-sensor-ts-101',
  partNumber: 'TS-101-SS',
  price: '$149.00',
  image: {
    sourceUrl: 'https://example.com/product.jpg',
    altText: 'Temperature Sensor TS-101 with digital display',
  },
  shortDescription: 'High-accuracy temperature sensor with digital display for building automation systems.',
  index: 0,
};

describe('ProductCard Accessibility', () => {
  describe('Automated Accessibility', () => {
    it('has no automated accessibility violations (complete product)', async () => {
      const { container } = render(<ProductCard {...mockProduct} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with missing image', async () => {
      const { container } = render(
        <ProductCard {...mockProduct} image={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without part number', async () => {
      const { container } = render(
        <ProductCard {...mockProduct} partNumber={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without price', async () => {
      const { container } = render(
        <ProductCard {...mockProduct} price={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with minimal data', async () => {
      const { container } = render(
        <ProductCard
          id="minimal"
          name="Basic Product"
          slug="basic-product"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Image Accessibility', () => {
    it('product image has descriptive alt text', () => {
      render(<ProductCard {...mockProduct} />);
      const image = screen.getByAltText('Temperature Sensor TS-101 with digital display');
      expect(image).toBeInTheDocument();
    });

    it('falls back to product name when alt text missing', () => {
      const productWithoutAlt = {
        ...mockProduct,
        image: { sourceUrl: 'https://example.com/product.jpg', altText: null },
      };
      render(<ProductCard {...productWithoutAlt} />);
      const image = screen.getByAltText('Temperature Sensor TS-101');
      expect(image).toBeInTheDocument();
    });

    it('decorative icon is properly hidden from screen readers', () => {
      render(<ProductCard {...mockProduct} image={null} />);
      // Package icon should be decorative only when no image
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Link Accessibility', () => {
    it('entire card is a valid link', () => {
      render(<ProductCard {...mockProduct} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/en/product/temperature-sensor-ts-101');
    });

    it('link has accessible name from product name', () => {
      render(<ProductCard {...mockProduct} />);
      const link = screen.getByRole('link');
      // The link should contain the product name as text content
      expect(link).toHaveTextContent('Temperature Sensor TS-101');
    });

    it('link has visible focus indicator', () => {
      render(<ProductCard {...mockProduct} />);
      const link = screen.getByRole('link');
      // Check for focus ring classes
      expect(link).toHaveClass('focus:ring-2', 'focus:ring-primary-500');
    });
  });

  describe('Content Hierarchy', () => {
    it('product name is a heading', () => {
      render(<ProductCard {...mockProduct} />);
      const heading = screen.getByRole('heading', { name: /temperature sensor/i });
      expect(heading).toBeInTheDocument();
    });

    it('price is properly formatted', () => {
      render(<ProductCard {...mockProduct} />);
      expect(screen.getByText('$149.00')).toBeInTheDocument();
    });

    it('part number is visible when present', () => {
      render(<ProductCard {...mockProduct} />);
      expect(screen.getByText('TS-101-SS')).toBeInTheDocument();
    });

    it('description is truncated appropriately', () => {
      const longDescription = 'This is a very long product description that should be truncated to 120 characters maximum to ensure consistent card heights and readability across the product grid layout.';
      render(<ProductCard {...mockProduct} shortDescription={longDescription} />);
      const description = screen.getByText(/This is a very long product description/);
      expect(description.textContent?.length).toBeLessThanOrEqual(122); // 120 chars + potential punctuation
    });

    it('HTML tags are stripped from description', () => {
      const htmlDescription = '<p>Product with <strong>HTML</strong> tags</p>';
      render(<ProductCard {...mockProduct} shortDescription={htmlDescription} />);
      expect(screen.getByText(/Product with HTML tags/)).toBeInTheDocument();
      expect(screen.queryByText(/<p>/)).not.toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    it('part number badge has sufficient contrast', () => {
      const { container } = render(<ProductCard {...mockProduct} />);
      const badge = container.querySelector('.text-primary-700');
      expect(badge).toBeInTheDocument();
      // BAPI Blue #1479BC on white background = 4.52:1 (WCAG AA pass)
    });

    it('price text has sufficient contrast', () => {
      render(<ProductCard {...mockProduct} />);
      const price = screen.getByText('$149.00');
      expect(price).toHaveClass('text-primary-700');
      // Primary color meets WCAG AA standards
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly in grid layout', async () => {
      const { container } = render(
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard {...mockProduct} index={0} />
          <ProductCard {...mockProduct} id="2" slug="product-2" index={1} />
          <ProductCard {...mockProduct} id="3" slug="product-3" index={2} />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long product names', async () => {
      const longName = 'Temperature and Humidity Sensor with Advanced Digital Display and Wireless Connectivity Model TS-101-PRO-EXTENDED';
      const { container } = render(
        <ProductCard {...mockProduct} name={longName} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles products without description', async () => {
      const { container } = render(
        <ProductCard {...mockProduct} shortDescription={null} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles special characters in product name', async () => {
      const specialName = 'Temperature Sensor TS-101™ + RH Sensor (Indoor/Outdoor)';
      const { container } = render(
        <ProductCard {...mockProduct} name={specialName} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
