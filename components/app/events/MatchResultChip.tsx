'use client';

import { useMemo } from 'react';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { Chip } from '@nextui-org/chip';
import { getChipColorBasedOnMatchResult } from '@/lib/helpers';
import { MatchResult } from '@prisma/client';

interface MatchResultChipProps {
  matchId: number;
}

export default function MatchResultChip({ matchId }: MatchResultChipProps) {
  const { data: match, isLoading } = useMatch(matchId);

  const chipColor = useMemo(() => getChipColorBasedOnMatchResult(match?.result), [match?.result]);

  const gameResults = useMemo(() => {
    const results = {
      wins: 0,
      loses: 0,
      draws: 0,
    };
    match?.Games.forEach(g => {
      if (g.result === MatchResult.WIN) {
        results.wins++;
      } else if (g.result === MatchResult.LOSE) {
        results.loses++;
      } else if (g.result === MatchResult.DRAW) {
        results.draws++;
      }
    });

    return results;
  }, [match?.Games]);

  return (
    <Chip size="lg" radius="sm" variant="solid" color={chipColor}>
      {gameResults.wins}-{gameResults.loses}
      {gameResults.draws ? `-${gameResults.draws}` : ''}
    </Chip>
  );
}
