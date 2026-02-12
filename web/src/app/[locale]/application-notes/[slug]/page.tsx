import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GetApplicationNoteBySlugQuery,
  GetApplicationNoteBySlugDocument,
} from '@/lib/graphql/generated';
import { getGraphQLClient } from '@/lib/graphql/client';
import { ArrowLeft, Calendar, Clock, BookOpen, FileDown } from 'lucide-react';
import logger from '@/lib/logger';
import { ArticleActions } from '@/components/application-notes/ArticleActions';
import { ReadingProgress } from '@/components/application-notes/ReadingProgress';

interface Params {
  slug: string;
}

interface Props {
  params: Promise<Params>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function getReadingTime(content: string): number {
  const text = stripHtml(content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchApplicationNote(slug: string) {
  try {
    const client = getGraphQLClient(['application-notes', `application-note-${slug}`]);
    const data = await client.request<GetApplicationNoteBySlugQuery>(
      GetApplicationNoteBySlugDocument,
      { slug }
    );

    return data.applicationNote;
  } catch (error) {
    logger.error('Error fetching application note', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await fetchApplicationNote(slug);

  if (!note) {
    return {
      title: 'Application Note Not Found | BAPI',
    };
  }

  const excerpt = note.excerpt ? stripHtml(note.excerpt) : '';
  const noteTitle = note.title || 'Application Note';

  return {
    title: `${noteTitle} | Application Notes | BAPI`,
    description: excerpt || 'Technical application note from BAPI',
    openGraph: {
      title: noteTitle,
      description: excerpt,
      type: 'article',
      publishedTime: note.date || undefined,
      modifiedTime: note.modified || undefined,
      images: note.featuredImage?.node?.sourceUrl
        ? [
            {
              url: note.featuredImage.node.sourceUrl,
              alt: note.featuredImage.node.altText || noteTitle,
            },
          ]
        : [],
    },
  };
}

export default async function ApplicationNotePage({ params }: Props) {
  const { slug } = await params;
  const note = await fetchApplicationNote(slug);

  if (!note || !note.title || !note.content) {
    notFound();
  }

  const readingTime = getReadingTime(note.content);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Back Navigation */}
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/application-notes"
              className="group inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              <ArrowLeft className="duration-250 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back to Application Notes</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <ArticleActions title={note.title || 'Application Note'} />
          </div>
        </div>
      </div>

      {/* Hero / Featured Image */}
      {note.featuredImage?.node?.sourceUrl ? (
        <div className="relative h-[400px] overflow-hidden bg-neutral-900">
          <Image
            src={note.featuredImage.node.sourceUrl}
            alt={note.featuredImage.node.altText || note.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent" />
          <div className="container absolute bottom-0 left-0 right-0 mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
                <BookOpen className="h-4 w-4" />
                <span>Application Note</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{note.title}</h1>
              <div className="flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{note.date ? formatDate(note.date) : 'Date unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-accent-400 blur-3xl" />
          </div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                <BookOpen className="h-4 w-4" />
                <span>Application Note</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {note.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{note.date ? formatDate(note.date) : 'Date unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
                {note.modified && note.date !== note.modified && (
                  <div className="flex items-center gap-2 rounded bg-white/10 px-2 py-1 text-xs">
                    <span>Updated {formatDate(note.modified)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Excerpt */}
          {note.excerpt && (
            <div className="relative mb-10 rounded-r-lg border-l-4 border-primary-600 bg-gradient-to-r from-primary-50 to-blue-50 p-6 shadow-sm md:p-8">
              <div className="absolute right-4 top-4 text-primary-200">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
                Overview
              </h2>
              <div
                className="prose prose-lg text-lg leading-relaxed [&>p]:mb-0 [&_p]:text-black [&_strong]:font-semibold [&_strong]:text-black"
                dangerouslySetInnerHTML={{ __html: note.excerpt }}
              />
            </div>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg prose-neutral max-w-none rounded-xl border border-neutral-200 bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-lg prose-headings:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-3xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-2xl prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-xl prose-p:mb-4 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:pl-6 prose-blockquote:italic prose-code:rounded prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:text-primary-700 prose-pre:rounded-lg prose-pre:bg-neutral-900 prose-pre:p-6 prose-pre:text-neutral-100 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-table:w-full prose-table:border-collapse prose-th:bg-neutral-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:border-t prose-td:border-neutral-200 prose-td:p-3 prose-img:my-8 prose-img:rounded-lg prose-img:shadow-md md:p-12 [&_blockquote]:text-neutral-800 [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_li]:font-normal [&_li]:text-black [&_ol]:text-black [&_p]:font-normal [&_p]:text-black [&_strong]:font-semibold [&_strong]:text-black [&_td]:text-black [&_th]:text-black [&_ul]:text-black"
            dangerouslySetInnerHTML={{ __html: note.content || '' }}
          />

          {/* Footer CTA */}
          <div className="relative mt-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 text-center text-white shadow-lg md:p-10">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-400 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:text-3xl">Need More Technical Guidance?</h3>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
                Explore our complete library of application notes, or contact our technical support
                team for personalized assistance.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/application-notes"
                  className="duration-250 group rounded-lg bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all hover:scale-105 hover:bg-primary-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    View All Application Notes
                    <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/resources"
                  className="duration-250 group rounded-lg border-2 border-white/30 bg-primary-500/50 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-primary-500"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download Resources
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
