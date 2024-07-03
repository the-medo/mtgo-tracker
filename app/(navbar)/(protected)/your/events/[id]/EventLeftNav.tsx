'use client';

import EventInfo from '@/app/(navbar)/(protected)/your/events/[id]/EventInfo';

interface EventLeftNavProps {
  eventId: number;
}

export default function EventLeftNav({ eventId }: EventLeftNavProps) {
  return (
    <div className="p-4 w-[330px] border-r-1 flex flex-col gap-4">
      <EventInfo eventId={eventId} />
    </div>
  );
}
