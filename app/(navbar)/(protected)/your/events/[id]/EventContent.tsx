'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';

interface EventContentProps {
  eventId: number;
}

export default function EventContent({ eventId }: EventContentProps) {
  const { data } = useEvent(eventId);

  return <div className="flex flex-col w-full gap-4"></div>;
}
