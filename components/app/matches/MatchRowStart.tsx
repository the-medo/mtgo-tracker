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
  insideAnotherBox?: boolean;
}

const baseClassNames = 'pt-2 rounded-tl-md rounded-bl-md flex flex-col h-full grow-0 shrink-0';

export default function MatchRowStart({
  matchId,
  roundNumber,
  itemsCenter,
  compact,
  insideAnotherBox,
}: MatchRowStartProps) {
  const { data: match } = useMatch(matchId);

  const color = getBgColorBasedOnMatchResult(match?.result);

  return (
    <div
      className={cn(baseClassNames, color, {
        'items-center': itemsCenter,
        'p-4': !compact,
        'p-2': compact,
        'w-24': !insideAnotherBox,
        'w-16': insideAnotherBox,
      })}
    >
      {roundNumber && !compact ? (
        <div className="text-xs text-default-700">ROUND {roundNumber}</div>
      ) : null}
      <MatchResultChip matchId={matchId} size={insideAnotherBox ? 'sm' : 'lg'} />
    </div>
  );
}
