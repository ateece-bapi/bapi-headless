'use client';

import { useEffect } from 'react';

interface UseKeyboardShortcutOptions {
  onTrigger: () => void;
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut({
  onTrigger,
  key,
  ctrlKey = false,
  metaKey = false,
  altKey = false,
  preventDefault = true,
}: UseKeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = ctrlKey ? event.ctrlKey : true;
      const matchesMeta = metaKey ? event.metaKey : true;
      const matchesAlt = altKey ? event.altKey : true;

      // Check if Ctrl or Cmd is pressed when required
      const modifierMatch = (ctrlKey || metaKey) ? (event.ctrlKey || event.metaKey) : true;

      if (matchesKey && matchesCtrl && matchesMeta && matchesAlt && modifierMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger, key, ctrlKey, metaKey, altKey, preventDefault]);
}
