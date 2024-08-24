'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import MatchResultChip from '@/components/app/matches/MatchResultChip';
import { getBgColorBasedOnMatchResult } from '@/lib/helpers';
import cn from 'classnames';

interface MatchRowStartProps {
  matchId: number;
  roundNumber?: number;
  itemsCenter?: boolean;
  compact?: boolean;
}

const baseClassNames = 'pt-2 rounded-tl-md rounded-bl-md flex flex-col w-24 h-full';

export default function MatchRowStart({
  matchId,
  roundNumber,
  itemsCenter,
  compact,
}: MatchRowStartProps) {
  const { data: match } = useMatch(matchId);

  const color = getBgColorBasedOnMatchResult(match?.result);

  return (
    <div
      className={cn(baseClassNames, color, {
        'items-center': itemsCenter,
        'p-4': !compact,
        'p-2': compact,
      })}
    >
      {roundNumber && !compact ? (
        <div className="text-xs text-default-700">ROUND {roundNumber}</div>
      ) : null}
      <MatchResultChip matchId={matchId} />
    </div>
  );
}
