import ContentWFull from '@/components/layout/ContentWFull';
import Events from '@/app/(navbar)/(protected)/your/events/Events';
import EventsLeftNav from '@/app/(navbar)/(protected)/your/events/EventsLeftNav';

export default function YourEvents() {
  return (
    <div className="w-full flex flex-row">
      <EventsLeftNav />
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <Events />
        </main>
      </ContentWFull>
    </div>
  );
}
