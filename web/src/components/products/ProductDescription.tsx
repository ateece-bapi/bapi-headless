'use client';

import { useEffect, useRef } from 'react';

type ProductDescriptionProps = {
  description: string;
};

/**
 * Product Description Component
 * 
 * Renders WordPress HTML content and intercepts SharePoint download links
 * to trigger direct downloads instead of showing SharePoint intermediate page.
 */
export function ProductDescription({ description }: ProductDescriptionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all links in the description
    const links = containerRef.current.querySelectorAll('a');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      
      // Check if it's a SharePoint/OneDrive link
      if (href && (
        href.includes('sharepoint.com') ||
        href.includes('1drv.ms') ||
        href.includes('.sharepoint.') ||
        href.includes('onedrive.live.com')
      )) {
        // Add download attribute to force download
        link.setAttribute('download', '');
        
        // Convert SharePoint link to direct download
        // SharePoint URLs can be converted by adding ?download=1
        try {
          const url = new URL(href);
          
          // For SharePoint, add download parameter
          if (!url.searchParams.has('download')) {
            url.searchParams.set('download', '1');
            link.setAttribute('href', url.toString());
          }
        } catch (error) {
          console.warn('Could not parse SharePoint URL:', href);
        }

        // Add visual indicator for download links
        if (!link.querySelector('.download-indicator')) {
          link.classList.add('inline-flex', 'items-center', 'gap-2');
          
          // Add download icon if button doesn't already have content
          const hasIcon = link.querySelector('svg, img, [class*="icon"]');
          if (!hasIcon) {
            const icon = document.createElement('svg');
            icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            icon.setAttribute('width', '16');
            icon.setAttribute('height', '16');
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2');
            icon.setAttribute('stroke-linecap', 'round');
            icon.setAttribute('stroke-linejoin', 'round');
            icon.setAttribute('class', 'download-indicator');
            icon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
            link.appendChild(icon);
          }
        }
      }
    });
  }, [description]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}
