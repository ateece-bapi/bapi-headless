/**
 * WordPress Content Fetching
 * Helper functions to fetch pages and posts from WordPress via GraphQL
 */

import { getGraphQLClient } from './graphql/client';
import {
  GetPageBySlugDocument,
  GetContactRepBioDocument,
  GetPagesDocument,
  GetPostsDocument,
  GetPostBySlugDocument,
  GetPostCategoriesDocument,
} from './graphql/generated';
import logger from './logger';

export interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage?: string;
}

export interface ContactRepBio {
  title: string;
  bioParagraphs: string[];
  wpFeaturedImage?: string;
  modified: string;
}

/**
 * Fetch bio content for a sales rep's individual contact page.
 * Bio is stored in the ACF "Contact Rep Profile" field group (bio textarea).
 * The WordPress slug follows the pattern "contact-{rep-slug}".
 */
export async function getContactRepBio(repSlug: string): Promise<ContactRepBio | null> {
  const wpSlug = `contact-${repSlug}`;
  try {
    const client = getGraphQLClient(['contact-pages', `contact-${repSlug}`], true);
    const data = await client.request(GetContactRepBioDocument, { slug: wpSlug });

    if (!data?.page) {
      return null;
    }

    const { title, modified, featuredImage } = data.page;
    const rawBio: string = data.page.contactRepProfile?.bio ?? '';

    // Split on double newlines (paragraph breaks) to produce discrete paragraphs.
    // ACF Textarea "Automatically add paragraphs" setting inserts \n\n between blocks.
    const bioParagraphs = rawBio
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, ' ').trim())
      .filter((p) => p.length > 0);

    return {
      title: title || '',
      bioParagraphs,
      wpFeaturedImage: featuredImage?.node?.sourceUrl ?? undefined,
      modified: modified || '',
    };
  } catch (error) {
    logger.warn('Contact rep bio fetch failed', { repSlug, error });
    return null;
  }
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  author?: {
    name: string;
    avatar?: string;
  };
  categories?: Array<{ name: string; slug: string }>;
  tags?: Array<{ name: string; slug: string }>;
  featuredImage?: string;
}

/**
 * Fetch a WordPress page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    // Use cached GET client for ISR/CDN caching
    const client = getGraphQLClient(['pages', `page-${slug}`], true);
    const data = await client.request(GetPageBySlugDocument, { slug });

    if (!data?.page) {
      return null;
    }

    const page = data.page;

    return {
      id: page.id,
      title: page.title || '',
      content: page.content || '',
      slug: page.slug || '',
      date: page.date || '',
      modified: page.modified || '',
      featuredImage: page.featuredImage?.node?.sourceUrl,
    };
  } catch (error) {
    logger.warn('WordPress page fetch failed', { slug, error });
    return null;
  }
}

/**
 * Fetch all WordPress pages
 */
export async function getPages(first = 100): Promise<Page[]> {
  try {
    // Use cached GET client for ISR/CDN caching
    const client = getGraphQLClient(['pages'], true);
    const data = await client.request(GetPagesDocument, { first });

    if (!data?.pages?.nodes) {
      return [];
    }

    return data.pages.nodes.map((page: any) => ({
      id: page.id,
      title: page.title || '',
      content: '',
      slug: page.slug || '',
      date: page.date || '',
      modified: page.modified || '',
      featuredImage: page.featuredImage?.node?.sourceUrl,
    }));
  } catch (error) {
    logger.warn('WordPress unavailable, returning empty pages array', { error });
    return [];
  }
}

/**
 * Fetch WordPress posts
 */
export interface PostsResult {
  posts: Post[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export async function getPosts(
  options: { perPage?: number; after?: string } = {}
): Promise<PostsResult> {
  try {
    const { perPage = 20, after } = options;
    // Use cached GET client for ISR/CDN caching
    const client = getGraphQLClient(['posts'], true);
    const data = await client.request(GetPostsDocument, {
      first: perPage,
      after: after || null,
    });

    if (!data?.posts?.nodes) {
      return {
        posts: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      posts: data.posts.nodes.map((post: any) => ({
        id: post.id,
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        slug: post.slug || '',
        date: post.date || '',
        modified: post.modified || '',
        author: post.author?.node
          ? {
              name: post.author.node.name || '',
            }
          : undefined,
        categories: post.categories?.nodes?.map((cat: any) => ({
          name: cat.name || '',
          slug: cat.slug || '',
        })),
        featuredImage: post.featuredImage?.node?.sourceUrl,
      })),
      pageInfo: {
        hasNextPage: data.posts.pageInfo?.hasNextPage || false,
        endCursor: data.posts.pageInfo?.endCursor || null,
      },
    };
  } catch (error) {
    // Use warn instead of error during build time - WordPress backend might be unavailable
    // Returning empty array is acceptable fallback behavior
    logger.warn('WordPress unavailable, returning empty posts array', { error });
    return {
      posts: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

/**
 * Fetch a WordPress post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Use cached GET client for ISR/CDN caching
    const client = getGraphQLClient(['posts', `post-${slug}`], true);
    const data = await client.request(GetPostBySlugDocument, { slug });

    if (!data?.post) {
      return null;
    }

    const post = data.post;

    return {
      id: post.id,
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      slug: post.slug || '',
      date: post.date || '',
      modified: post.modified || '',
      author: post.author?.node
        ? {
            name: post.author.node.name || '',
            avatar: post.author.node.avatar?.url,
          }
        : undefined,
      categories: post.categories?.nodes?.map((cat: any) => ({
        name: cat.name || '',
        slug: cat.slug || '',
      })),
      tags: post.tags?.nodes?.map((tag: any) => ({
        name: tag.name || '',
        slug: tag.slug || '',
      })),
      featuredImage: post.featuredImage?.node?.sourceUrl,
    };
  } catch (error) {
    logger.warn('WordPress post fetch failed', { slug, error });
    return null;
  }
}

/**
 * Fetch WordPress post categories
 */
export async function getPostCategories(): Promise<
  { id: string; name: string; slug: string; count: number }[]
> {
  try {
    const client = getGraphQLClient(['categories'], true);
    const data = await client.request(GetPostCategoriesDocument);

    if (!data?.categories?.nodes) {
      return [];
    }

    return data.categories.nodes.map((cat: any) => ({
      id: cat.id || '',
      name: cat.name || '',
      slug: cat.slug || '',
      count: cat.count || 0,
    }));
  } catch (error) {
    logger.warn('WordPress categories fetch failed', { error });
    return [];
  }
}
