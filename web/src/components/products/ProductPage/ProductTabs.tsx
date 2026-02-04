
"use client";
import React, { useState } from 'react';
import { FileText, Video, BookOpen, Download, ExternalLink } from 'lucide-react';
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
  { key: "description", label: "Description", icon: BookOpen },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "videos", label: "Videos", icon: Video }
] as const;

type TabType = typeof TAB_LIST[number]["key"];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // Debug: Log what data we're receiving
  React.useEffect(() => {
    logger.debug('[ProductTabs] Received product data', {
      hasDescription: !!product.description,
      descriptionLength: product.description?.length || 0,
      documentsCount: product.documents?.length || 0,
      videosCount: product.videos?.length || 0,
      documents: product.documents,
      videos: product.videos
    });
  }, [product]);
  return (
    <section className="mb-12 bg-white rounded-xl border border-neutral-200 overflow-hidden">
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
                className={`
                  flex items-center gap-2 px-6 py-4 font-semibold transition-all
                  border-b-2 relative
                  ${isActive 
                    ? 'text-primary-700 border-primary-700 bg-white' 
                    : 'text-neutral-600 border-transparent hover:text-primary-600 hover:bg-neutral-100'
                  }
                `}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <div className="p-8" role="tabpanel" id={`tabpanel-${activeTab}`}>
        
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="py-6 px-2">
            {product.description ? (
              <div 
                className="
                  prose prose-lg prose-neutral max-w-none
                  prose-headings:font-bold prose-headings:text-neutral-900 prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-10 prose-h1:mt-0 prose-h1:leading-tight
                  prose-h2:text-2xl prose-h2:mb-8 prose-h2:mt-12 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:mb-6 prose-h3:mt-10
                  prose-p:text-neutral-900 prose-p:leading-relaxed prose-p:mb-8
                  prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed prose-p:first-of-type:text-neutral-800
                  prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline prose-a:transition-all
                  hover:prose-a:text-primary-700 hover:prose-a:underline hover:prose-a:underline-offset-4
                  prose-strong:text-neutral-900 prose-strong:font-bold
                  prose-ul:my-8 prose-ul:space-y-4 prose-ul:pl-6
                  prose-ol:my-8 prose-ol:space-y-4 prose-ol:pl-6
                  prose-li:text-neutral-900 prose-li:leading-relaxed prose-li:marker:text-primary-500
                  **:text-neutral-900
                "
                dangerouslySetInnerHTML={{ __html: sanitizeDescription(product.description) }} 
              />
            ) : (
              <div className="text-center py-16 text-neutral-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-neutral-700 mb-1">No Description Available</p>
                    <p className="text-sm text-neutral-500">Product description will appear here when available.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            {product.documents && product.documents.length > 0 ? (
              <div className="space-y-8">
                {/* Group documents by category */}
                {Object.entries(
                  product.documents.reduce((acc, doc) => {
                    const category = doc.category || 'Documents';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(doc);
                    return acc;
                  }, {} as Record<string, typeof product.documents>)
                ).map(([category, docs]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-6 h-6 text-primary-600" />
                      <h3 className="text-xl font-bold text-neutral-900">{category}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {docs.map((doc, idx) => (
                        <a
                          key={doc.url + idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            group flex items-center justify-between gap-4 
                            p-4 rounded-lg border-2 border-neutral-200 
                            hover:border-primary-500 hover:bg-primary-50 
                            transition-all duration-200
                          "
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                              <FileText className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors truncate">
                                {doc.title}
                              </p>
                              <p className="text-sm text-neutral-500">PDF Document</p>
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                <p className="font-medium mb-2">No specifications available</p>
                <p className="text-sm">Specification documents will be displayed here when available.</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="py-6 px-2">
            {product.videos && product.videos.length > 0 ? (
              <div className="space-y-8">
                {product.videos.map((vid, idx) => {
                  // Extract YouTube video ID from URL
                  const getYouTubeId = (url: string) => {
                    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/);
                    return match?.[1];
                  };
                  
                  const videoId = getYouTubeId(vid.url);
                  
                  return (
                    <div key={vid.url + idx} className="group">
                      {vid.title && (
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full" />
                          {vid.title}
                        </h3>
                      )}
                      
                      {videoId ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl border-2 border-neutral-200 group-hover:border-primary-300 transition-all duration-300">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={vid.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            group/link flex items-center justify-between gap-4 
                            p-6 rounded-xl border-2 border-neutral-200 
                            hover:border-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent
                            transition-all duration-300 shadow-sm hover:shadow-lg
                          "
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center group-hover/link:scale-110 transition-transform shadow-md">
                              <Video className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-lg text-neutral-900 group-hover/link:text-primary-700 transition-colors truncate">
                                {vid.title}
                              </p>
                              <p className="text-sm text-neutral-500 mt-1">Click to watch video</p>
                            </div>
                          </div>
                          <ExternalLink className="w-6 h-6 text-neutral-400 group-hover/link:text-primary-600 transition-colors shrink-0" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center">
                    <Video className="w-10 h-10 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-neutral-700 mb-2">No Videos Available</p>
                    <p className="text-neutral-500 leading-relaxed">
                      Product videos and tutorials will be displayed here when available. Check back soon for helpful video content about this product.
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
