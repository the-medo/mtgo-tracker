'use client';

import { useMemo } from 'react';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { Chip } from '@nextui-org/chip';
import { getChipColorBasedOnMatchResult } from '@/lib/helpers';
import { MatchResult } from '@prisma/client';
import { useEvent } from '@/app/api/event/[id]/getEvent';

interface EventResultChipProps {
  eventId: number;
}

export default function EventResultChip({ eventId }: EventResultChipProps) {
  const { data: event, isLoading } = useEvent(eventId);

  const chipColor = 'default';

  const matchResults = useMemo(() => {
    const results = {
      wins: 0,
      loses: 0,
      draws: 0,
    };

    event?.Matches.forEach(m => {
      if (m.result === MatchResult.WIN) {
        results.wins++;
      } else if (m.result === MatchResult.LOSE) {
        results.loses++;
      } else if (m.result === MatchResult.DRAW) {
        results.draws++;
      }
    });

    return results;
  }, [event?.Matches]);

  return (
    <Chip size="lg" radius="sm" variant="solid" color={chipColor}>
      {matchResults.wins}-{matchResults.loses}
      {matchResults.draws ? `-${matchResults.draws}` : ''}
    </Chip>
  );
}
