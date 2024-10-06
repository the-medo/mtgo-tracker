'use client';

import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { ReactEventHandler, useCallback, useEffect } from 'react';
import useStore from '@/store/store';
import DeckInfo from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';

interface DeckContentProps {
  deckId: number;
}

export default function DeckContent({ deckId }: DeckContentProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const compact = ['xs', 'sm'].includes(breakpoint);
  const { data } = useDeck(deckId);

  const moxfieldOnMessage = useCallback((e: MessageEvent) => {
    const t = e.data;
    if ('object' == typeof t && 'moxfield' === t.type) {
      const e = document.getElementById(t.id);
      e && (e.style.height = t.data + 'px');
    }
  }, []);

  const moxfieldOnLoad: ReactEventHandler<HTMLIFrameElement> = useCallback(e => {
    e.target &&
      // @ts-ignore
      e.target.contentWindow &&
      // @ts-ignore
      e.target.contentWindow.postMessage({ type: 'moxfield', data: e.target.id }, '*');
  }, []);

  useEffect(() => {
    window.addEventListener('message', moxfieldOnMessage);

    return () => {
      window.removeEventListener('message', moxfieldOnMessage);
    };
  }, [moxfieldOnMessage]);

  if (!data?.serviceDeckId) return null;

  const url = `https://www.moxfield.com/embed/${data?.serviceDeckId}`;

  return (
    <div className="flex flex-col w-full gap-2 md:gap-4">
      {compact ? (
        <>
          <DeckInfo deckId={deckId} compact />
          <hr />
        </>
      ) : null}
      <iframe src={url} id="moxfield-frame-1" width="100%" onLoad={moxfieldOnLoad}></iframe>
    </div>
  );
}
