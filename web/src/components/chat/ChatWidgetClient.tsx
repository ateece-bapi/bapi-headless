'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side dynamic import wrapper for ChatWidget
 * 
 * Reduces initial bundle size by lazy-loading the chat widget.
 * Only loads when client-side rendering is active.
 */
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
  loading: () => null,
});

export default function ChatWidgetClient() {
  return <ChatWidget />;
}
