/**
 * ICS (iCalendar) File Generator
 * @module lib/utils/icsGenerator
 *
 * Generates .ics calendar files for trade show events.
 * Browser-compatible - triggers download via data URI.
 */

import type { TradeShow } from '@/lib/data/tradeShows';

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
 * @param dateString - Date in YYYY-MM-DD format
 * @param time - Time in HH:MM:SS format (default: 09:00:00 for start, 17:00:00 for end)
 * @returns iCalendar formatted date string
 */
function formatICalDate(dateString: string, time = '09:00:00'): string {
  // Parse local date and add time
  const [year, month, day] = dateString.split('-');
  const [hour, minute, second] = time.split(':');
  
  // Create date in local timezone, then convert to UTC
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // Month is 0-indexed
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
  
  // Format as YYYYMMDDTHHMMSSZ (UTC)
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escape special characters for iCalendar format
 * Per RFC 5545: escape commas, semicolons, backslashes, and newlines
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/;/g, '\\;')   // Escape semicolons
    .replace(/,/g, '\\,')   // Escape commas
    .replace(/\n/g, '\\n'); // Escape newlines
}

/**
 * Generate .ics file content for a trade show event
 * @param show - TradeShow object
 * @returns iCalendar formatted string
 */
export function generateICS(show: TradeShow): string {
  const startDate = show.startDate
    ? formatICalDate(show.startDate, '09:00:00')
    : formatICalDate(new Date().toISOString().split('T')[0], '09:00:00');
  
  const endDate = show.endDate
    ? formatICalDate(show.endDate, '17:00:00')
    : formatICalDate(show.startDate || new Date().toISOString().split('T')[0], '17:00:00');

  // Build location string
  const locationParts = [show.location.venue, show.location.city];
  if (show.location.state) locationParts.push(show.location.state);
  locationParts.push(show.location.country);
  const location = escapeICalText(locationParts.filter(Boolean).join(', '));

  // Build description with booth and contact info
  let description = escapeICalText(show.description);
  if (show.booth) {
    description += `\\n\\nBooth: ${escapeICalText(show.booth)}`;
  }
  if (show.contact) {
    description += `\\n\\nContact: ${escapeICalText(show.contact.name)}`;
    description += `\\nEmail: ${escapeICalText(show.contact.email)}`;
    if (show.contact.phone) {
      description += `\\nPhone: ${escapeICalText(show.contact.phone)}`;
    }
  }
  if (show.registrationUrl) {
    description += `\\n\\nRegister: ${escapeICalText(show.registrationUrl)}`;
  }

  // Generate unique ID (use timestamp + title hash)
  const uid = `${show.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}@bapihvac.com`;

  // Build iCalendar file
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BAPI//Trade Shows Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICalDate(new Date().toISOString().split('T')[0])}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeICalText(show.title)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'ORGANIZER;CN=BAPI:mailto:info@bapihvac.com',
    ...(show.registrationUrl ? [`URL:${show.registrationUrl}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Trigger browser download of .ics file
 * @param show - TradeShow object
 */
export function downloadICS(show: TradeShow): void {
  const icsContent = generateICS(show);
  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8',
  });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${show.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
