import { getGraphQLClient } from '@/lib/graphql/client';
import logger from '@/lib/logger';

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

const wordpressGraphQLEndpoint =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, codePoint: string) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([\da-f]+);/gi, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16))
    )
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#039;/gi, "'")
    .replace(/&hellip;/gi, '…');
}

export function getServiceBulletinPlainText(value?: string | null): string {
  if (!value) return '';

  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeServiceBulletinContent(value?: string | null): string {
  if (!value) return '';

  const wordpressOrigin = new URL(wordpressGraphQLEndpoint).origin;
  return value.replace(
    /https?:\/\/(?:www\.)?bapihvac\.com\/wp-content\/uploads/gi,
    `${wordpressOrigin}/wp-content/uploads`
  );
}

function normalizeServiceBulletin(bulletin: ServiceBulletin): ServiceBulletin {
  return {
    ...bulletin,
    content: normalizeServiceBulletinContent(bulletin.content),
  };
}

interface ServiceBulletinsResponse {
  serviceBulletins?: {
    nodes?: ServiceBulletin[] | null;
  } | null;
}

interface ServiceBulletinResponse {
  serviceBulletin?: ServiceBulletin | null;
}

const serviceBulletinsQuery = `
  query GetServiceBulletinsV2($first: Int = 100) {
    serviceBulletins(
      first: $first
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        slug
        date
        modified
        excerpt
        serviceBulletinCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

const serviceBulletinBySlugQuery = `
  query GetServiceBulletinBySlug($slug: ID!) {
    serviceBulletin(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      excerpt
      content
      serviceBulletinCategories {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;

export async function getServiceBulletins(): Promise<ServiceBulletin[]> {
  try {
    const client = getGraphQLClient(['service-bulletins']);
    const data = await client.request<ServiceBulletinsResponse>(serviceBulletinsQuery, {
      first: 100,
    });

    return (data.serviceBulletins?.nodes ?? [])
      .filter((bulletin): bulletin is ServiceBulletin =>
        Boolean(bulletin?.id && bulletin?.title && bulletin?.slug && bulletin?.date)
      )
      .map(normalizeServiceBulletin);
  } catch (error) {
    logger.error('Error fetching service bulletins', error);
    return [];
  }
}

export async function getServiceBulletinBySlug(slug: string): Promise<ServiceBulletin | null> {
  try {
    const client = getGraphQLClient(['service-bulletins', `service-bulletin-${slug}`]);
    const data = await client.request<ServiceBulletinResponse>(serviceBulletinBySlugQuery, {
      slug,
    });

    return data.serviceBulletin ? normalizeServiceBulletin(data.serviceBulletin) : null;
  } catch (error) {
    logger.error('Error fetching service bulletin', error);
    return null;
  }
}
