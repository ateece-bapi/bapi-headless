import { describe, expect, it } from 'vitest';
import { getServiceBulletinPlainText, normalizeServiceBulletinContent } from './serviceBulletins';

describe('Service Bulletin content normalization', () => {
  it('decodes WordPress numeric and named entities in excerpts', () => {
    expect(
      getServiceBulletinPlainText(
        '<p>BAPI&#8217;s detector uses AC &amp; DC voltage [&hellip;]</p>'
      )
    ).toBe('BAPI’s detector uses AC & DC voltage […]');
  });

  it('rewrites legacy upload URLs to the configured WordPress host', () => {
    const content =
      '<img src="https://www.bapihvac.com/wp-content/uploads/Power_Adaptor_Board_2.png">';

    expect(normalizeServiceBulletinContent(content)).toContain(
      'https://test.example.com/wp-content/uploads/Power_Adaptor_Board_2.png'
    );
    expect(normalizeServiceBulletinContent(content)).not.toContain('www.bapihvac.com');
  });
});
