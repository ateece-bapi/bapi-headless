'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Download } from 'lucide-react';

export interface SpecificationGroup {
  title: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

interface ProductSpecificationsProps {
  /** Specification groups */
  specifications: SpecificationGroup[];
  /** Product name for download */
  productName: string;
  /** Enable search functionality */
  searchable?: boolean;
  /** Enable PDF download */
  downloadable?: boolean;
}

/**
 * Professional specifications table with collapsible sections and search
 *
 * Features:
 * - Collapsible specification groups
 * - Search/filter specifications
 * - Download as PDF option
 * - Responsive mobile layout
 * - BAPI brand styling
 *
 * @param specifications - Array of specification groups
 * @param productName - Product name for download filename
 * @param searchable - Enable search (default: true)
 * @param downloadable - Enable PDF download (default: true)
 */
export default function ProductSpecifications({
  specifications,
  productName,
  searchable = true,
  downloadable = true,
}: ProductSpecificationsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    new Set(specifications.map((_, index) => index))
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle group expansion
  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Expand all groups
  const expandAll = () => {
    setExpandedGroups(new Set(specifications.map((_, index) => index)));
  };

  // Collapse all groups
  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  // Filter specifications based on search query
  const filteredSpecifications = specifications
    .map((group) => ({
      ...group,
      specs: group.specs.filter(
        (spec) =>
          spec.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spec.value.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.specs.length > 0);

  // Handle PDF download
  const handleDownload = () => {
    // In production, this would generate a proper PDF
    // For now, we'll create a simple text representation
    const content = specifications
      .map(
        (group) =>
          `${group.title}\n${group.specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n')}`
      )
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.replace(/\s+/g, '-')}-specifications.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (specifications.length === 0) {
    return (
      <div className="rounded-xl bg-neutral-50 p-8 text-center">
        <p className="text-neutral-600">No specifications available for this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        {searchable && (
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-2 border-neutral-300 py-2 pl-10 pr-4 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-700"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition-all hover:bg-primary-50 hover:text-primary-700"
          >
            Collapse All
          </button>
          {downloadable && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Specification groups */}
      <div className="space-y-3">
        {filteredSpecifications.map((group, groupIndex) => {
          const isExpanded = expandedGroups.has(groupIndex);

          return (
            <div
              key={groupIndex}
              className="overflow-hidden rounded-xl border-2 border-neutral-200 bg-white transition-all hover:border-neutral-300"
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(groupIndex)}
                className="flex w-full items-center justify-between p-4 transition-all hover:bg-neutral-50"
              >
                <h3 className="text-lg font-bold text-neutral-900">{group.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">
                    {group.specs.length} {group.specs.length === 1 ? 'spec' : 'specs'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-neutral-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-600" />
                  )}
                </div>
              </button>

              {/* Group content */}
              {isExpanded && (
                <div className="border-t border-neutral-200">
                  <table className="w-full">
                    <tbody>
                      {group.specs.map((spec, specIndex) => (
                        <tr
                          key={specIndex}
                          className={` ${specIndex % 2 === 0 ? 'bg-neutral-50' : 'bg-white'} transition-colors hover:bg-primary-50`}
                        >
                          <td className="w-1/3 px-4 py-3 font-medium text-neutral-700 sm:w-1/4">
                            {spec.label}
                          </td>
                          <td className="px-4 py-3 text-neutral-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No results message */}
      {filteredSpecifications.length === 0 && searchQuery && (
        <div className="rounded-xl bg-neutral-50 p-8 text-center">
          <p className="text-neutral-600">
            No specifications found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 font-medium text-primary-600 hover:text-primary-700"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
