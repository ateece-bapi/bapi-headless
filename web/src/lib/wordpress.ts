/**
 * WordPress Content Fetching
 * Helper functions to fetch pages and posts from WordPress via GraphQL
 */

import { graphqlClient } from './graphql/client';
import { GetPageBySlugDocument, GetPagesDocument, GetPostsDocument, GetPostBySlugDocument } from './graphql/generated';

export interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage?: string;
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
    const data = await graphqlClient.request(GetPageBySlugDocument, { slug });
    
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
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all WordPress pages
 */
export async function getPages(first = 100): Promise<Page[]> {
  try {
    const data = await graphqlClient.request(GetPagesDocument, { first });
    
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
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch WordPress posts
 */
export async function getPosts(options: { perPage?: number; after?: string } = {}): Promise<Post[]> {
  try {
    const { perPage = 20, after } = options;
    const data = await graphqlClient.request(GetPostsDocument, { 
      first: perPage,
      after: after || null,
    });
    
    if (!data?.posts?.nodes) {
      return [];
    }

    return data.posts.nodes.map((post: any) => ({
      id: post.id,
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      slug: post.slug || '',
      date: post.date || '',
      modified: post.modified || '',
      author: post.author?.node ? {
        name: post.author.node.name || '',
      } : undefined,
      categories: post.categories?.nodes?.map((cat: any) => ({
        name: cat.name || '',
        slug: cat.slug || '',
      })),
      featuredImage: post.featuredImage?.node?.sourceUrl,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch a WordPress post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const data = await graphqlClient.request(GetPostBySlugDocument, { slug });
    
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
      author: post.author?.node ? {
        name: post.author.node.name || '',
        avatar: post.author.node.avatar?.url,
      } : undefined,
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
    console.error(`Error fetching post "${slug}":`, error);
    return null;
  }
}
