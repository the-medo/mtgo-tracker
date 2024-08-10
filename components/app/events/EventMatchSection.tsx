'use client';

import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchContent from '@/components/app/events/MatchContent';
import { MatchResult } from '@prisma/client';

interface EventMatchSectionProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
  matchResult?: MatchResult | null;
}

export default function EventMatchSection({
  eventId,
  eventRound,
  matchId,
  matchResult,
}: EventMatchSectionProps) {
  if (matchId) {
    return <MatchContent matchId={matchId} eventId={eventId} matchResult={matchResult} />;
  }

  return (
    <div className={`bg-white border-dashed p-4 flex flex-col gap-2 border-2`}>
      <EventMatchCreationForm eventId={eventId} eventRound={eventRound} />
    </div>
  );
}
