'use client';
import React, { useState, useMemo } from 'react';
import { FileTextIcon, VideoIcon, ExternalLinkIcon } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import logger from '@/lib/logger';
import YouTubeEmbed from '@/components/shared/YouTubeEmbed';
import { extractYouTubeId } from '@/lib/youtube/client';
import { getProductVideos } from '@/lib/productVideos';

/**
 * Decode HTML entities universally (works on server and client)
 * Prevents React hydration mismatches by using deterministic decoding
 * Common entities: &#8220; ("), &#8221; ("), &#8216; ('), &#8217; ('), etc.
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  // Map of common HTML numeric entities
  const numericEntities: Record<string, string> = {
    '8220': '"', // left double quote
    '8221': '"', // right double quote  
    '8216': "'", // left single quote
    '8217': "'", // right single quote
    '8211': '–', // en dash
    '8212': '—', // em dash
    '38': '&',
    '60': '<',
    '62': '>',
    '34': '"',
    '39': "'",
  };
  
  // Replace numeric entities (&#XXXX;)
  let decoded = text.replace(/&#(\d+);/g, (match, code) => {
    const mappedEntity = numericEntities[code];
    if (mappedEntity) {
      return mappedEntity;
    }

    const codePoint = parseInt(code, 10);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
      return match;
    }

    return String.fromCodePoint(codePoint);
  });
  
  // Replace common named entities
  decoded = decoded
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&'); // Must be last to avoid double-decoding
  
  return decoded;
}

interface ProductTabsProps {
  product: {
    sku?: string | null;
    databaseId?: number | null;
    description?: string | null;
    documents?: Array<{ title: string; url: string; category?: string }>;
    videos?: Array<{ title: string; url: string }>;
    specifications?: any;
  };
}

const TAB_LIST = [
  { key: 'documents', labelKey: 'productPage.tabs.documents', icon: FileTextIcon },
  { key: 'videos', labelKey: 'productPage.tabs.videos', icon: VideoIcon },
] as const;

type TabType = (typeof TAB_LIST)[number]['key'];

export default function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations();
  
  // Load videos from JSON by SKU or database ID
  const jsonVideos = useMemo(() => {
    const productId = product.databaseId?.toString();
    return getProductVideos(product.sku, productId);
  }, [product.sku, product.databaseId]);

  // Merge JSON videos with any legacy videos from GraphQL (for backward compatibility)
  const allVideos = useMemo(() => {
    const videos = [...jsonVideos.map(v => ({ title: v.title, url: v.url }))];
    
    // Add any legacy videos that aren't already included
    if (product.videos) {
      for (const legacyVideo of product.videos) {
        if (!videos.some(v => v.url === legacyVideo.url)) {
          videos.push(legacyVideo);
        }
      }
    }
    
    return videos;
  }, [jsonVideos, product.videos]);
  
  const [activeTab, setActiveTab] = useState<TabType>('documents');

  // Debug: Log what data we're receiving
  React.useEffect(() => {
    logger.debug('[ProductTabs] Received product data', {
      sku: product.sku,
      databaseId: product.databaseId,
      hasDescription: !!product.description,
      descriptionLength: product.description?.length || 0,
      documentsCount: product.documents?.length || 0,
      legacyVideosCount: product.videos?.length || 0,
      jsonVideosCount: jsonVideos.length,
      totalVideosCount: allVideos.length,
      documents: product.documents,
      legacyVideos: product.videos,
      jsonVideos,
      allVideos,
    });
  }, [product, jsonVideos, allVideos]);
  return (
    <section id="product-tabs" className="mb-12 overflow-hidden rounded-xl border border-neutral-200 bg-white">
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
                data-tab-id={tab.key}
                aria-selected={isActive}
                aria-controls={isActive ? 'product-tabpanel' : undefined}
                tabIndex={isActive ? 0 : -1}
                className={`relative flex items-center gap-2 border-b-2 px-6 py-4 font-semibold transition-all ${
                  isActive
                    ? 'border-primary-700 bg-white text-primary-700'
                    : 'border-transparent text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
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
      <div className="p-8" role="tabpanel" id="product-tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            {product.documents && product.documents.length > 0 ? (
              <div className="space-y-8">
                {/* Group documents by category */}
                {Object.entries(
                  product.documents
                    // Filter out documents with empty title AND empty URL (circular references)
                    .filter((doc) => doc.title || doc.url)
                    .reduce(
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
                      <FileTextIcon className="h-6 w-6 text-primary-600" />
                      <h3 className="text-xl font-bold text-neutral-900">{decodeHtmlEntities(category)}</h3>
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
                              <FileTextIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
                                {decodeHtmlEntities(doc.title)}
                              </p>
                              <p className="text-sm text-neutral-700">PDF Document</p>
                            </div>
                          </div>
                          <ExternalLinkIcon className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-colors group-hover:text-primary-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-700">
                <FileTextIcon className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
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
            {allVideos && allVideos.length > 0 ? (
              <div className="space-y-8">
                {allVideos.map((vid, idx) => {
                  // Extract YouTube video ID from URL
                  const videoId = extractYouTubeId(vid.url);

                  return (
                    <div key={vid.url + idx} className="group">
                      {vid.title && (
                        <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-neutral-900">
                          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-primary-500 to-primary-700" />
                          {decodeHtmlEntities(vid.title)}
                        </h3>
                      )}

                      {/* Video container with max-width for optimal viewing */}
                      <div className="mx-auto max-w-4xl">
                        {videoId ? (
                          <YouTubeEmbed
                            videoId={videoId}
                            title={decodeHtmlEntities(vid.title)}
                            className="shadow-2xl transition-all duration-300 group-hover:shadow-3xl"
                          />
                          ) : (
                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center justify-between gap-4 rounded-xl border-2 border-neutral-200 p-6 shadow-sm transition-all duration-300 hover:border-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent hover:shadow-lg"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md transition-transform group-hover/link:scale-110">
                                <VideoIcon className="h-7 w-7 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-lg font-bold text-neutral-900 transition-colors group-hover/link:text-primary-700">
                                  {decodeHtmlEntities(vid.title)}
                                </p>
                                <p className="mt-1 text-sm text-neutral-700">Click to watch video</p>
                              </div>
                            </div>
                            <ExternalLinkIcon className="h-6 w-6 shrink-0 text-neutral-400 transition-colors group-hover/link:text-primary-600" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto flex max-w-md flex-col items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200">
                    <VideoIcon className="h-10 w-10 text-neutral-400" />
                  </div>
                  <div>
                    <p className="mb-2 text-xl font-bold text-neutral-700">
                      {t('productPage.tabs.noVideosAvailable')}
                    </p>
                    <p className="leading-relaxed text-neutral-700">
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
