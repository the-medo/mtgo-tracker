import ContentWFull from '@/components/layout/ContentWFull';
import EventLeftNav from '@/app/(navbar)/(protected)/your/events/[id]/EventLeftNav';
import EventContent from '@/app/(navbar)/(protected)/your/events/[id]/EventContent';

export default function EventPage({ params }: { params: { id: number } }) {
  return (
    <div className="w-full flex flex-row">
      <EventLeftNav eventId={params.id} />
      <ContentWFull>
        <main className="flex flex-col gap-4">
          <EventContent eventId={params.id} />
        </main>
      </ContentWFull>
    </div>
  );
}
