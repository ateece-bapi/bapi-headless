'use client';

import { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  HardDrive,
  BookOpen,
  FileSpreadsheet,
  ClipboardList,
  Book,
  File,
  SortAsc,
  Grid3x3,
  List,
  X,
} from 'lucide-react';

interface Resource {
  id: string;
  databaseId: number;
  title: string;
  description: string | null;
  mediaItemUrl: string;
  fileSize: number | null;
  date: string;
  sourceUrl: string;
}

interface ResourceListProps {
  resources: Resource[];
}

type ResourceCategory = 'all' | 'installation' | 'datasheet' | 'catalog' | 'other';
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
type ViewMode = 'grid' | 'list';

function categorizeResource(resource: Resource): ResourceCategory {
  const title = resource.title.toLowerCase();
  const url = resource.mediaItemUrl.toLowerCase();

  if (title.includes('install') || url.includes('_ins_')) return 'installation';
  if (title.includes('datasheet') || title.includes('sell sheet') || url.includes('sellsheet'))
    return 'datasheet';
  if (title.includes('catalog')) return 'catalog';
  return 'other';
}

function getCategoryIcon(category: ResourceCategory) {
  switch (category) {
    case 'installation':
      return BookOpen;
    case 'datasheet':
      return FileSpreadsheet;
    case 'catalog':
      return Book;
    default:
      return File;
  }
}

function getCategoryColor(category: ResourceCategory) {
  switch (category) {
    case 'installation':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'datasheet':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'catalog':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-neutral-50 text-neutral-700 border-neutral-200';
  }
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const CATEGORIES: { value: ResourceCategory; label: string; count?: number }[] = [
  { value: 'all', label: 'All Documents' },
  { value: 'installation', label: 'Installation Guides' },
  { value: 'datasheet', label: 'Datasheets & Specs' },
  { value: 'catalog', label: 'Catalogs' },
  { value: 'other', label: 'Other Resources' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size-desc', label: 'Largest First' },
  { value: 'size-asc', label: 'Smallest First' },
];

export function ResourceList({ resources }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedResources = useMemo(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((resource) => categorizeResource(resource) === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description?.toLowerCase().includes(query) ||
          resource.mediaItemUrl.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'size-desc':
          return (b.fileSize || 0) - (a.fileSize || 0);
        case 'size-asc':
          return (a.fileSize || 0) - (b.fileSize || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [resources, selectedCategory, searchQuery, sortBy]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ResourceCategory, number> = {
      all: resources.length,
      installation: 0,
      datasheet: 0,
      catalog: 0,
      other: 0,
    };

    resources.forEach((resource) => {
      const category = categorizeResource(resource);
      counts[category]++;
    });

    return counts;
  }, [resources]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search documents"
            className="w-full rounded-lg border border-neutral-300 py-3 pl-12 pr-4 text-neutral-900 transition-shadow placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-neutral-100"
            >
              <X className="h-4 w-4 text-neutral-500" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">Filter by type:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              aria-label={`Filter by ${category.label}`}
              aria-pressed={selectedCategory === category.value}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'scale-105 bg-primary-600 text-white shadow-md'
                  : 'hover:scale-102 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">({categoryCounts[category.value]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Results Count, Sort, View Toggle */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-neutral-600">
            Showing{' '}
            <span className="font-semibold text-neutral-900">
              {filteredAndSortedResources.length}
            </span>{' '}
            of <span className="font-semibold text-neutral-900">{resources.length}</span> documents
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">
              Sort documents
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

      {/* Resource Grid/List */}
      {filteredAndSortedResources.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 py-20 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <FileText className="h-10 w-10 text-neutral-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-neutral-900">No documents found</h3>
          <p className="mx-auto mb-6 max-w-md text-neutral-600">
            {searchQuery
              ? `We couldn't find any documents matching "${searchQuery}". Try adjusting your search or filters.`
              : 'No documents match your selected filters. Try selecting different categories or clearing filters.'}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={clearAllFilters}
              className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg"
            >
              Clear all filters
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-lg border border-neutral-300 bg-white px-6 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedResources.map((resource) => {
            const category = categorizeResource(resource);
            const CategoryIcon = getCategoryIcon(category);
            const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label || 'Document';

            return (
              <a
                key={resource.id}
                href={resource.mediaItemUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={resource.title}
                className="duration-250 group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-[transform,shadow,border-color] ease-in-out will-change-transform hover:scale-[1.01] hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon and Category Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="duration-250 rounded-lg bg-primary-50 p-3 transition-colors group-hover:bg-primary-100">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getCategoryColor(category)} shadow-sm transition-colors`}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span>{categoryLabel}</span>
                  </span>
                </div>

                {/* Title with Truncation */}
                <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                  {resource.title}
                </h3>

                {/* Description */}
                {resource.description && (
                  <p
                    className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-neutral-600"
                    dangerouslySetInnerHTML={{ __html: resource.description }}
                  />
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(resource.date)}</span>
                  </div>
                  {resource.fileSize && (
                    <div className="flex items-center gap-1 font-medium">
                      <HardDrive className="h-3.5 w-3.5" />
                      <span>{formatFileSize(resource.fileSize)}</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="duration-250 mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-[background-color,color] group-hover:bg-primary-600 group-hover:text-white">
                  <Download className="h-4 w-4" />
                  <span>
                    Download PDF {resource.fileSize && `(${formatFileSize(resource.fileSize)})`}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedResources.map((resource) => {
            const category = categorizeResource(resource);
            const CategoryIcon = getCategoryIcon(category);
            const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label || 'Document';

            return (
              <a
                key={resource.id}
                href={resource.mediaItemUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={resource.title}
                className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon */}
                <div className="flex-shrink-0 rounded-lg bg-primary-50 p-3 transition-colors group-hover:bg-primary-100">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start gap-2">
                    <h3 className="flex-1 truncate font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {resource.title}
                    </h3>
                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getCategoryColor(category)} shadow-sm`}
                    >
                      <CategoryIcon className="h-3.5 w-3.5" />
                      <span>{categoryLabel}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(resource.date)}</span>
                    </div>
                    {resource.fileSize && (
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-all duration-200 group-hover:bg-primary-600 group-hover:text-white">
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Download</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
