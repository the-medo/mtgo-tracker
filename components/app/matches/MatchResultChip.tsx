'use client';

import { useMemo } from 'react';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { Chip, ChipProps } from '@nextui-org/chip';
import { getChipColorBasedOnMatchResult } from '@/lib/helpers';
import { MatchResult } from '@prisma/client';

interface MatchResultChipProps {
  matchId: number;
  size?: ChipProps['size'];
}

export default function MatchResultChip({ matchId, size = 'lg' }: MatchResultChipProps) {
  const { data: match, isLoading } = useMatch(matchId);

  const chipColor = useMemo(() => getChipColorBasedOnMatchResult(match?.result), [match?.result]);

  const gameResults = useMemo(() => {
    const results = {
      wins: 0,
      losses: 0,
      draws: 0,
    };
    match?.Games.forEach(g => {
      if (g.result === MatchResult.WIN) {
        results.wins++;
      } else if (g.result === MatchResult.LOSE) {
        results.losses++;
      } else if (g.result === MatchResult.DRAW) {
        results.draws++;
      }
    });

    return results;
  }, [match?.Games]);

  return (
    <Chip size={size} radius="sm" variant="solid" color={chipColor}>
      {gameResults.wins}-{gameResults.losses}
      {gameResults.draws ? `-${gameResults.draws}` : ''}
    </Chip>
  );
}
