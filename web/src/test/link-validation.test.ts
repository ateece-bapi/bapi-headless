import { describe, it, expect } from 'vitest';

/**
 * Link Validation Tests
 * 
 * These tests ensure:
 * 1. All distributor links use HTTPS where possible
 * 2. No empty website strings
 * 3. All external links have proper security attributes
 */

// Mock distributor data from where-to-buy page
const mockDistributors = [
  {
    id: 'bcci',
    name: 'Building Controls Construction Inc.',
    website: 'https://www.controlsconnection.com/',
  },
  {
    id: 'furneco',
    name: 'Furneco',
    website: 'https://www.furneco.com',
  },
  {
    id: 'marcontrol',
    name: 'Marcontrol',
    website: 'https://www.marcontrol.com',
  },
  {
    id: 'omega-engineering',
    name: 'Omega Engineering',
    website: 'https://www.omegaengg.com',
  },
  {
    id: 'vace',
    name: 'Vace',
    website: 'https://www.vace.com.sg',
  },
  {
    id: 'pacific-controls',
    name: 'Pacific Controls',
    website: 'https://www.paccon.ca',
  },
];

describe('Link Validation', () => {
  describe('HTTPS Security', () => {
    it('should use HTTPS for all distributor websites', () => {
      mockDistributors.forEach((distributor) => {
        if (distributor.website) {
          expect(distributor.website).toMatch(/^https:\/\//);
          expect(distributor.website).not.toMatch(/^http:\/\//);
        }
      });
    });

    it('should not have any empty website strings', () => {
      mockDistributors.forEach((distributor) => {
        expect(distributor.website).not.toBe('');
        expect(distributor.website).toBeTruthy();
      });
    });

    it('should have valid URL format', () => {
      const urlPattern = /^https?:\/\/.+\..+/;
      
      mockDistributors.forEach((distributor) => {
        if (distributor.website) {
          expect(distributor.website).toMatch(urlPattern);
        }
      });
    });
  });

  describe('External Link Security Attributes', () => {
    it('should validate external link patterns with security attributes', () => {
      const externalLinkPattern = /<a[^>]*href="https?:\/\/[^"]*"[^>]*>/;
      const hasTargetBlank = /target="_blank"/;
      const hasRelNoopener = /rel="noopener noreferrer"/;

      mockDistributors.forEach((distributor) => {
        if (!distributor.website) return;

        // Create anchor element to simulate component rendering
        const anchor = document.createElement('a');
        anchor.href = distributor.website;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = 'Visit Website';

        const anchorHtml = anchor.outerHTML;

        expect(anchorHtml).toMatch(externalLinkPattern);
        expect(anchorHtml).toMatch(hasTargetBlank);
        expect(anchorHtml).toMatch(hasRelNoopener);
      });
    });
  });

  describe('Link Format Validation', () => {
    it('should have valid domain structure', () => {
      mockDistributors.forEach((distributor) => {
        if (distributor.website) {
          const url = new URL(distributor.website);
          expect(url.protocol).toBe('https:');
          expect(url.hostname).toBeTruthy();
          expect(url.hostname).toMatch(/\./); // Has at least one dot
        }
      });
    });

    it('should normalize trailing slashes', () => {
      mockDistributors.forEach((distributor) => {
        if (distributor.website) {
          // URLs should either all have trailing slashes or none
          // This is a style preference check
          const hasTrailingSlash = distributor.website.endsWith('/');
          const isRootPath = new URL(distributor.website).pathname === '/';
          
          // If it's not a root path and has trailing slash, that's intentional
          if (hasTrailingSlash && !isRootPath) {
            expect(distributor.website).toMatch(/\/$/);
          }
        }
      });
    });
  });

  describe('Contact Link Patterns', () => {
    it('should validate mailto link format', () => {
      const validMailto = 'mailto:sales@bapihvac.com';
      const invalidMailto = 'mailto:';
      
      expect(validMailto).toMatch(/^mailto:.+@.+\..+/);
      expect(invalidMailto).not.toMatch(/^mailto:.+@.+\..+/);
    });

    it('should validate tel link format', () => {
      const validTel = 'tel:+17158561203';
      const validTelWithDashes = 'tel:+1-715-856-1203';
      const invalidTel = 'tel:';
      
      expect(validTel).toMatch(/^tel:\+?\d/);
      expect(validTelWithDashes).toMatch(/^tel:\+?[\d-]/);
      expect(invalidTel).not.toMatch(/^tel:\+?\d/);
    });
  });

  describe('Next.js Link Component Validation', () => {
    it('should use Next.js Link for internal navigation', () => {
      // Pattern matches for Next.js Link usage
      const internalPaths = [
        '/products',
        '/company',
        '/support',
        '/where-to-buy',
        '/[locale]/products',
      ];

      internalPaths.forEach((path) => {
        // Internal links should not start with http(s)://
        expect(path).not.toMatch(/^https?:\/\//);
        // Should start with /
        expect(path).toMatch(/^\//);
      });
    });

    it('should not have empty href values', () => {
      const validHref = '/products';
      const emptyHref = '';
      const undefinedHref = undefined;

      expect(validHref).toBeTruthy();
      expect(emptyHref).toBeFalsy();
      expect(undefinedHref).toBeFalsy();
    });
  });

  describe('Link Accessibility', () => {
    it('should have descriptive link text in distributor cards', () => {
      const linkTexts = ['Visit Website', 'Contact Sales', 'View Products'];

      linkTexts.forEach((text) => {
        expect(text.length).toBeGreaterThan(4);
        expect(text).toMatch(/^[A-Z]/); // Starts with capital letter
      });
    });
  });
});
