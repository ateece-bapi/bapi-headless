'use client';

import { startTransition, useDeferredValue, useState } from 'react';
import { Link } from '@/lib/navigation';
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  SearchIcon,
} from '@/lib/icons';
import { getServiceBulletinPlainText, type ServiceBulletin } from '@/lib/serviceBulletins';

const PAGE_SIZE = 10;

interface ServiceBulletinDirectoryProps {
  bulletins: ServiceBulletin[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ServiceBulletinDirectory({ bulletins }: ServiceBulletinDirectoryProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const categories = Array.from(
    new Map(
      bulletins
        .flatMap((bulletin) => bulletin.serviceBulletinCategories?.nodes ?? [])
        .map((item) => [item.slug, item])
    ).values()
  ).sort((left, right) => left.name.localeCompare(right.name));

  const years = Array.from(
    new Set(bulletins.map((bulletin) => new Date(bulletin.date).getFullYear().toString()))
  ).sort((left, right) => Number(right) - Number(left));

  const filteredBulletins = bulletins.filter((bulletin) => {
    const searchableText =
      `${bulletin.title} ${getServiceBulletinPlainText(bulletin.excerpt)}`.toLowerCase();
    const matchesSearch = !deferredSearch || searchableText.includes(deferredSearch);
    const matchesCategory =
      !category || bulletin.serviceBulletinCategories?.nodes.some((item) => item.slug === category);
    const matchesYear = !year || new Date(bulletin.date).getFullYear().toString() === year;

    return matchesSearch && matchesCategory && matchesYear;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBulletins.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleBulletins = filteredBulletins.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateFilter(update: () => void) {
    startTransition(() => {
      update();
      setPage(1);
    });
  }

  return (
    <>
      <section className="py-8">
        <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-5 shadow-sm sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent-500" aria-hidden="true" />
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="w-full md:max-w-md">
              <label
                htmlFor="bulletin-search"
                className="mb-2 block text-sm font-semibold text-neutral-900"
              >
                Search bulletins
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" />
                <input
                  id="bulletin-search"
                  type="search"
                  value={search}
                  onChange={(event) => updateFilter(() => setSearch(event.target.value))}
                  placeholder="Search by title or description"
                  className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-11 pr-4 shadow-sm transition-[border-color,box-shadow] placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-neutral-900">
                <span className="mb-2 block">Category</span>
                <select
                  value={category}
                  onChange={(event) => updateFilter(() => setCategory(event.target.value))}
                  className="h-11 min-w-44 rounded-lg border border-neutral-300 bg-white px-3 font-normal shadow-sm transition-[border-color,box-shadow] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-neutral-900">
                <span className="mb-2 block">Year</span>
                <select
                  value={year}
                  onChange={(event) => updateFilter(() => setYear(event.target.value))}
                  className="h-11 min-w-32 rounded-lg border border-neutral-300 bg-white px-3 font-normal shadow-sm transition-[border-color,box-shadow] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="">All years</option>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 pt-2">
        {visibleBulletins.length === 0 ? (
          <div className="border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-neutral-900">No service bulletins found</h2>
            <p className="mt-2 text-neutral-700">
              {bulletins.length === 0
                ? 'Published service bulletins will appear here.'
                : 'Try changing your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleBulletins.map((bulletin) => (
              <Link
                key={bulletin.id}
                href={`/service-bulletin/${bulletin.slug}`}
                className="group relative flex overflow-hidden rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:p-6"
              >
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-primary-500 transition-colors group-hover:bg-accent-500"
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <FileTextIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4" />
                        <time dateTime={bulletin.date}>{formatDate(bulletin.date)}</time>
                      </span>
                      {(bulletin.serviceBulletinCategories?.nodes ?? []).map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {bulletin.title}
                    </h2>
                    {bulletin.excerpt && (
                      <p className="mt-2 line-clamp-3 max-w-4xl leading-relaxed text-neutral-700">
                        {getServiceBulletinPlainText(bulletin.excerpt)}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 self-start font-semibold text-primary-600 sm:ml-4 sm:pt-1">
                    View details
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-8 flex items-center justify-center gap-2"
            aria-label="Service bulletin pages"
          >
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
                className={`min-h-11 min-w-11 rounded-md border px-3 py-2 font-medium ${
                  pageNumber === currentPage
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-900 hover:border-primary-500'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
