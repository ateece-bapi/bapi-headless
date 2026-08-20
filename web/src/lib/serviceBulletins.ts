export interface ServiceBulletinCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ServiceBulletin {
  id: string;
  title: string;
  slug: string;
  date: string;
  modified?: string | null;
  excerpt?: string | null;
  content?: string | null;
  serviceBulletinCategories?: {
    nodes: ServiceBulletinCategory[];
  } | null;
}

const HTML_ENTITY_PATTERN = /&(?:#(\d+)|#x([\da-f]+)|nbsp|amp|lt|gt|quot|apos|hellip);/gi;

function decodeHtmlEntities(value: string): string {
  return value.replace(HTML_ENTITY_PATTERN, (entity, decimal: string, hex: string) => {
    if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));

    switch (entity.toLowerCase()) {
      case '&nbsp;':
        return ' ';
      case '&amp;':
        return '&';
      case '&lt;':
        return '<';
      case '&gt;':
        return '>';
      case '&quot;':
        return '"';
      case '&apos;':
        return "'";
      case '&hellip;':
        return '…';
      default:
        return entity;
    }
  });
}

export function getServiceBulletinPlainText(value?: string | null): string {
  if (!value) return '';

  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}
