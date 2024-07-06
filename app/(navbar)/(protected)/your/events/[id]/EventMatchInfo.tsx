'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import EventMatchTitle from '@/components/app/events/EventMatchTitle';

interface EventMatchInfoProps {
  eventId: number;
  matchNumber?: number;
}

export default function EventMatchInfo({ eventId, matchNumber }: EventMatchInfoProps) {
  const { data } = useEvent(eventId);

  return <EventMatchTitle eventId={eventId} eventRound={matchNumber} />;
}
