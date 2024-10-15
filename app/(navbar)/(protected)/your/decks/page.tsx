'use client';

import ContentWFull from '@/components/layout/ContentWFull';
import DecksLeftNav from '@/app/(navbar)/(protected)/your/decks/DecksLeftNav';
import Portal from '@/components/app/Portal';
import DecksClient from '@/app/(navbar)/(protected)/your/decks/DecksClient';

export default function YourDecks() {
  return (
    <div className="w-full flex flex-row">
      <Portal targetId="left-menu-portal-target">
        <DecksLeftNav />
      </Portal>
      <ContentWFull>
        <main className="flex flex-col gap-2 md:gap-4">
          <DecksClient />
        </main>
      </ContentWFull>
    </div>
  );
}
