'use client';

import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { useCallback, useEffect } from 'react';

interface DeckContentProps {
  deckId: number;
}

export default function DeckContent({ deckId }: DeckContentProps) {
  const { data } = useDeck(deckId);

  const moxfieldOnMessage = useCallback(e => {
    const t = e.data;
    if ('object' == typeof t && 'moxfield' === t.type) {
      const e = document.getElementById(t.id);
      e && (e.style.height = t.data + 'px');
    }
  }, []);

  const moxfieldOnLoad = useCallback(e => {
    e.target &&
      e.target.contentWindow &&
      e.target.contentWindow.postMessage({ type: 'moxfield', data: e.target.id }, '*');
  }, []);

  useEffect(() => {
    window.addEventListener('message', moxfieldOnMessage);

    return () => {
      window.removeEventListener('message', moxfieldOnMessage);
    };
  }, []);

  if (!data?.serviceDeckId) return null;

  const url = `https://www.moxfield.com/embed/${data?.serviceDeckId}`;

  return (
    <div className="flex flex-col w-full gap-4">
      <iframe
        src={url}
        id="moxfield-frame-1"
        width="100%"
        onLoad={event => moxfieldOnLoad(event)}
      ></iframe>
    </div>
  );
}
