'use client';

import { useState, useMemo } from 'react';
import { FileText, Download, Search, Filter, Calendar, HardDrive } from 'lucide-react';

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

type ResourceCategory = 'all' | 'installation' | 'datasheet' | 'application' | 'catalog' | 'other';

function categorizeResource(resource: Resource): ResourceCategory {
  const title = resource.title.toLowerCase();
  const url = resource.mediaItemUrl.toLowerCase();
  
  if (title.includes('install') || url.includes('_ins_')) return 'installation';
  if (title.includes('datasheet') || title.includes('sell sheet') || url.includes('sellsheet')) return 'datasheet';
  if (title.includes('application') || title.includes('appnote') || url.includes('appnote')) return 'application';
  if (title.includes('catalog')) return 'catalog';
  return 'other';
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
  { value: 'application', label: 'Application Notes' },
  { value: 'catalog', label: 'Catalogs' },
  { value: 'other', label: 'Other Resources' },
];

export function ResourceList({ resources }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('all');

  const filteredResources = useMemo(() => {
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

    return filtered;
  }, [resources, selectedCategory, searchQuery]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ResourceCategory, number> = {
      all: resources.length,
      installation: 0,
      datasheet: 0,
      application: 0,
      catalog: 0,
      other: 0,
    };

    resources.forEach((resource) => {
      const category = categorizeResource(resource);
      counts[category]++;
    });

    return counts;
  }, [resources]);

  return (
    <div className="space-y-8">
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
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
          />
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-600">
          Showing <span className="font-semibold text-neutral-900">{filteredResources.length}</span> of{' '}
          <span className="font-semibold text-neutral-900">{resources.length}</span> documents
        </p>
      </div>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600">No documents found matching your criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.mediaItemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200"
            >
              {/* Icon and Category */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                  {CATEGORIES.find((c) => c.value === categorizeResource(resource))?.label || 'Document'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {resource.title}
              </h3>

              {/* Description */}
              {resource.description && (
                <p
                  className="text-sm text-neutral-600 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: resource.description }}
                />
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
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

              {/* Download Button */}
              <div className="flex items-center gap-2 mt-4 text-primary-600 font-medium text-sm group-hover:text-primary-700">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
