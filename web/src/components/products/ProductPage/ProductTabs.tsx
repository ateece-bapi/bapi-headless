'use client';
import React, { useState } from 'react';
import { FileText, Video, BookOpen, Download, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import logger from '@/lib/logger';
import { sanitizeDescription } from '@/lib/sanitizeDescription';

interface ProductTabsProps {
  product: {
    description?: string | null;
    documents?: Array<{ title: string; url: string; category?: string }>;
    videos?: Array<{ title: string; url: string }>;
    specifications?: any;
  };
}

const TAB_LIST = [
  { key: 'description', labelKey: 'productPage.tabs.description', icon: BookOpen },
  { key: 'documents', labelKey: 'productPage.tabs.documents', icon: FileText },
  { key: 'videos', labelKey: 'productPage.tabs.videos', icon: Video },
] as const;

type TabType = (typeof TAB_LIST)[number]['key'];

export default function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabType>('description');

  // Debug: Log what data we're receiving
  React.useEffect(() => {
    logger.debug('[ProductTabs] Received product data', {
      hasDescription: !!product.description,
      descriptionLength: product.description?.length || 0,
      documentsCount: product.documents?.length || 0,
      videosCount: product.videos?.length || 0,
      documents: product.documents,
      videos: product.videos,
    });
  }, [product]);
  return (
    <section className="mb-12 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Professional Tab Navigation */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <nav className="flex" role="tablist">
          {TAB_LIST.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                className={`relative flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition-all ${
                  isActive
                    ? 'border-primary-700 bg-white text-primary-700'
                    : 'border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-primary-600'
                } `}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
                <span className="sm:hidden">{t(tab.labelKey).split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <div className="p-8" role="tabpanel" id={`tabpanel-${activeTab}`}>
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="px-2 py-6">
            {product.description ? (
              <div
                className="**:text-neutral-900 prose prose-lg prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900 prose-h1:mb-10 prose-h1:mt-0 prose-h1:text-4xl prose-h1:leading-tight prose-h2:mb-8 prose-h2:mt-12 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:text-2xl prose-h3:mb-6 prose-h3:mt-10 prose-h3:text-xl prose-p:mb-8 prose-p:leading-relaxed prose-p:text-neutral-900 prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed prose-p:first-of-type:text-neutral-800 prose-a:font-medium prose-a:text-primary-600 prose-a:no-underline prose-a:transition-all hover:prose-a:text-primary-700 hover:prose-a:underline hover:prose-a:underline-offset-4 prose-strong:font-bold prose-strong:text-neutral-900 prose-ol:my-8 prose-ol:space-y-4 prose-ol:pl-6 prose-ul:my-8 prose-ul:space-y-4 prose-ul:pl-6 prose-li:leading-relaxed prose-li:text-neutral-900 prose-li:marker:text-primary-500"
                dangerouslySetInnerHTML={{ __html: sanitizeDescription(product.description) }}
              />
            ) : (
              <div className="py-16 text-center text-neutral-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                    <BookOpen className="h-8 w-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-semibold text-neutral-700">
                      No Description Available
                    </p>
                    <p className="text-sm text-neutral-500">
                      {t('productPage.tabs.descriptionPlaceholder')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            {product.documents && product.documents.length > 0 ? (
              <div className="space-y-8">
                {/* Group documents by category */}
                {Object.entries(
                  product.documents.reduce(
                    (acc, doc) => {
                      const category = doc.category || 'Documents';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(doc);
                      return acc;
                    },
                    {} as Record<string, typeof product.documents>
                  )
                ).map(([category, docs]) => (
                  <div key={category}>
                    <div className="mb-4 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary-600" />
                      <h3 className="text-xl font-bold text-neutral-900">{category}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {docs.map((doc, idx) => (
                        <a
                          key={doc.url + idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 rounded-lg border-2 border-neutral-200 p-4 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 transition-colors group-hover:bg-primary-200">
                              <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
                                {doc.title}
                              </p>
                              <p className="text-sm text-neutral-500">PDF Document</p>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-colors group-hover:text-primary-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500">
                <FileText className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                <p className="mb-2 font-medium">{t('productPage.tabs.noDocumentsAvailable')}</p>
                <p className="text-sm">
                  Specification documents will be displayed here when available.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="px-2 py-6">
            {product.videos && product.videos.length > 0 ? (
              <div className="space-y-8">
                {product.videos.map((vid, idx) => {
                  // Extract YouTube video ID from URL
                  const getYouTubeId = (url: string) => {
                    const match = url.match(
                      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/
                    );
                    return match?.[1];
                  };

                  const videoId = getYouTubeId(vid.url);

                  return (
                    <div key={vid.url + idx} className="group">
                      {vid.title && (
                        <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-neutral-900">
                          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-primary-500 to-primary-700" />
                          {vid.title}
                        </h3>
                      )}

                      {videoId ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-neutral-200 shadow-2xl transition-all duration-300 group-hover:border-primary-300">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={vid.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        </div>
                      ) : (
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center justify-between gap-4 rounded-xl border-2 border-neutral-200 p-6 shadow-sm transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent hover:shadow-lg"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md transition-transform group-hover/link:scale-110">
                              <Video className="h-7 w-7 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-lg font-bold text-neutral-900 transition-colors group-hover/link:text-primary-700">
                                {vid.title}
                              </p>
                              <p className="mt-1 text-sm text-neutral-500">Click to watch video</p>
                            </div>
                          </div>
                          <ExternalLink className="h-6 w-6 shrink-0 text-neutral-400 transition-colors group-hover/link:text-primary-600" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto flex max-w-md flex-col items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <Video className="h-10 w-10 text-neutral-400" />
                  </div>
                  <div>
                    <p className="mb-2 text-xl font-bold text-neutral-700">
                      {t('productPage.tabs.noVideosAvailable')}
                    </p>
                    <p className="leading-relaxed text-neutral-500">
                      Product videos and tutorials will be displayed here when available. Check back
                      soon for helpful video content about this product.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
