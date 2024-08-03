'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import HandSizeSelector from '@/components/form/HandSizeSelector';
import OnThePlaySelector from '@/components/form/OnThePlaySelector';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { useCallback, useMemo, useState } from 'react';
import { MatchResult } from '@prisma/client';
import { useGame } from '@/app/api/game/[id]/getGame';
import ResultSelector from '@/components/form/ResultSelector';
import { Chip, ChipProps } from '@nextui-org/chip';
import { TbCards, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';

interface GameContentProps {
  matchId: number;
  gameId: number;
}

export default function GameContent({ matchId, gameId }: GameContentProps) {
  const { data: game, isLoading } = useGame(gameId);
  const { mutate: patchGame, isPending } = useSimplePatch(QK.GAME);
  const [editMode, setEditMode] = useState<boolean>(false);

  const gameResult = game?.result ?? undefined;

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

  const resultChangeHandler = useCallback(
    (value: MatchResult | undefined) => {
      patchGame({
        id: gameId,
        field: 'result',
        value: value ? value.toString() : null,
      });
    },
    [patchGame, gameId],
  );

  const color: ChipProps['color'] = useMemo(() => {
    switch (game?.result) {
      case MatchResult.WIN:
        return 'success';
      case MatchResult.LOSE:
        return 'danger';
      case MatchResult.DRAW:
        return 'warning';
      default:
        return 'default';
    }
  }, [game?.result]);

  const content = useMemo(() => {
    if (editMode) {
      return (
        <>
          <div className={`flex flex-row w-full justify-between`}>
            <Title title={`Game ${game?.gameNumber}`} />
            <Button size="sm" color="default" isIconOnly onPress={() => setEditMode(false)}>
              <TbX />
            </Button>
          </div>
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
          <ResultSelector
            value={gameResult}
            onValueChange={resultChangeHandler}
            isLoading={isPending || isLoading}
          />
        </>
      );
    } else {
      return (
        <>
          <Title title={`Game ${game?.gameNumber}`} />
          <Chip
            className="cursor-pointer"
            size="sm"
            variant="flat"
            color={color}
            startContent={<TbCards size={24} />}
            onClick={() => setEditMode(true)}
          >
            {game?.startingHand ?? '-'}v{game?.oppStartingHand ?? '-'}
            {game?.isOnPlay ? ' (OTPlay)' : ''}
            {game?.isOnPlay === false ? ' (OTDraw)' : ''}
          </Chip>
          {!gameResult ? (
            <ResultSelector
              value={gameResult}
              onValueChange={resultChangeHandler}
              isLoading={isPending || isLoading}
            />
          ) : null}
        </>
      );
    }
  }, [
    editMode,
    color,
    gameResult,
    resultChangeHandler,
    isPending,
    isLoading,
    game?.gameNumber,
    game?.startingHand,
    game?.oppStartingHand,
    game?.isOnPlay,
  ]);

  return (
    <div className={`flex flex-${editMode || !gameResult ? 'col' : 'row'} w-full gap-4`}>
      {content}
    </div>
  );
}
