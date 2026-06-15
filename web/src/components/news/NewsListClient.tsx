'use client';

import { useState, useEffect, useCallback } from 'react';
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
  t: any;
  locale: string;
}

export default function NewsListClient({ initialPosts, t, locale }: NewsListClientProps) {
  const { filters } = useNewsStore();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Filter posts client-side for now (can be moved to server-side GraphQL later)
  const filteredPosts = posts.filter((post) => {
    // Category filter
    if (filters.category && post.categories) {
      if (!post.categories.some((cat) => cat.slug === filters.category)) {
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
          {filters.category || filters.searchQuery ? 'No results found' : t('empty.title')}
        </h2>
        <p className="text-lg text-gray-600">
          {filters.category || filters.searchQuery
            ? 'Try adjusting your filters or search terms'
            : t('empty.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {filteredPosts.map((post, index) => (
        <article
          key={post.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:border-transparent hover:shadow-2xl"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="bg-linear-to-br relative h-56 overflow-hidden from-gray-100 to-gray-200">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index < 3}
              />
              {/* Overlay gradient */}
              <div className="bg-linear-to-t absolute inset-0 from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col p-6">
            {/* Category Badges */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.slug}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(category.name)}`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Meta Info: Date, Author, Read Time */}
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
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
            <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
              <Link href={`/news/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="mb-4 line-clamp-3 flex-1 leading-relaxed text-gray-600">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.slug}
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Read More Link */}
            <Link
              href={`/news/${post.slug}`}
              className="group/link inline-flex items-center gap-2 font-semibold text-primary-600 transition-all duration-300 hover:gap-3"
            >
              <span>{t('readMore')}</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>

          {/* Decorative corner element */}
          <div className="bg-linear-to-br absolute right-0 top-0 h-20 w-20 rounded-bl-full from-primary-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </article>
      ))}
    </div>
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
