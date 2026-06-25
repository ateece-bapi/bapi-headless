/**
 * Tests for Schema.org JSON-LD structured data generators
 * @module lib/schema/__tests__/generators
 */

import { describe, it, expect } from 'vitest';
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebSiteSchema,
  schemaToJsonLd,
} from '../generators';

const SITE_URL = 'https://www.bapihvac.com';

// -------------------------------------------------------------------------
// generateOrganizationSchema
// -------------------------------------------------------------------------
describe('generateOrganizationSchema', () => {
  it('returns correct @context and @type', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
  });

  it('sets name and alternateName', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(schema.name).toBe('Building Automation Products Inc.');
    expect(schema.alternateName).toBe('BAPI');
  });

  it('uses the provided siteUrl as url', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(schema.url).toBe(SITE_URL);
  });

  it('sets logo URL derived from siteUrl', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(schema.logo).toContain(SITE_URL);
    expect(schema.logo).toContain('bapi_logo');
  });

  it('includes PostalAddress with required fields', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(schema.address?.['@type']).toBe('PostalAddress');
    expect(schema.address?.addressLocality).toBe('Gays Mills');
    expect(schema.address?.addressRegion).toBe('WI');
    expect(schema.address?.addressCountry).toBe('US');
    expect(schema.address?.postalCode).toBeTruthy();
  });

  it('includes at least one ContactPoint', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(Array.isArray(schema.contactPoint)).toBe(true);
    expect(schema.contactPoint!.length).toBeGreaterThan(0);
    expect(schema.contactPoint![0]['@type']).toBe('ContactPoint');
    expect(schema.contactPoint![0].telephone).toBeTruthy();
  });

  it('includes LinkedIn in sameAs social links', () => {
    const schema = generateOrganizationSchema(SITE_URL);
    expect(Array.isArray(schema.sameAs)).toBe(true);
    expect(schema.sameAs?.some((url) => url.includes('linkedin'))).toBe(true);
  });

  it('sets foundingDate to 1984', () => {
    expect(generateOrganizationSchema(SITE_URL).foundingDate).toBe('1984');
  });

  it('includes a description', () => {
    expect(generateOrganizationSchema(SITE_URL).description).toBeTruthy();
  });
});

// -------------------------------------------------------------------------
// generateProductSchema
// -------------------------------------------------------------------------
describe('generateProductSchema', () => {
  const product = {
    name: 'Temperature Sensor',
    sku: 'BA/10K-3',
    partNumber: 'BA10K3',
    description: 'Precision room temperature sensor',
    image: 'https://cms.bapi.com/product.jpg',
    price: 45,
    inStock: true,
    category: 'Room Sensors',
  };
  const productUrl = `${SITE_URL}/products/ba-10k-3`;

  it('returns correct @context and @type', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Product');
  });

  it('sets name and sku', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.name).toBe('Temperature Sensor');
    expect(schema.sku).toBe('BA/10K-3');
  });

  it('sets mpn to partNumber when available', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.mpn).toBe('BA10K3');
  });

  it('falls back mpn to sku when partNumber is absent', () => {
    const { partNumber: _, ...noPartNum } = product;
    const schema = generateProductSchema(noPartNum, productUrl, SITE_URL);
    expect(schema.mpn).toBe('BA/10K-3');
  });

  it('sets brand to BAPI', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.brand['@type']).toBe('Brand');
    expect(schema.brand.name).toBe('BAPI');
  });

  it('sets InStock availability when inStock is true', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.offers?.availability).toBe('https://schema.org/InStock');
  });

  it('sets OutOfStock availability when inStock is false', () => {
    const schema = generateProductSchema({ ...product, inStock: false }, productUrl, SITE_URL);
    expect(schema.offers?.availability).toBe('https://schema.org/OutOfStock');
  });

  it('sets offer price and currency', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.offers?.price).toBe(45);
    expect(schema.offers?.priceCurrency).toBe('USD');
  });

  it('prefers salePrice over regularPrice and price', () => {
    const withSale = { ...product, salePrice: 35, regularPrice: 45 };
    const schema = generateProductSchema(withSale, productUrl, SITE_URL);
    expect(schema.offers?.price).toBe(35);
  });

  it('sets priceValidUntil as a future YYYY-MM-DD date', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.offers?.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(schema.offers!.priceValidUntil!).getTime()).toBeGreaterThan(Date.now());
  });

  it('uses provided image URL', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    // image is stored as an array
    const images = schema.image as string[];
    expect(images).toContain('https://cms.bapi.com/product.jpg');
  });

  it('uses placeholder image when no image provided', () => {
    const { image: _, ...noImage } = product;
    const schema = generateProductSchema(noImage, productUrl, SITE_URL);
    const firstImage = Array.isArray(schema.image) ? schema.image[0] : schema.image;
    expect(firstImage).toContain('placeholder');
  });

  it('includes offer URL equal to productUrl', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.offers?.url).toBe(productUrl);
  });

  it('sets manufacturer to BAPI organization', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.manufacturer?.['@type']).toBe('Organization');
    expect(schema.manufacturer?.name).toContain('Building Automation Products');
  });

  it('sets itemCondition to NewCondition', () => {
    const schema = generateProductSchema(product, productUrl, SITE_URL);
    expect(schema.offers?.itemCondition).toContain('NewCondition');
  });
});

// -------------------------------------------------------------------------
// generateBreadcrumbSchema
// -------------------------------------------------------------------------
describe('generateBreadcrumbSchema', () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: 'Room Sensors' }, // last item has no url
  ];

  it('returns correct @context and @type', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('creates itemListElement with correct count', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema.itemListElement.length).toBe(3);
  });

  it('sets @type ListItem on each element', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    schema.itemListElement.forEach((el) => expect(el['@type']).toBe('ListItem'));
  });

  it('uses 1-based position numbering', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[2].position).toBe(3);
  });

  it('prepends siteUrl to crumb urls', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema.itemListElement[0].item).toBe(`${SITE_URL}/`);
    expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/products`);
  });

  it('sets item to undefined when crumb has no url (last item)', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema.itemListElement[2].item).toBeUndefined();
  });

  it('returns empty itemListElement for empty breadcrumbs array', () => {
    const schema = generateBreadcrumbSchema([], SITE_URL);
    expect(schema.itemListElement).toEqual([]);
  });

  it('copies name from each breadcrumb', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs, SITE_URL);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[2].name).toBe('Room Sensors');
  });
});

// -------------------------------------------------------------------------
// generateFAQSchema
// -------------------------------------------------------------------------
describe('generateFAQSchema', () => {
  const faqs = [
    { question: 'What is BAPI?', answer: 'A sensor manufacturer.' },
    { question: 'Where are you located?', answer: 'Gays Mills, WI.' },
  ];

  it('returns correct @context and @type', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
  });

  it('creates mainEntity with correct count', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity.length).toBe(2);
  });

  it('sets @type Question on each entity', () => {
    const schema = generateFAQSchema(faqs);
    schema.mainEntity.forEach((q) => expect(q['@type']).toBe('Question'));
  });

  it('maps question name', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].name).toBe('What is BAPI?');
    expect(schema.mainEntity[1].name).toBe('Where are you located?');
  });

  it('maps answer with @type Answer and text', () => {
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('A sensor manufacturer.');
  });

  it('returns empty mainEntity for empty faqs array', () => {
    expect(generateFAQSchema([]).mainEntity).toEqual([]);
  });
});

// -------------------------------------------------------------------------
// generateWebSiteSchema
// -------------------------------------------------------------------------
describe('generateWebSiteSchema', () => {
  it('returns correct @context and @type', () => {
    const schema = generateWebSiteSchema(SITE_URL, 'BAPI');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
  });

  it('sets name and url from arguments', () => {
    const schema = generateWebSiteSchema(SITE_URL, 'BAPI');
    expect(schema.name).toBe('BAPI');
    expect(schema.url).toBe(SITE_URL);
  });

  it('includes a description', () => {
    expect(generateWebSiteSchema(SITE_URL, 'BAPI').description).toBeTruthy();
  });

  it('includes SearchAction as potentialAction', () => {
    const schema = generateWebSiteSchema(SITE_URL, 'BAPI');
    expect(schema.potentialAction?.['@type']).toBe('SearchAction');
    expect(schema.potentialAction?.['query-input']).toContain('search_term_string');
  });

  it('search URL template contains siteUrl and search_term_string placeholder', () => {
    const schema = generateWebSiteSchema(SITE_URL, 'BAPI');
    const urlTemplate = schema.potentialAction?.target?.urlTemplate;
    expect(urlTemplate).toContain(SITE_URL);
    expect(urlTemplate).toContain('{search_term_string}');
  });
});

// -------------------------------------------------------------------------
// schemaToJsonLd
// -------------------------------------------------------------------------
describe('schemaToJsonLd', () => {
  it('returns a valid JSON string', () => {
    const result = schemaToJsonLd({ '@type': 'Organization', name: 'BAPI' });
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('round-trips the schema object correctly', () => {
    const schema = { '@type': 'Organization', name: 'BAPI', foundingDate: '1984' };
    const parsed = JSON.parse(schemaToJsonLd(schema));
    expect(parsed['@type']).toBe('Organization');
    expect(parsed.name).toBe('BAPI');
    expect(parsed.foundingDate).toBe('1984');
  });

  it('produces minified JSON (no extra whitespace)', () => {
    const result = schemaToJsonLd({ a: 1, b: 2 });
    expect(result).toBe('{"a":1,"b":2}');
  });

  it('handles nested objects', () => {
    const schema = { address: { city: 'Gays Mills', state: 'WI' } };
    const parsed = JSON.parse(schemaToJsonLd(schema));
    expect(parsed.address.city).toBe('Gays Mills');
  });

  it('handles arrays', () => {
    const schema = { sameAs: ['https://linkedin.com/bapi', 'https://youtube.com/bapi'] };
    const parsed = JSON.parse(schemaToJsonLd(schema));
    expect(parsed.sameAs).toHaveLength(2);
  });
});
