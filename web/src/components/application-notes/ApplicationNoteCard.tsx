'use client';

import { Link } from '@/lib/navigation';
import {
  BookOpenIcon,
  ClockIcon as CalendarIcon,
  ArrowRightIcon,
} from '@/lib/icons';
import type { ApplicationNote } from '@/types/applicationNote';

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

interface ApplicationNoteCardProps {
  note: ApplicationNote;
  viewMode: 'grid' | 'list';
}

export function ApplicationNoteCard({ note, viewMode }: ApplicationNoteCardProps) {
  const readingTime = getReadingTime(note.content);

  if (viewMode === 'grid') {
    return (
      <Link
        href={`/application-notes/${note.slug}`}
        className="duration-250 group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-[transform,shadow,border-color] ease-in-out will-change-transform hover:scale-[1.01] hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {/* Consistent Icon Header */}
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <BookOpenIcon className="duration-250 h-16 w-16 text-primary-600 transition-transform group-hover:scale-110" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
            {note.title}
          </h3>

          {note.excerpt && (
            <p
              className="mb-4 line-clamp-3 text-sm text-neutral-700"
              dangerouslySetInnerHTML={{ __html: note.excerpt }}
            />
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-700">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formatDate(note.date)}</span>
            </div>
            <span className="font-medium">{readingTime} min read</span>
          </div>

          {/* Read More Button */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
            <span>Read article</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  // List view
  return (
    <Link
      href={`/application-notes/${note.slug}`}
      className="group flex flex-col gap-4 overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-[shadow,border-color] hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 md:flex-row"
    >
      {/* Icon */}
      <div className="flex h-32 w-full flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 md:h-40 md:w-48">
        <BookOpenIcon className="duration-250 h-12 w-12 text-primary-600 transition-transform group-hover:scale-110 md:h-16 md:w-16" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
          {note.title}
        </h3>

        {note.excerpt && (
          <p
            className="mb-4 line-clamp-3 flex-1 text-neutral-700"
            dangerouslySetInnerHTML={{ __html: note.excerpt }}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-4 text-sm text-neutral-700">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(note.date)}</span>
            </div>
            <span className="font-medium">{readingTime} min read</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
            <span>Read article</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
