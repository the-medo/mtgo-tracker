'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import MatchResultChip from '@/components/app/events/MatchResultChip';
import { getBgColorBasedOnMatchResult } from '@/lib/helpers';
import cn from 'classnames';

interface MatchRowStartProps {
  matchId: number;
  roundNumber?: number;
  itemsCenter?: boolean;
}

const baseClassNames = 'p-4 pt-2 rounded-tl-md rounded-bl-md flex flex-col w-24 h-full';

export default function MatchRowStart({ matchId, roundNumber, itemsCenter }: MatchRowStartProps) {
  const { data: match } = useMatch(matchId);

  const color = getBgColorBasedOnMatchResult(match?.result);

  return (
    <div
      className={cn(baseClassNames, color, {
        'items-center': itemsCenter,
      })}
    >
      {roundNumber ? <div className="text-xs text-default-700">ROUND {roundNumber}</div> : null}
      <MatchResultChip matchId={matchId} />
    </div>
  );
}
