'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@/lib/icons';
import { ApplicationNoteCard } from './ApplicationNoteCard';
import type { CategoryWithNotes } from '@/types/applicationNote';

interface CategoryAccordionProps {
  categories: CategoryWithNotes[];
  viewMode: 'grid' | 'list';
}

/**
 * CategoryAccordion component displays application notes grouped by category
 * with expandable/collapsible sections matching the legacy site's accordion UI.
 */
export function CategoryAccordion({ categories, viewMode }: CategoryAccordionProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (openCategories.size === categories.length) {
      setOpenCategories(new Set());
    } else {
      setOpenCategories(new Set(categories.map(cat => cat.id)));
    }
  };

  const allOpen = openCategories.size === categories.length;

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
          aria-label={allOpen ? 'Collapse all categories' : 'Expand all categories'}
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Category Accordions */}
      <div className="space-y-3">
        {categories.map(category => {
          const isOpen = openCategories.has(category.id);

          return (
            <div
              key={category.id}
              className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-neutral-800 hover:bg-primary-600 transition-colors duration-200 text-left group"
                aria-expanded={isOpen}
                aria-controls={`category-${category.slug}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {isOpen ? (
                    <ChevronDownIcon className="h-5 w-5 text-white flex-shrink-0 transition-transform duration-200" aria-hidden="true" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-white flex-shrink-0 transition-transform duration-200" aria-hidden="true" />
                  )}
                  <h3 className="text-base font-semibold text-white truncate">
                    {category.name}
                  </h3>
                </div>
                <span className="text-sm text-neutral-300 ml-3 flex-shrink-0">
                  ({category.count})
                </span>
              </button>

              {/* Category Content */}
              {isOpen && (
                <div
                  id={`category-${category.slug}`}
                  className="p-6 bg-white border-t border-neutral-200"
                >
                  {category.notes.length === 0 ? (
                    <p className="text-neutral-600 text-center py-8">
                      No application notes in this category.
                    </p>
                  ) : (
                    <div
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                          : 'space-y-4'
                      }
                    >
                      {category.notes.map(note => (
                        <ApplicationNoteCard
                          key={note.id}
                          note={note}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-neutral-600">
          No categories found.
        </div>
      )}
    </div>
  );
}
