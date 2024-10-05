'use client';

import ContentWFull from '@/components/layout/ContentWFull';
import EventsLeftNav from '@/app/(navbar)/(protected)/your/events/EventsLeftNav';
import EventsClient from '@/app/(navbar)/(protected)/your/events/EventsClient';
import Portal from '@/components/app/Portal';

export default function YourEvents() {
  return (
    <div className="w-full flex flex-row">
      <Portal targetId="left-menu-portal-target">
        <EventsLeftNav />
      </Portal>
      <ContentWFull>
        <main className="flex flex-col gap-2 md:gap-4">
          <EventsClient />
        </main>
      </ContentWFull>
    </div>
  );
}
