'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileTextIcon, DownloadIcon, SearchIcon, XCircleIcon } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Fuse from 'fuse.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/Toast';
import logger from '@/lib/logger';

// Lazy load PDF preview modal (client-side only)
const PDFPreviewModal = dynamic(() => import('./PDFPreviewModal'), { ssr: false });

interface Document {
  id: string;
  title: string;
  filename: string;
  url: string;
  fileSize?: number | null;
  date?: string;
  productName?: string;
  productSku?: string;
  categories: string[];
  documentType: string;
}

interface DocumentLibraryClientProps {
  documents: Document[];
  totalCount: number;
}

const ITEMS_PER_PAGE = 24;

// Format file size
function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Highlight search terms in text
function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm) return text;
  
  // Escape special regex characters to prevent injection
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchTerm.toLowerCase() ? 
      <mark key={i} className="bg-accent-300 font-semibold">{part}</mark> : 
      part
  );
}

// Get recent searches from localStorage
function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('bapi_recent_searches') || '[]');
  } catch {
    return [];
  }
}

// Save search to localStorage
function saveRecentSearch(term: string): void {
  if (typeof window === 'undefined' || !term.trim()) return;
  try {
    const recent = getRecentSearches();
    const updated = [term, ...recent.filter(t => t !== term)].slice(0, 5);
    localStorage.setItem('bapi_recent_searches', JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';

export default function DocumentLibraryClient({ documents, totalCount }: DocumentLibraryClientProps) {
  const t = useTranslations('datasheetsPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  // Initialize state from URL params (with null safety)
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '');
  const [selectedType, setSelectedType] = useState(searchParams?.get('type') || '');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams?.get('sort') as SortOption) || 'date-desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get('page') || '1'));
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  
  // Premium feature state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  
  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);
  
  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm.trim()) {
        saveRecentSearch(searchTerm);
        setRecentSearches(getRecentSearches());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedType) params.set('type', selectedType);
    if (sortBy !== 'date-desc') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, selectedCategory, selectedType, sortBy, currentPage, router]);
  
  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract unique categories and types
  const { allCategories, allTypes } = useMemo(() => {
    const categorySet = new Set<string>();
    const typeSet = new Set<string>();
    
    documents.forEach(doc => {
      doc.categories.forEach(cat => categorySet.add(cat));
      typeSet.add(doc.documentType);
    });
    
    return {
      allCategories: Array.from(categorySet).sort(),
      allTypes: Array.from(typeSet).sort(),
    };
  }, [documents]);

  // Fuse.js instance for fuzzy search
  const fuse = useMemo(() => new Fuse(documents, {
    keys: ['title', 'filename', 'productName', 'productSku'],
    threshold: 0.3, // 0 = exact match, 1 = match anything
    ignoreLocation: true,
  }), [documents]);

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    // Fuzzy search filter (debounced)
    if (debouncedSearch) {
      const fuseResults = fuse.search(debouncedSearch);
      filtered = fuseResults.map(result => result.item);
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(doc => 
        doc.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    
    // Type filter
    if (selectedType) {
      filtered = filtered.filter(doc => doc.documentType === selectedType);
    }
    
    // Sort documents (create shallow copy to avoid mutating props)
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return (b.date || '').localeCompare(a.date || '');
        case 'date-asc':
          return (a.date || '').localeCompare(b.date || '');
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
  }, [documents, debouncedSearch, selectedCategory, selectedType, sortBy]);

  // Paginated documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  // Handler functions for premium features (must be after data computations)
  const toggleDocSelection = useCallback((docId: string) => {
    setSelectedDocIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedDocIds.size > 0) {
      setSelectedDocIds(new Set());
    } else {
      // Select all documents on current page
      setSelectedDocIds(new Set(paginatedDocuments.map(doc => doc.id)));
    }
  }, [selectedDocIds.size, paginatedDocuments]);

  const handleBulkDownload = useCallback(async () => {
    if (selectedDocIds.size === 0) return;
    
    setIsDownloadingZip(true);
    const failedFiles: string[] = [];
    
    try {
      const zip = new JSZip();
      const selectedDocs = documents.filter(doc => selectedDocIds.has(doc.id));
      
      // Fetch all PDFs and add to ZIP (track failures)
      await Promise.all(
        selectedDocs.map(async (doc) => {
          try {
            const response = await fetch(doc.url);
            
            // Check HTTP status before adding to ZIP
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            zip.file(doc.filename, blob);
          } catch (error) {
            logger.error(`Failed to download ${doc.filename}`, error);
            failedFiles.push(doc.filename);
          }
        })
      );
      
      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `bapi-documents-${new Date().toISOString().split('T')[0]}.zip`);
      
      // Show warning if some files failed
      if (failedFiles.length > 0) {
        showToast(
          'warning',
          'Incomplete Download',
          `${failedFiles.length} of ${selectedDocIds.size} files failed to download. ZIP may be incomplete.`,
          8000
        );
      }
      
      // Track download event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bulk_download', {
          event_category: 'Documents',
          event_label: 'Bulk ZIP Download',
          value: selectedDocIds.size,
          failed_count: failedFiles.length,
        });
      }
    } catch (error) {
      logger.error('Bulk download failed', error);
      showToast(
        'error',
        'Download Failed',
        'Failed to create ZIP file. Please try again or download files individually.'
      );
    } finally {
      setIsDownloadingZip(false);
    }
  }, [selectedDocIds, documents, showToast]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSelectedType('');
    setSortBy('date-desc');
    setCurrentPage(1);
  }, []);
  
  const handleRecentSearchClick = useCallback((term: string) => {
    setSearchTerm(term);
    setShowRecentSearches(false);
    handleFilterChange();
  }, []);
  
  // Track download analytics
  const handleDownload = useCallback((doc: Document) => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('event', 'document_download', {
        document_id: doc.id,
        document_title: doc.title,
        document_type: doc.documentType,
        file_size: doc.fileSize,
      });
    }
  }, []);

  const hasActiveFilters = searchTerm || selectedCategory || selectedType || sortBy !== 'date-desc';

  return (
    <>
      {/* Search & Filter */}
      <section className="sticky top-0 z-10 border-b-2 border-neutral-200 bg-neutral-50 py-6">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Stats Bar */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral-700">
              {t('stats.showing', { 
                start: 1,
                end: filteredDocuments.length,
                total: totalCount 
              })}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <XCircleIcon className="h-4 w-4" />
                {t('filters.clear')}
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search with Recent Searches */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleFilterChange();
                  }}
                  onFocus={() => setShowRecentSearches(true)}
                  onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                  placeholder={t('search.placeholder')}
                  className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  aria-label={t('search.ariaLabel')}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  ⌘K
                </div>
                
                {/* Recent Searches Dropdown */}
                {showRecentSearches && recentSearches.length > 0 && !searchTerm && (
                  <div className="absolute top-full mt-1 w-full rounded-lg border border-neutral-300 bg-white shadow-lg z-20">
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-neutral-500">{t('recentSearches.heading')}</div>
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentSearchClick(term)}
                          className="w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 transition-colors"
                        >
                          <SearchIcon className="inline-block h-3 w-3 mr-2 text-neutral-400" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-64">
              <select 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  handleFilterChange();
                }}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                aria-label={t('filters.categoryLabel')}
              >
                <option value="">{t('filters.allCategories')}</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Document Type Filter */}
            <div className="w-full lg:w-64">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleFilterChange();
                }}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                aria-label={t('filters.typeLabel')}
              >
                <option value="">{t('filters.allTypes')}</option>
                {allTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Dropdown */}
            <div className="w-full lg:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                aria-label={t('sort.label')}
              >
                <option value="date-desc">{t('sort.dateDesc')}</option>
                <option value="date-asc">{t('sort.dateAsc')}</option>
                <option value="name-asc">{t('sort.nameAsc')}</option>
                <option value="name-desc">{t('sort.nameDesc')}</option>
                <option value="size-desc">{t('sort.sizeDesc')}</option>
                <option value="size-asc">{t('sort.sizeAsc')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar with View Toggle & Bulk Actions */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-4">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {t('stats.showing', {
                start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(currentPage * ITEMS_PER_PAGE, filteredDocuments.length),
                total: filteredDocuments.length
              })}
            </p>
            
            <div className="flex items-center gap-3">
              {/* Bulk Download Button */}
              {selectedDocIds.size > 0 && (
                <button
                  onClick={handleBulkDownload}
                  disabled={isDownloadingZip}
                  className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-accent-600 disabled:opacity-50"
                >
                  <DownloadIcon className="h-4 w-4" />
                  {isDownloadingZip 
                    ? t('bulkActions.creatingZip')
                    : t('bulkActions.downloadZip', { count: selectedDocIds.size })
                  }
                </button>
              )}
              
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-neutral-300 bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  aria-label="Grid view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  aria-label="List view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {filteredDocuments.length === 0 ? (
            <div className="py-16 text-center">
              <FileTextIcon className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
              <h3 className="mb-2 text-xl font-bold text-neutral-900">
                {t('noResults.heading')}
              </h3>
              <p className="mb-4 text-neutral-600">
                {t('noResults.description')}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  {t('noResults.clearButton')}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Select All Header */}
              <div className="mb-4 flex items-center gap-2 border-b border-neutral-200 pb-4">
                <input
                  type="checkbox"
                  checked={selectedDocIds.size > 0 && selectedDocIds.size === paginatedDocuments.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  aria-label={t('grid.selectAll')}
                />
                <span className="text-sm text-neutral-600">
                  {selectedDocIds.size > 0
                    ? t('grid.selectedCount', { count: selectedDocIds.size })
                    : t('grid.selectAll')}
                </span>
              </div>
              
              {/* Grid View */}
              <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
                {paginatedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="group relative flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-5 transition-all hover:border-primary-500 hover:shadow-lg"
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute left-3 top-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedDocIds.has(doc.id)}
                        onChange={() => toggleDocSelection(doc.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                        aria-label={`Select ${doc.title}`}
                      />
                    </div>
                    
                    {/* Document Content - Make whole card clickable */}
                    <div
                      onClick={() => setPreviewDoc(doc)}
                      className="cursor-pointer"
                    >
                      {/* Icon & Type Badge */}
                      <div className="mb-3 flex items-start justify-between pl-8">
                        <div className="flex h-14 w-12 flex-shrink-0 items-center justify-center rounded bg-neutral-100 group-hover:bg-primary-50">
                          <FileTextIcon className="h-7 w-7 text-primary-500" />
                        </div>
                        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                          {doc.documentType}
                        </span>
                      </div>

                    {/* Title & Metadata */}
                    <div className="mb-3 flex-1">
                      {doc.productSku && (
                        <div className="mb-1 text-xs font-mono text-neutral-600">{doc.productSku}</div>
                      )}
                      <h3 className="mb-1.5 line-clamp-2 text-sm font-bold text-neutral-900 group-hover:text-primary-600">
                        {highlightText(doc.title, debouncedSearch)}
                      </h3>
                      {doc.productName && (
                        <p className="mb-2 line-clamp-1 text-xs text-neutral-600">{doc.productName}</p>
                      )}
                      
                      {/* Categories */}
                      {doc.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doc.categories.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600"
                            >
                              {cat}
                            </span>
                          ))}
                          {doc.categories.length > 2 && (
                            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
                              +{doc.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="mb-3 flex items-center justify-between border-t border-neutral-200 pt-3 text-xs text-neutral-600">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      {doc.date && (
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    </div>

                    {/* Download Button */}
                    <a
                      href={doc.url}
                      download
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(doc);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-bold text-neutral-900 transition-colors group-hover:bg-accent-600"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span className="text-sm">{t('grid.downloadButton')}</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('pagination.previous')}
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-lg px-4 py-2 transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-500 text-white'
                            : 'border-2 border-neutral-300 hover:border-primary-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border-2 border-neutral-300 px-4 py-2 transition-colors hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('pagination.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* PDF Preview Modal */}
      {previewDoc && (
        <PDFPreviewModal
          url={previewDoc.url}
          title={previewDoc.title}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </>
  );
}
