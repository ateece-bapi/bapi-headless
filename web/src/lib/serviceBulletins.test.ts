import { describe, expect, it } from 'vitest';
import { getServiceBulletinPlainText } from './serviceBulletins';
import { normalizeServiceBulletinContent } from './serviceBulletins.server';

describe('Service Bulletin content normalization', () => {
  it('decodes WordPress numeric and named entities in excerpts', () => {
    expect(
      getServiceBulletinPlainText(
        '<p>BAPI&#8217;s detector uses AC &amp; DC voltage [&hellip;]</p>'
      )
    ).toBe('BAPI’s detector uses AC & DC voltage […]');
  });

  it('decodes entities exactly once', () => {
    expect(getServiceBulletinPlainText('&amp;lt;script&amp;gt;')).toBe('&lt;script&gt;');
  });

  it('rewrites legacy upload URLs to the configured WordPress host', () => {
    const content =
      '<img src="https://www.bapihvac.com/wp-content/uploads/Power_Adaptor_Board_2.png">';

    expect(normalizeServiceBulletinContent(content)).toContain(
      'https://test.example.com/wp-content/uploads/Power_Adaptor_Board_2.png'
    );
    expect(normalizeServiceBulletinContent(content)).not.toContain('www.bapihvac.com');
  });

  it('sanitizes unsafe CMS HTML before rendering', () => {
    const content =
      '<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(2)"><p>Safe</p>';

    expect(normalizeServiceBulletinContent(content)).toBe('<p>Safe</p>');
  });
});
