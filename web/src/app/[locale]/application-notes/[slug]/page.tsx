import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { GetApplicationNoteBySlugQuery, GetApplicationNoteBySlugDocument } from '@/lib/graphql/generated';
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
        ? [{ url: note.featuredImage.node.sourceUrl, alt: note.featuredImage.node.altText || noteTitle }]
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
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/application-notes"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-250" />
              <span className="hidden sm:inline">Back to Application Notes</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <ArticleActions title={note.title || 'Application Note'} />
          </div>
        </div>
      </div>

      {/* Hero / Featured Image */}
      {note.featuredImage?.node?.sourceUrl ? (
        <div className="relative h-[400px] bg-neutral-900 overflow-hidden">
          <Image
            src={note.featuredImage.node.sourceUrl}
            alt={note.featuredImage.node.altText || note.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Application Note</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{note.title}</h1>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{note.date ? formatDate(note.date) : 'Date unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Application Note</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-primary-100 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{note.date ? formatDate(note.date) : 'Date unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                {note.modified && note.date !== note.modified && (
                  <div className="flex items-center gap-2 text-xs bg-white/10 px-2 py-1 rounded">
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
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {note.excerpt && (
            <div className="relative bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-600 p-6 md:p-8 rounded-r-lg mb-10 shadow-sm">
              <div className="absolute top-4 right-4 text-primary-200">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">Overview</h2>
              <div
                className="text-lg leading-relaxed prose prose-lg [&>p]:mb-0 [&_p]:text-black [&_strong]:text-black [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: note.excerpt }}
              />
            </div>
          )}

          {/* Main Content */}
          <div
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-200 p-8 md:p-12 
                       prose prose-lg prose-neutral max-w-none
                       [&_p]:text-black [&_p]:font-normal
                       [&_li]:text-black [&_li]:font-normal
                       [&_ol]:text-black [&_ul]:text-black
                       [&_td]:text-black [&_th]:text-black
                       [&_strong]:text-black [&_strong]:font-semibold
                       [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black
                       [&_blockquote]:text-neutral-800
                       prose-headings:font-bold
                       prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                       prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
                       prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2
                       prose-p:leading-relaxed prose-p:mb-4
                       prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                       prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                       prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                       prose-li:my-2
                       prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:pl-6 prose-blockquote:italic
                       prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-lg prose-pre:p-6
                       prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                       prose-table:border-collapse prose-table:w-full
                       prose-th:bg-neutral-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                       prose-td:p-3 prose-td:border-t prose-td:border-neutral-200"
            dangerouslySetInnerHTML={{ __html: note.content || '' }}
          />

          {/* Footer CTA */}
          <div className="mt-12 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-xl p-8 md:p-10 text-center overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Need More Technical Guidance?</h3>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
                Explore our complete library of application notes, or contact our technical support
                team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/application-notes"
                  className="group px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:scale-105 transition-all duration-250 shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    View All Application Notes
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/resources"
                  className="group px-8 py-4 bg-primary-500/50 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-primary-500 hover:scale-105 transition-all duration-250 border-2 border-white/30"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileDown className="w-4 h-4" />
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
