import { describe, it, expect } from 'vitest';
import {
  getCategoryBreadcrumbs,
  getSubcategoryBreadcrumbs,
  getProductBreadcrumbs,
  getSearchBreadcrumbs,
  breadcrumbsToSchemaOrg,
  type BreadcrumbItem,
  type BreadcrumbOptions,
} from '../breadcrumbs';

describe('Breadcrumb Navigation Utilities', () => {
  describe('getCategoryBreadcrumbs', () => {
    it('generates breadcrumbs for root category (no parent)', () => {
      const result = getCategoryBreadcrumbs('Actuators', 'actuators', {
        locale: 'en',
        includeHome: true,
      });

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Actuators', href: '/en/products/actuators' },
      ]);
    });

    it('generates breadcrumbs without home when includeHome is false', () => {
      const result = getCategoryBreadcrumbs('Actuators', 'actuators', {
        locale: 'en',
        includeHome: false,
      });

      expect(result).toEqual([
        { label: 'Actuators', href: '/en/products/actuators' },
      ]);
    });

    it('supports translated labels', () => {
      const result = getCategoryBreadcrumbs('Aktoren', 'actuators', {
        locale: 'de',
        includeHome: true,
        labels: {
          home: 'Startseite',
          products: 'Produkte',
        },
      });

      expect(result).toEqual([
        { label: 'Startseite', href: '/de' },
        { label: 'Aktoren', href: '/de/products/actuators' },
      ]);
    });

    it('defaults to English labels when no labels provided', () => {
      const result = getCategoryBreadcrumbs('Actuators', 'actuators', {
        locale: 'fr',
        includeHome: true,
      });

      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Actuators');
    });

    it('handles different locales for URL paths', () => {
      const locales = ['en', 'de', 'fr', 'es', 'ja', 'zh'];

      locales.forEach((locale) => {
        const result = getCategoryBreadcrumbs('Actuators', 'actuators', {
          locale,
          includeHome: true,
        });

        expect(result[0].href).toBe(`/${locale}`);
        expect(result[1].href).toBe(`/${locale}/products/actuators`);
      });
    });

    it('handles special characters in category names and slugs', () => {
      const result = getCategoryBreadcrumbs('Sensors & Controls', 'sensors-controls', {
        locale: 'en',
        includeHome: true,
      });

      expect(result[1].label).toBe('Sensors & Controls');
      expect(result[1].href).toBe('/en/products/sensors-controls');
    });

    it('generates breadcrumbs for category with parent (2-level)', () => {
      const result = getCategoryBreadcrumbs(
        'Room',
        'room',
        {
          locale: 'en',
          includeHome: true,
        },
        {
          name: 'Humidity Sensors',
          slug: 'humidity-sensors',
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Humidity Sensors', href: '/en/products/humidity-sensors' },
        { label: 'Room', href: '/en/products/room' },
      ]);
    });

    it('generates breadcrumbs for category with grandparent (3-level)', () => {
      const result = getCategoryBreadcrumbs(
        'BAPI-Stat Quantum',
        'bapi-stat-quantum',
        {
          locale: 'en',
          includeHome: true,
        },
        {
          name: 'Room',
          slug: 'room',
          parent: {
            name: 'Humidity Sensors',
            slug: 'humidity-sensors',
          },
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Humidity Sensors', href: '/en/products/humidity-sensors' },
        { label: 'Room', href: '/en/products/humidity-sensors/room' },
        { label: 'BAPI-Stat Quantum', href: '/en/products/bapi-stat-quantum' },
      ]);
    });
  });

  describe('getSubcategoryBreadcrumbs', () => {
    it('generates breadcrumbs for subcategory (parent is root)', () => {
      const result = getSubcategoryBreadcrumbs(
        'Actuators',
        'actuators',
        'Electric Actuators',
        'electric-actuators',
        {
          locale: 'en',
          includeHome: true,
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Actuators', href: '/en/products/actuators' },
        {
          label: 'Electric Actuators',
          href: '/en/products/actuators/electric-actuators',
        },
      ]);
    });

    it('generates breadcrumbs without home when includeHome is false', () => {
      const result = getSubcategoryBreadcrumbs(
        'Actuators',
        'actuators',
        'Electric Actuators',
        'electric-actuators',
        {
          locale: 'en',
          includeHome: false,
        }
      );

      expect(result).toEqual([
        { label: 'Actuators', href: '/en/products/actuators' },
        {
          label: 'Electric Actuators',
          href: '/en/products/actuators/electric-actuators',
        },
      ]);
    });

    it('supports translated labels', () => {
      const result = getSubcategoryBreadcrumbs(
        'Aktoren',
        'actuators',
        'Elektrische Aktoren',
        'electric-actuators',
        {
          locale: 'de',
          includeHome: true,
          labels: {
            home: 'Startseite',
            products: 'Produkte',
          },
        }
      );

      expect(result[0].label).toBe('Startseite');
      expect(result[1].label).toBe('Aktoren');
      expect(result[2].label).toBe('Elektrische Aktoren');
    });

    it('handles different locales for URL paths', () => {
      const result = getSubcategoryBreadcrumbs(
        'Actuators',
        'actuators',
        'Electric Actuators',
        'electric-actuators',
        {
          locale: 'ja',
          includeHome: true,
        }
      );

      expect(result[0].href).toBe('/ja');
      expect(result[1].href).toBe('/ja/products/actuators');
      expect(result[2].href).toBe('/ja/products/actuators/electric-actuators');
    });

    it('generates breadcrumbs with grandparent (3-level hierarchy)', () => {
      const result = getSubcategoryBreadcrumbs(
        'Room',
        'room',
        'BAPI-Stat Quantum',
        'bapi-stat-quantum',
        {
          locale: 'en',
          includeHome: true,
        },
        {
          name: 'Humidity Sensors',
          slug: 'humidity-sensors',
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Humidity Sensors', href: '/en/products/humidity-sensors' },
        { label: 'Room', href: '/en/products/humidity-sensors/room' },
        { label: 'BAPI-Stat Quantum', href: '/en/products/room/bapi-stat-quantum' },
      ]);
    });
  });

  describe('getProductBreadcrumbs', () => {
    it('generates breadcrumbs for product with parent category', () => {
      const result = getProductBreadcrumbs(
        'LM24A-MF-S',
        'lm24a-mf-s',
        [
          {
            name: 'Electric Actuators',
            slug: 'electric-actuators',
            parent: {
              name: 'Actuators',
              slug: 'actuators',
            },
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Actuators', href: '/en/products/actuators' },
        {
          label: 'Electric Actuators',
          href: '/en/products/actuators/electric-actuators',
        },
        { label: 'LM24A-MF-S' },
      ]);
    });

    it('generates breadcrumbs for product with root category (no parent)', () => {
      const result = getProductBreadcrumbs(
        'Test Product',
        'test-product',
        [
          {
            name: 'Sensors',
            slug: 'sensors',
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Sensors', href: '/en/products/sensors' },
        { label: 'Test Product' },
      ]);
    });

    it('generates breadcrumbs without home when includeHome is false', () => {
      const result = getProductBreadcrumbs(
        'LM24A-MF-S',
        'lm24a-mf-s',
        [
          {
            name: 'Electric Actuators',
            slug: 'electric-actuators',
            parent: {
              name: 'Actuators',
              slug: 'actuators',
            },
          },
        ],
        {
          locale: 'en',
          includeHome: false,
        }
      );

      expect(result).toHaveLength(3);
      expect(result[0].label).toBe('Actuators');
    });

    it('handles product with empty categories array', () => {
      const result = getProductBreadcrumbs('Orphan Product', 'orphan', [], {
        locale: 'en',
        includeHome: true,
      });

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
        { label: 'Orphan Product' },
      ]);
    });

    it('uses first category when multiple categories provided', () => {
      const result = getProductBreadcrumbs(
        'Multi-Category Product',
        'multi-product',
        [
          {
            name: 'Primary Category',
            slug: 'primary',
          },
          {
            name: 'Secondary Category',
            slug: 'secondary',
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      expect(result[1].label).toBe('Primary Category');
      expect(result).not.toContainEqual(expect.objectContaining({ label: 'Secondary Category' }));
    });

    it('product label has no href (current page)', () => {
      const result = getProductBreadcrumbs(
        'Test Product',
        'test',
        [
          {
            name: 'Category',
            slug: 'category',
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      const productCrumb = result[result.length - 1];
      expect(productCrumb.label).toBe('Test Product');
      expect(productCrumb.href).toBeUndefined();
    });

    it('supports translated labels', () => {
      const result = getProductBreadcrumbs(
        'Produit Test',
        'test',
        [
          {
            name: 'Capteurs',
            slug: 'sensors',
          },
        ],
        {
          locale: 'fr',
          includeHome: true,
          labels: {
            home: 'Accueil',
            products: 'Produits',
          },
        }
      );

      expect(result[0].label).toBe('Accueil');
      expect(result[1].label).toBe('Capteurs');
    });

    it('handles different locales for URL paths', () => {
      const result = getProductBreadcrumbs(
        'Product',
        'product',
        [
          {
            name: 'Category',
            slug: 'category',
            parent: {
              name: 'Parent',
              slug: 'parent',
            },
          },
        ],
        {
          locale: 'zh',
          includeHome: true,
        }
      );

      expect(result[0].href).toBe('/zh');
      expect(result[1].href).toBe('/zh/products/parent');
      expect(result[2].href).toBe('/zh/products/parent/category');
    });

    it('generates breadcrumbs with full 3-level category hierarchy', () => {
      const result = getProductBreadcrumbs(
        'BAPI-Stat Quantum Sensor',
        'bapi-stat-quantum-sensor',
        [
          {
            name: 'BAPI-Stat Quantum Series',
            slug: 'bapi-stat-quantum',
            parent: {
              name: 'Room',
              slug: 'room',
              parent: {
                name: 'Humidity Sensors',
                slug: 'humidity-sensors',
              },
            },
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Humidity Sensors', href: '/en/products/humidity-sensors' },
        { label: 'Room', href: '/en/products/humidity-sensors/room' },
        { label: 'BAPI-Stat Quantum Series' }, // No href - deeper than router supports
        { label: 'BAPI-Stat Quantum Sensor' }, // Product - no href
      ]);
    });
  });

  describe('getSearchBreadcrumbs', () => {
    it('generates breadcrumbs for search page with home', () => {
      const result = getSearchBreadcrumbs('actuator', {
        locale: 'en',
        includeHome: true,
      });

      expect(result).toEqual([
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
        { label: 'Search: "actuator"' },
      ]);
    });

    it('generates breadcrumbs without home when includeHome is false', () => {
      const result = getSearchBreadcrumbs('sensor', {
        locale: 'en',
        includeHome: false,
      });

      expect(result).toEqual([
        { label: 'Products', href: '/en/products' },
        { label: 'Search: "sensor"' },
      ]);
    });

    it('supports translated search label', () => {
      const result = getSearchBreadcrumbs('Aktor', {
        locale: 'de',
        includeHome: true,
        labels: {
          home: 'Startseite',
          products: 'Produkte',
          search: 'Suche',
        },
      });

      expect(result[0].label).toBe('Startseite');
      expect(result[1].label).toBe('Produkte');
      expect(result[2].label).toBe('Suche: "Aktor"');
    });

    it('handles empty search query', () => {
      const result = getSearchBreadcrumbs('', {
        locale: 'en',
        includeHome: true,
      });

      expect(result[2].label).toBe('Search: ""');
    });

    it('handles special characters in search query', () => {
      const result = getSearchBreadcrumbs('LM24A-MF & sensors', {
        locale: 'en',
        includeHome: true,
      });

      expect(result[2].label).toBe('Search: "LM24A-MF & sensors"');
    });

    it('search label has no href (current page)', () => {
      const result = getSearchBreadcrumbs('test', {
        locale: 'en',
        includeHome: true,
      });

      const searchCrumb = result[result.length - 1];
      expect(searchCrumb.href).toBeUndefined();
    });

    it('handles different locales for URL paths', () => {
      const locales = ['en', 'de', 'fr', 'es', 'ja', 'zh', 'ar', 'hi', 'th', 'vi', 'pl'];

      locales.forEach((locale) => {
        const result = getSearchBreadcrumbs('test', {
          locale,
          includeHome: true,
        });

        expect(result[0].href).toBe(`/${locale}`);
        expect(result[1].href).toBe(`/${locale}/products`);
      });
    });
  });

  describe('breadcrumbsToSchemaOrg', () => {
    it('converts breadcrumbs to valid Schema.org format', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
        { label: 'Actuators', href: '/en/products/actuators' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://bapi.com/en',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: 'https://bapi.com/en/products',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Actuators',
            item: 'https://bapi.com/en/products/actuators',
          },
        ],
      });
    });

    it('filters out breadcrumbs without href (current page)', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
        { label: 'Current Product' }, // No href
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[1].name).toBe('Products');
    });

    it('filters out breadcrumbs with empty href', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '' }, // Empty href
        { label: 'Category', href: '/en/products/test' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Category');
    });

    it('filters out breadcrumbs with whitespace-only href', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Invalid', href: '   ' }, // Whitespace only
        { label: 'Products', href: '/en/products' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Products');
    });

    it('normalizes site URL to prevent double slashes', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Products', href: '/en/products' },
      ];

      const schema = breadcrumbsToSchemaOrg(
        breadcrumbs,
        'https://bapi.com/' // Trailing slash
      );

      expect(schema.itemListElement[0].item).toBe('https://bapi.com/en');
      expect(schema.itemListElement[1].item).toBe('https://bapi.com/en/products');
      expect(schema.itemListElement[0].item).not.toContain('//en');
    });

    it('handles href without leading slash', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: 'en' }, // No leading slash
        { label: 'Products', href: 'en/products' }, // No leading slash
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement[0].item).toBe('https://bapi.com/en');
      expect(schema.itemListElement[1].item).toBe('https://bapi.com/en/products');
    });

    it('maintains correct position numbering after filtering', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Skip1' }, // No href - filtered
        { label: 'Products', href: '/en/products' },
        { label: 'Skip2', href: '' }, // Empty - filtered
        { label: 'Category', href: '/en/products/test' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('handles empty breadcrumbs array', () => {
      const schema = breadcrumbsToSchemaOrg([], 'https://bapi.com');

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [],
      });
    });

    it('handles all breadcrumbs without href', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Item 1' },
        { label: 'Item 2' },
        { label: 'Item 3' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(0);
    });

    it('preserves special characters in breadcrumb names', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/en' },
        { label: 'Sensors & Controls', href: '/en/products/sensors-controls' },
      ];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement[1].name).toBe('Sensors & Controls');
    });

    it('works with different site URLs', () => {
      const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/en' }];

      const urls = [
        'https://bapi.com',
        'https://staging.bapi.com',
        'https://bapi-headless.vercel.app',
        'http://localhost:3000',
      ];

      urls.forEach((url) => {
        const schema = breadcrumbsToSchemaOrg(breadcrumbs, url);
        expect(schema.itemListElement[0].item).toBe(`${url.replace(/\/+$/, '')}/en`);
      });
    });

    it('validates Schema.org required properties', () => {
      const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/en' }];

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      // Check root level properties
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toBeDefined();

      // Check ListItem properties
      const item = schema.itemListElement[0];
      expect(item['@type']).toBe('ListItem');
      expect(item.position).toBeDefined();
      expect(typeof item.position).toBe('number');
      expect(item.name).toBeDefined();
      expect(typeof item.name).toBe('string');
      expect(item.item).toBeDefined();
      expect(typeof item.item).toBe('string');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles extremely long breadcrumb names', () => {
      const longName = 'A'.repeat(500);
      const result = getCategoryBreadcrumbs(longName, 'test', {
        locale: 'en',
        includeHome: true,
      });

      expect(result[1].label).toBe(longName);
      expect(result[1].label.length).toBe(500);
    });

    it('handles Unicode characters in names', () => {
      const result = getCategoryBreadcrumbs('传感器 センサー', 'sensors', {
        locale: 'zh',
        includeHome: true,
      });

      expect(result[1].label).toBe('传感器 センサー');
    });

    it('handles emoji in breadcrumb names', () => {
      const result = getSearchBreadcrumbs('🔧 tools 🛠️', {
        locale: 'en',
        includeHome: true,
      });

      expect(result[2].label).toContain('🔧 tools 🛠️');
    });

    it('handles partial label objects', () => {
      const result = getCategoryBreadcrumbs('Test', 'test', {
        locale: 'en',
        includeHome: true,
        labels: {
          home: 'Custom Home',
          // products and search missing
        },
      });

      expect(result[0].label).toBe('Custom Home');
      expect(result[1].label).toBe('Test'); // Category as root
    });

    it('handles empty labels object', () => {
      const result = getCategoryBreadcrumbs('Test', 'test', {
        locale: 'en',
        includeHome: true,
        labels: {},
      });

      expect(result[0].label).toBe('Home');
      expect(result[1].label).toBe('Test'); // Category as root
    });
  });

  describe('Integration Tests', () => {
    it('category breadcrumbs work with Schema.org conversion', () => {
      const breadcrumbs = getCategoryBreadcrumbs('Actuators', 'actuators', {
        locale: 'en',
        includeHome: true,
      });

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[1].name).toBe('Actuators');
      expect(schema.itemListElement[1].item).toBe('https://bapi.com/en/products/actuators');
    });

    it('product breadcrumbs work with Schema.org conversion', () => {
      const breadcrumbs = getProductBreadcrumbs(
        'LM24A-MF-S',
        'lm24a-mf-s',
        [
          {
            name: 'Electric Actuators',
            slug: 'electric-actuators',
            parent: {
              name: 'Actuators',
              slug: 'actuators',
            },
          },
        ],
        {
          locale: 'en',
          includeHome: true,
        }
      );

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      // Product itself has no href, so only 3 items in schema (Home + Actuators + Electric Actuators)
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[2].name).toBe('Electric Actuators');
    });

    it('search breadcrumbs work with Schema.org conversion', () => {
      const breadcrumbs = getSearchBreadcrumbs('actuator', {
        locale: 'de',
        includeHome: true,
        labels: {
          home: 'Startseite',
          products: 'Produkte',
          search: 'Suche',
        },
      });

      const schema = breadcrumbsToSchemaOrg(breadcrumbs, 'https://bapi.com');

      // Search has no href, so only 2 items in schema
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Startseite');
      expect(schema.itemListElement[1].name).toBe('Produkte');
    });

    it('maintains consistency across all generator functions', () => {
      const locale = 'en';
      const labels = {
        home: 'Home',
        products: 'Products',
        search: 'Search',
      };

      const category = getCategoryBreadcrumbs('Test', 'test', {
        locale,
        includeHome: true,
        labels,
      });
      const subcategory = getSubcategoryBreadcrumbs('Test', 'test', 'Sub', 'sub', {
        locale,
        includeHome: true,
        labels,
      });
      const product = getProductBreadcrumbs('Product', 'product', [], {
        locale,
        includeHome: true,
        labels,
      });
      const search = getSearchBreadcrumbs('query', {
        locale,
        includeHome: true,
        labels,
      });

      // All should have consistent Home breadcrumb
      [category, subcategory, product, search].forEach((crumbs) => {
        expect(crumbs[0]).toEqual({ label: 'Home', href: '/en' });
      });

      // Only search and orphan product should have generic "Products" link
      expect(product[1]).toEqual({ label: 'Products', href: '/en/products' });
      expect(search[1]).toEqual({ label: 'Products', href: '/en/products' });

      // Category and subcategory show actual category names (not "Products")
      expect(category[1]).toEqual({ label: 'Test', href: '/en/products/test' });
      expect(subcategory[1]).toEqual({ label: 'Test', href: '/en/products/test' });
    });
  });
});
