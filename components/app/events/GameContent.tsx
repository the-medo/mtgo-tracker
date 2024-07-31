'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import HandSizeSelector from '@/components/form/HandSizeSelector';
import OnThePlaySelector from '@/components/form/OnThePlaySelector';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { useCallback } from 'react';
import { MatchResult } from '@prisma/client';
import { useGame } from '@/app/api/game/[id]/getGame';

interface GameContentProps {
  matchId: number;
  gameId: number;
}

export default function GameContent({ matchId, gameId }: GameContentProps) {
  const { data: game, isLoading } = useGame(gameId);
  const { mutate: patchGame, isPending } = useSimplePatch(QK.GAME);

  const startingHandChangeHandler = useCallback(
    (value: number) => {
      patchGame({
        id: gameId,
        field: 'startingHand',
        value: value,
      });
    },
    [patchGame, gameId],
  );

  const oppStartingHandChangeHandler = useCallback(
    (value: number) => {
      patchGame({
        id: gameId,
        field: 'oppStartingHand',
        value: value,
      });
    },
    [patchGame, gameId],
  );

  const isOnPlayChangeHandler = useCallback(
    (value: boolean) => {
      patchGame({
        id: gameId,
        field: 'isOnPlay',
        value: value,
      });
    },
    [patchGame, gameId],
  );

  return (
    <div className="flex flex-col w-full gap-4">
      <Title title={`Game ${game?.gameNumber}`} />
      <span>Your starting hand: </span>
      <HandSizeSelector
        value={game?.startingHand ?? undefined}
        onValueChange={startingHandChangeHandler}
      />
      <span>Opp. starting hand: </span>
      <HandSizeSelector
        value={game?.oppStartingHand ?? undefined}
        onValueChange={oppStartingHandChangeHandler}
      />

      <OnThePlaySelector
        value={game?.isOnPlay ?? undefined}
        onValueChange={isOnPlayChangeHandler}
      />
    </div>
  );
}
