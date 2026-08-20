import { cache } from 'react';
import {
  GetServiceBulletinBySlugDocument,
  GetServiceBulletinsV3Document,
  type GetServiceBulletinBySlugQuery,
  type GetServiceBulletinsV3Query,
} from '@/lib/graphql/generated';
import { getGraphQLClient } from '@/lib/graphql/client';
import logger from '@/lib/logger';
import { sanitizeWordPressContent } from '@/lib/sanitizeDescription';
import type { ServiceBulletin, ServiceBulletinCategory } from '@/lib/serviceBulletins';

type BulletinNode = NonNullable<
  NonNullable<GetServiceBulletinsV3Query['serviceBulletins']>['nodes'][number]
>;
type BulletinDetailNode = NonNullable<GetServiceBulletinBySlugQuery['serviceBulletin']>;

function getWordPressOrigin(): string {
  const endpoint =
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';
  return new URL(endpoint).origin;
}

export function normalizeServiceBulletinContent(value?: string | null): string {
  if (!value) return '';

  const normalized = value.replace(
    /https?:\/\/(?:www\.)?bapihvac\.com\/wp-content\/uploads/gi,
    `${getWordPressOrigin()}/wp-content/uploads`
  );
  return sanitizeWordPressContent(normalized);
}

function normalizeCategory(
  category: NonNullable<BulletinNode['serviceBulletinCategories']>['nodes'][number]
): ServiceBulletinCategory | null {
  if (!category.name || !category.slug) return null;
  return { id: category.id, name: category.name, slug: category.slug };
}

function normalizeServiceBulletin(
  bulletin: BulletinNode | BulletinDetailNode
): ServiceBulletin | null {
  if (!bulletin.title || !bulletin.slug || !bulletin.date) return null;

  const categories = (bulletin.serviceBulletinCategories?.nodes ?? [])
    .map(normalizeCategory)
    .filter((category): category is ServiceBulletinCategory => category !== null);

  return {
    id: bulletin.id,
    title: bulletin.title,
    slug: bulletin.slug,
    date: bulletin.date,
    modified: bulletin.modified,
    excerpt: bulletin.excerpt,
    content: 'content' in bulletin ? normalizeServiceBulletinContent(bulletin.content) : null,
    serviceBulletinCategories: { nodes: categories },
  };
}

export const getServiceBulletins = cache(async (): Promise<ServiceBulletin[]> => {
  try {
    const client = getGraphQLClient(['service-bulletins']);
    const bulletins: ServiceBulletin[] = [];
    let after: string | null = null;

    do {
      const data: GetServiceBulletinsV3Query = await client.request<GetServiceBulletinsV3Query>(
        GetServiceBulletinsV3Document,
        {
          first: 100,
          after,
        }
      );
      const connection = data.serviceBulletins;

      for (const node of connection?.nodes ?? []) {
        const bulletin = normalizeServiceBulletin(node);
        if (bulletin) bulletins.push(bulletin);
      }

      const nextCursor = connection?.pageInfo.hasNextPage
        ? (connection.pageInfo.endCursor ?? null)
        : null;
      after = nextCursor && nextCursor !== after ? nextCursor : null;
    } while (after);

    return bulletins;
  } catch (error) {
    logger.error('Error fetching service bulletins', error);
    return [];
  }
});

export const getServiceBulletinBySlug = cache(
  async (slug: string): Promise<ServiceBulletin | null> => {
    try {
      const client = getGraphQLClient(['service-bulletins', `service-bulletin-${slug}`]);
      const data = await client.request<GetServiceBulletinBySlugQuery>(
        GetServiceBulletinBySlugDocument,
        { slug }
      );

      return data.serviceBulletin ? normalizeServiceBulletin(data.serviceBulletin) : null;
    } catch (error) {
      logger.error('Error fetching service bulletin', error);
      return null;
    }
  }
);
