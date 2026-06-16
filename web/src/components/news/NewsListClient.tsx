'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import {
  CalendarIcon,
  ArrowRightIcon,
  UserIcon,
  ClockIcon,
  TagIcon,
  NewspaperIcon,
} from '@/lib/icons';
import { calculateReadTime, formatReadTime, getCategoryColor } from '@/lib/utils/readTime';
import { useNewsStore } from '@/store/news';
import { stripHtml } from '@/lib/sanitize';

interface Post {
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
  categories?: {
    name: string;
    slug: string;
  }[];
  tags?: {
    name: string;
    slug: string;
  }[];
  featuredImage?: string;
}

interface NewsListClientProps {
  initialPosts: Post[];
  initialPageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  translations: {
    readMore: string;
    emptyTitle: string;
    emptyDescription: string;
    noResults: string;
    adjustFilters: string;
  };
  locale: string;
}

export default function NewsListClient({ initialPosts, initialPageInfo, translations, locale }: NewsListClientProps) {
  const { filters } = useNewsStore();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMorePosts = async () => {
    if (!pageInfo.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perPage: 12,
          after: pageInfo.endCursor,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filter posts client-side for now (can be moved to server-side GraphQL later)
  const filteredPosts = posts.filter((post) => {
    // Category filter
    if (filters.category) {
      if (!post.categories || !post.categories.some((cat) => cat.slug === filters.category)) {
        return false;
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return <NewsGridSkeleton />;
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <NewspaperIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {filters.category || filters.searchQuery ? translations.noResults : translations.emptyTitle}
        </h2>
        <p className="text-lg text-gray-600">
          {filters.category || filters.searchQuery
            ? translations.adjustFilters
            : translations.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => {
          const articleHref = `/company/news/${post.slug}`;
          
          return (
            <Link
              key={post.id}
              href={articleHref}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
          {/* Featured Image */}
          {post.featuredImage && (
            <>
              <div className="relative h-40 overflow-hidden bg-neutral-50">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 3}
                />
              </div>
              {/* BAPI Yellow Accent Bar */}
              <div className="h-1 w-full bg-accent-500" />
            </>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col px-10 pb-12 pt-10">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.slug}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${getCategoryColor(category.name)}`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Meta Info: Date, Author, Read Time */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              {/* Date */}
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-primary-500" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Author */}
              {post.author && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4 text-primary-500" />
                    <span>{post.author.name}</span>
                  </div>
                </>
              )}

              {/* Read Time */}
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-primary-500" />
                <span>{formatReadTime(calculateReadTime(post.content))}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-600">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="mb-6 line-clamp-3 flex-1 leading-relaxed text-neutral-700">
              {stripHtml(post.excerpt)}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.slug}
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Read More Link */}
            <div className="group/link inline-flex items-center gap-2 font-semibold text-primary-600 transition-all duration-300 hover:gap-3 hover:text-primary-700">
              <span>{translations.readMore}</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </div>
          </div>
        </Link>
        );
      })}
    </div>

    {/* Load More Button */}
    {pageInfo.hasNextPage && !filters.category && !filters.searchQuery && (
      <div className="mt-12 text-center">
        <button
          onClick={fetchMorePosts}
          disabled={isLoadingMore}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingMore ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Loading...
            </>
          ) : (
            <>
              <ArrowRightIcon className="h-5 w-5 rotate-90" />
              Load More Articles
            </>
          )}
        </button>
        <p className="mt-3 text-sm text-neutral-500">
          Showing {posts.length} articles
        </p>
      </div>
    )}
  </>
  );
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
        >
          {/* Image skeleton */}
          <div className="h-56 animate-pulse bg-gray-200" />
          {/* Content skeleton */}
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3 h-6 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mb-4 flex-1 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
