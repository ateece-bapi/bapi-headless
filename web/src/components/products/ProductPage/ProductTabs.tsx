
"use client";
import React, { useState } from 'react';

interface ProductTabsProps {
  product: {
    description?: string | null;
    documents?: Array<{ title: string; url: string }>;
    videos?: Array<{ title: string; url: string }>;
  };
}

const TAB_LIST = ["Description", "Documents", "Videos"] as const;
type TabType = typeof TAB_LIST[number];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Description");

  return (
    <section className="mb-8">
      <div className="border-b border-neutral-200 mb-4">
        <nav className="flex gap-4" role="tablist">
          {TAB_LIST.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              className={`font-semibold pb-2 transition border-b-2 ${activeTab === tab ? 'text-primary-700 border-primary-700' : 'text-neutral-500 border-transparent hover:text-primary-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="text-neutral-700" role="tabpanel" id={`tabpanel-${activeTab}`}> 
        {activeTab === "Description" && (
          <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
        )}
        {activeTab === "Documents" && (
          <div>
            {product.documents && product.documents.length > 0 ? (
              <ul className="list-disc pl-6">
                {product.documents.map((doc, idx) => (
                  <li key={doc.url + idx}>
                    <a href={doc.url} target="_blank" rel="noopener" className="text-primary-700 underline">{doc.title}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No documents available.</div>
            )}
          </div>
        )}
        {activeTab === "Videos" && (
          <div>
            {product.videos && product.videos.length > 0 ? (
              <ul className="list-disc pl-6">
                {product.videos.map((vid, idx) => (
                  <li key={vid.url + idx}>
                    <a href={vid.url} target="_blank" rel="noopener" className="text-primary-700 underline">{vid.title}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No videos available.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
