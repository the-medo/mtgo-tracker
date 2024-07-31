'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import EventMatchSection from '@/components/app/events/EventMatchSection';

interface EventMatchInfoProps {
  eventId: number;
  matchNumber?: number;
}

export default function EventMatchInfo({ eventId, matchNumber }: EventMatchInfoProps) {
  const { data } = useEvent(eventId);

  return <EventMatchSection eventId={eventId} eventRound={matchNumber} />;
}
