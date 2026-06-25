/**
 * Tests for ICS (iCalendar) file generator
 * @module lib/utils/__tests__/icsGenerator
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateICS, downloadICS } from '../icsGenerator';
import type { TradeShow } from '@/lib/data/tradeShows';

// Remove RFC 5545 CRLF line-folding continuations so assertions work on logical lines
function unfold(ics: string): string {
  return ics.replace(/\r\n /g, '');
}

// Minimal valid trade show fixture
const baseShow: TradeShow = {
  id: 'test-show-2026',
  title: 'Test Show 2026',
  startDate: '2026-09-15',
  endDate: '2026-09-17',
  location: {
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    venue: 'McCormick Place',
  },
  description: 'A test trade show event.',
};

// -------------------------------------------------------------------------
// generateICS
// -------------------------------------------------------------------------
describe('generateICS', () => {
  it('returns null when startDate is empty string', () => {
    expect(generateICS({ ...baseShow, startDate: '' })).toBeNull();
  });

  it('returns a string for a valid show', () => {
    const result = generateICS(baseShow);
    expect(typeof result).toBe('string');
  });

  it('contains required iCalendar structure', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('CALSCALE:GREGORIAN');
    expect(result).toContain('METHOD:PUBLISH');
    expect(result).toContain('BEGIN:VEVENT');
    expect(result).toContain('END:VEVENT');
    expect(result).toContain('END:VCALENDAR');
  });

  it('contains BAPI PRODID', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('PRODID:-//BAPI//Trade Shows Calendar//EN');
  });

  it('contains DTSTART in YYYYMMDDTHHMMSSZ format', () => {
    const result = generateICS(baseShow)!;
    expect(result).toMatch(/DTSTART:\d{8}T\d{6}Z/);
  });

  it('contains DTEND in YYYYMMDDTHHMMSSZ format', () => {
    const result = generateICS(baseShow)!;
    expect(result).toMatch(/DTEND:\d{8}T\d{6}Z/);
  });

  it('uses startDate as endDate fallback when endDate is undefined', () => {
    const show = { ...baseShow, endDate: undefined as unknown as string };
    const result = generateICS(show);
    expect(result).not.toBeNull();
    expect(result).toMatch(/DTEND:\d{8}T\d{6}Z/);
  });

  it('puts the event title in SUMMARY', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('SUMMARY:Test Show 2026');
  });

  it('includes city, venue, and country in LOCATION', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('Chicago');
    expect(result).toContain('McCormick Place');
    expect(result).toContain('USA');
  });

  it('includes state in LOCATION when provided', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('IL');
  });

  it('omits undefined values from LOCATION', () => {
    const show: TradeShow = {
      ...baseShow,
      location: { city: 'London', country: 'UK' },
    };
    const result = generateICS(show)!;
    expect(result).not.toContain('undefined');
  });

  it('appends booth to DESCRIPTION when provided', () => {
    // Commas are escaped in iCalendar text per RFC 5545
    const show: TradeShow = { ...baseShow, booth: 'Hall A, Booth 100' };
    const result = generateICS(show)!;
    expect(result).toContain('Booth: Hall A\\, Booth 100');
  });

  it('appends contact name and email to DESCRIPTION when provided', () => {
    const show: TradeShow = {
      ...baseShow,
      contact: { name: 'Jane Doe', email: 'jane@bapi.com' },
    };
    // Unfold CRLF continuations before asserting - long lines get folded at 75 chars
    const unfolded = unfold(generateICS(show)!);
    expect(unfolded).toContain('Contact: Jane Doe');
    expect(unfolded).toContain('Email: jane@bapi.com');
  });

  it('appends contact phone to DESCRIPTION when provided', () => {
    const show: TradeShow = {
      ...baseShow,
      contact: { name: 'Jane Doe', email: 'jane@bapi.com', phone: '+1-555-0001' },
    };
    const result = generateICS(show)!;
    expect(result).toContain('Phone: +1-555-0001');
  });

  it('appends registration URL to DESCRIPTION when provided', () => {
    const show: TradeShow = { ...baseShow, registrationUrl: 'https://example.com/register' };
    // Unfold CRLF continuations before asserting - long URLs get folded at 75 chars
    expect(unfold(generateICS(show)!)).toContain('Register: https://example.com/register');
  });

  it('includes URL field when registrationUrl is provided', () => {
    const show: TradeShow = { ...baseShow, registrationUrl: 'https://example.com/register' };
    const result = generateICS(show)!;
    expect(result).toContain('\r\nURL:https://example.com/register\r\n');
  });

  it('omits URL field when registrationUrl is not provided', () => {
    const result = generateICS(baseShow)!;
    expect(result).not.toMatch(/\r\nURL:/);
  });

  it('generates UID with @bapihvac.com domain', () => {
    const result = generateICS(baseShow)!;
    expect(result).toMatch(/UID:.+@bapihvac\.com/);
  });

  it('generates a stable UID (same result on repeated calls)', () => {
    const uid1 = generateICS(baseShow)!.match(/UID:([^\r\n]+)/)?.[1];
    const uid2 = generateICS(baseShow)!.match(/UID:([^\r\n]+)/)?.[1];
    expect(uid1).toBe(uid2);
  });

  it('generates different UIDs for different events', () => {
    const show2: TradeShow = { ...baseShow, title: 'Other Show', id: 'other-show' };
    const uid1 = generateICS(baseShow)!.match(/UID:([^\r\n]+)/)?.[1];
    const uid2 = generateICS(show2)!.match(/UID:([^\r\n]+)/)?.[1];
    expect(uid1).not.toBe(uid2);
  });

  it('escapes commas in iCalendar text (RFC 5545)', () => {
    const show: TradeShow = { ...baseShow, title: 'Show, Part Two' };
    const result = generateICS(show)!;
    expect(result).toContain('SUMMARY:Show\\, Part Two');
  });

  it('escapes semicolons in iCalendar text (RFC 5545)', () => {
    const show: TradeShow = { ...baseShow, description: 'Room A; Hall B' };
    const result = generateICS(show)!;
    expect(result).toContain('Room A\\; Hall B');
  });

  it('escapes backslashes in iCalendar text (RFC 5545)', () => {
    const show: TradeShow = { ...baseShow, description: 'Path: C:\\Windows' };
    const result = generateICS(show)!;
    expect(result).toContain('C:\\\\Windows');
  });

  it('folds lines exceeding 75 characters (RFC 5545)', () => {
    const show: TradeShow = { ...baseShow, title: 'A'.repeat(100) };
    const result = generateICS(show)!;
    for (const line of result.split('\r\n')) {
      expect(line.length).toBeLessThanOrEqual(75);
    }
  });

  it('uses CRLF line endings throughout', () => {
    const result = generateICS(baseShow)!;
    expect(result).toContain('\r\n');
    // After removing all CRLF pairs, no bare LF should remain
    expect(result.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('contains STATUS:CONFIRMED', () => {
    expect(generateICS(baseShow)).toContain('STATUS:CONFIRMED');
  });

  it('contains ORGANIZER with info@bapihvac.com', () => {
    expect(generateICS(baseShow)).toContain('info@bapihvac.com');
  });
});

// -------------------------------------------------------------------------
// downloadICS (DOM-dependent, mocked)
// -------------------------------------------------------------------------
describe('downloadICS', () => {
  let origCreateObjectURL: typeof URL.createObjectURL;
  let origRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    origCreateObjectURL = URL.createObjectURL;
    origRevokeObjectURL = URL.revokeObjectURL;
    // jsdom does not implement these; assign mocks directly
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it('calls URL.createObjectURL with a Blob', () => {
    downloadICS(baseShow);
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    const arg = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(arg).toBeInstanceOf(Blob);
  });

  it('calls URL.revokeObjectURL to release the object URL after download', () => {
    downloadICS(baseShow);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets correct .ics download filename on the anchor element', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    downloadICS(baseShow);
    const link = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(link.download).toBe('test-show-2026.ics');
    appendSpy.mockRestore();
  });

  it('warns and skips download when show has no startDate', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const show: TradeShow = { ...baseShow, startDate: '' };
    downloadICS(show);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no valid dates'));
    warnSpy.mockRestore();
  });
});
