'use client';

import { useMemo } from 'react';
import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchContent from '@/components/app/events/MatchContent';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { getBgColorBasedOnMatchResult, getBorderColorBasedOnMatchResult } from '@/lib/helpers';

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
  const { data: match, isLoading } = useMatch(matchId ?? 0, !matchId);

  const bgColor = useMemo(() => getBgColorBasedOnMatchResult(match?.result), [match?.result]);
  const borderColor = useMemo(
    () => getBorderColorBasedOnMatchResult(match?.result),
    [match?.result],
  );

  return (
    <div
      className={`${matchId ? '' : 'bg-white border-dashed'} p-4 flex flex-col gap-2 border-2 bg-${bgColor} border-${borderColor}`}
    >
      {!matchId ? (
        <EventMatchCreationForm eventId={eventId} eventRound={eventRound} />
      ) : (
        <MatchContent matchId={matchId} eventId={eventId} />
      )}
    </div>
  );
}
