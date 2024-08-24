'use client';

import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchContent from '@/components/app/matches/MatchContent';
import { MatchResult } from '@prisma/client';

interface EventMatchSectionProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
}

export default function EventMatchSection({
  eventId,
  eventRound,
  matchId,
}: EventMatchSectionProps) {
  if (matchId) {
    return <MatchContent matchId={matchId} eventId={eventId} />;
  }

  return (
    <div className={`bg-white border-dashed p-4 flex flex-col gap-2 border-2`}>
      <EventMatchCreationForm eventId={eventId} eventRound={eventRound} />
    </div>
  );
}
