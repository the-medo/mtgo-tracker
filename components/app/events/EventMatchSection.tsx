'use client';

import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchBox from '@/components/app/matches/MatchBox';

interface EventMatchSectionProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
  compact?: boolean;
}

export default function EventMatchSection({
  eventId,
  eventRound,
  matchId,
  compact = false,
}: EventMatchSectionProps) {
  if (matchId) {
    return <MatchBox matchId={matchId} eventId={eventId} smallMatchRow={compact} />;
  }

  return (
    <div className={`bg-background border-dashed p-2 md:p-4 flex flex-col gap-2 border-2`}>
      <EventMatchCreationForm eventId={eventId} eventRound={eventRound} />
    </div>
  );
}
