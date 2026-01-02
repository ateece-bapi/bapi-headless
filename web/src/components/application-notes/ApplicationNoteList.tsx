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
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search application notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search application notes"
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Results Count, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-neutral-600 text-sm">
            Showing{' '}
            <span className="font-semibold text-neutral-900">{filteredAndSortedNotes.length}</span>{' '}
            of <span className="font-semibold text-neutral-900">{applicationNotes.length}</span>{' '}
            articles
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <X className="w-4 h-4" />
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
              className="appearance-none pl-10 pr-10 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-neutral-700 cursor-pointer transition-shadow"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-neutral-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Application Notes Grid/List */}
      {filteredAndSortedNotes.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border-2 border-dashed border-neutral-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-6">
            <BookOpen className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No articles found</h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any articles matching "${searchQuery}". Try a different search term.`
              : 'No application notes match your criteria. Try clearing your search.'}
          </p>
          <button
            onClick={clearSearch}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            Clear search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNotes.map((note) => {
            const readingTime = getReadingTime(note.content);

            return (
              <Link
                key={note.id}
                href={`/application-notes/${note.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-[transform,shadow,border-color] duration-250 ease-in-out hover:scale-[1.01] will-change-transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Consistent Icon Header */}
                <div className="h-48 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary-600 group-hover:scale-110 transition-transform duration-250" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {note.title}
                  </h3>

                  {note.excerpt && (
                    <p
                      className="text-sm text-neutral-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: note.excerpt }}
                    />
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <span className="font-medium">{readingTime} min read</span>
                  </div>

                  {/* Read More Button */}
                  <div className="flex items-center gap-2 mt-4 text-primary-600 font-medium text-sm group-hover:text-primary-700">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-250" />
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
                className="group flex gap-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:shadow-md hover:border-primary-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon Thumbnail */}
                <div className="w-32 h-24 shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  {note.excerpt && (
                    <p
                      className="text-sm text-neutral-600 line-clamp-2 mb-2"
                      dangerouslySetInnerHTML={{ __html: note.excerpt }}
                    />
                  )}
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 flex items-center">
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
