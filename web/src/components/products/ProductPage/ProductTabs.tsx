'use client';
import React, { useState } from 'react';

interface ProductTabsProps {
  product: {
    description?: string;
    documents?: Array<{ name: string; url: string }>;
    videos?: Array<{ title: string; url: string }>;
  };
}

const TABS = ["Description", "Documents", "Videos"];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="border-b border-neutral-200 mb-8 flex gap-8 overflow-x-auto" role="tablist" aria-label="Product Information Tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`pb-3 text-lg font-semibold border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 whitespace-nowrap
              ${activeTab === tab ? 'border-primary-700 text-primary-700 bg-primary-50' : 'border-transparent text-neutral-600 hover:text-primary-700'}`}
            onClick={() => setActiveTab(tab)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6 md:p-8 min-h-[180px]" id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={activeTab}>
        {activeTab === "Description" && (
          <div className="prose max-w-none text-neutral-900" dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />
        )}
        {activeTab === "Documents" && (
          <div>
            {product.documents && product.documents.length > 0 ? (
              <ul className="list-disc pl-6">
                {product.documents.map(doc => (
                  <li key={doc.url}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline font-medium hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded">{doc.name}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-700">No documents available.</p>
            )}
          </div>
        )}
        {activeTab === "Videos" && (
          <div className="grid gap-6 md:grid-cols-2">
            {product.videos && product.videos.length > 0 ? (
              product.videos.map(video => (
                <div key={video.url} className="aspect-video bg-neutral-100 rounded overflow-hidden">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ))
            ) : (
              <p className="text-neutral-700">No videos available.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
