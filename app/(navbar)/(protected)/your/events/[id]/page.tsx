import ContentWFull from '@/components/layout/ContentWFull';
import EventLeftNav from '@/app/(navbar)/(protected)/your/events/[id]/EventLeftNav';
import EventContent from '@/app/(navbar)/(protected)/your/events/[id]/EventContent';
import Portal from '@/components/app/Portal';

export default function EventPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);

  return (
    <div className="w-full flex flex-row">
      <Portal targetId="left-menu-portal-target">
        <EventLeftNav eventId={eventId} />
      </Portal>
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <EventContent eventId={eventId} />
        </main>
      </ContentWFull>
    </div>
  );
}
