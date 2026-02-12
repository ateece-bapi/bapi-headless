'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Search,
  Calendar,
  ArrowRight,
  Filter,
  X,
  Grid3x3,
  List,
  SortAsc,
} from 'lucide-react';

interface ApplicationNote {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
}

interface ApplicationNoteListProps {
  applicationNotes: ApplicationNote[];
}

type ViewMode = 'grid' | 'list';
type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(content: string): number {
  const text = stripHtml(content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function ApplicationNoteList({ applicationNotes }: ApplicationNoteListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = applicationNotes;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          stripHtml(note.excerpt).toLowerCase().includes(query) ||
          stripHtml(note.content).toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [applicationNotes, searchQuery, sortBy]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search application notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search application notes"
            className="w-full rounded-lg border border-neutral-300 py-3 pl-12 pr-4 text-neutral-900 transition-shadow placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-neutral-100"
            >
              <X className="h-4 w-4 text-neutral-500" />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Results Count, Sort, View Toggle */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-neutral-600">
            Showing{' '}
            <span className="font-semibold text-neutral-900">{filteredAndSortedNotes.length}</span>{' '}
            of <span className="font-semibold text-neutral-900">{applicationNotes.length}</span>{' '}
            articles
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              <X className="h-4 w-4" />
              Clear search
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">
              Sort articles
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="cursor-pointer appearance-none rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-10 text-sm text-neutral-700 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-neutral-300 p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`rounded p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`rounded p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Application Notes Grid/List */}
      {filteredAndSortedNotes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 py-20 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <BookOpen className="h-10 w-10 text-neutral-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-neutral-900">No articles found</h3>
          <p className="mx-auto mb-6 max-w-md text-neutral-600">
            {searchQuery
              ? `We couldn't find any articles matching "${searchQuery}". Try a different search term.`
              : 'No application notes match your criteria. Try clearing your search.'}
          </p>
          <button
            onClick={clearSearch}
            className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg"
          >
            Clear search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedNotes.map((note) => {
            const readingTime = getReadingTime(note.content);

            return (
              <Link
                key={note.id}
                href={`/application-notes/${note.slug}`}
                className="duration-250 group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-[transform,shadow,border-color] ease-in-out will-change-transform hover:scale-[1.01] hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Consistent Icon Header */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <BookOpen className="duration-250 h-16 w-16 text-primary-600 transition-transform group-hover:scale-110" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {note.title}
                  </h3>

                  {note.excerpt && (
                    <p
                      className="mb-4 line-clamp-3 text-sm text-neutral-600"
                      dangerouslySetInnerHTML={{ __html: note.excerpt }}
                    />
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <span className="font-medium">{readingTime} min read</span>
                  </div>

                  {/* Read More Button */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                    <span>Read Article</span>
                    <ArrowRight className="duration-250 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedNotes.map((note) => {
            const readingTime = getReadingTime(note.content);

            return (
              <Link
                key={note.id}
                href={`/application-notes/${note.slug}`}
                className="group flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon Thumbnail */}
                <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {note.title}
                  </h3>
                  {note.excerpt && (
                    <p
                      className="mb-2 line-clamp-2 text-sm text-neutral-600"
                      dangerouslySetInnerHTML={{ __html: note.excerpt }}
                    />
                  )}
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-shrink-0 items-center">
                  <ArrowRight className="h-5 w-5 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-600" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
