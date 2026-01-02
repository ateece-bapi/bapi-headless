'use client';

import { useState, useMemo } from 'react';
import { 
  FileText, Download, Search, Filter, Calendar, HardDrive, 
  BookOpen, FileSpreadsheet, ClipboardList, Book, File,
  SortAsc, Grid3x3, List, X
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
  if (title.includes('datasheet') || title.includes('sell sheet') || url.includes('sellsheet')) return 'datasheet';
  if (title.includes('catalog')) return 'catalog';
  return 'other';
}

function getCategoryIcon(category: ResourceCategory) {
  switch (category) {
    case 'installation': return BookOpen;
    case 'datasheet': return FileSpreadsheet;
    case 'catalog': return Book;
    default: return File;
  }
}

function getCategoryColor(category: ResourceCategory) {
  switch (category) {
    case 'installation': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'datasheet': return 'bg-green-50 text-green-700 border-green-200';
    case 'catalog': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-neutral-50 text-neutral-700 border-neutral-200';
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
      filtered = filtered.filter(
        (resource) => categorizeResource(resource) === selectedCategory
      );
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
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search documents"
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">Filter by type:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              aria-label={`Filter by ${category.label}`}
              aria-pressed={selectedCategory === category.value}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-102'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">
                ({categoryCounts[category.value]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Results Count, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-neutral-600 text-sm">
            Showing <span className="font-semibold text-neutral-900">{filteredAndSortedResources.length}</span> of{' '}
            <span className="font-semibold text-neutral-900">{resources.length}</span> documents
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">Sort documents</label>
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

      {/* Resource Grid/List */}
      {filteredAndSortedResources.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border-2 border-dashed border-neutral-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-6">
            <FileText className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">No documents found</h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `We couldn't find any documents matching "${searchQuery}". Try adjusting your search or filters.`
              : 'No documents match your selected filters. Try selecting different categories or clearing filters.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              Clear all filters
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-white text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-lg hover:border-primary-300 transition-[transform,shadow,border-color] duration-250 ease-in-out hover:scale-[1.01] will-change-transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon and Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors duration-250">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${getCategoryColor(category)} transition-colors shadow-sm`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{categoryLabel}</span>
                  </span>
                </div>

                {/* Title with Truncation */}
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {resource.title}
                </h3>

                {/* Description */}
                {resource.description && (
                  <p
                    className="text-sm text-neutral-600 mb-4 line-clamp-2 min-h-[2.5rem]"
                    dangerouslySetInnerHTML={{ __html: resource.description }}
                  />
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(resource.date)}</span>
                  </div>
                  {resource.fileSize && (
                    <div className="flex items-center gap-1 font-medium">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{formatFileSize(resource.fileSize)}</span>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <div className="flex items-center justify-center gap-2 mt-4 py-2 px-4 bg-primary-50 text-primary-600 font-medium text-sm rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-[background-color,color] duration-250">
                  <Download className="w-4 h-4" />
                  <span>Download PDF {resource.fileSize && `(${formatFileSize(resource.fileSize)})`}</span>
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
                className="group flex items-center gap-4 bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:shadow-md hover:border-primary-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Icon */}
                <div className="flex-shrink-0 p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors truncate flex-1">
                      {resource.title}
                    </h3>
                    <span className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${getCategoryColor(category)} shadow-sm`}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                      <span>{categoryLabel}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(resource.date)}</span>
                    </div>
                    {resource.fileSize && (
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 font-medium text-sm rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all duration-200">
                  <Download className="w-4 h-4" />
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
