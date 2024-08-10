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
import { TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import { useQueryClient } from '@tanstack/react-query';
import { MatchExtended } from '@/app/api/match/route';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import GameResultChip from '@/components/app/events/GameResultChip';

interface GameContentProps {
  matchId: number;
  gameId: number;
}

export default function GameContent({ matchId, gameId }: GameContentProps) {
  const queryClient = useQueryClient();
  const { data: match, isLoading: isLoadingMatch } = useMatch(matchId);
  const { data: game, isLoading } = useGame(gameId);
  const { mutate: patchGame, isPending } = useSimplePatch(QK.GAME);
  const { mutate: patchMatch, isPending: isPendingMatch } = useSimplePatch(QK.MATCH);
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
      patchGame(
        {
          id: gameId,
          field: 'result',
          value: value ? value.toString() : null,
        },
        {
          onSuccess: data => {
            queryClient.setQueryData([QK.MATCH, matchId], (old: MatchExtended | undefined) => ({
              ...(old ?? {}),
              Games: (old?.Games ?? []).map(g => ({
                ...g,
                result: g.id === gameId ? value : g.result,
              })),
            }));
          },
        },
      );

      if (match) {
        const gamesOfThisResult = match.Games.filter(g => g.result === value || g.id === gameId);
        if (value === MatchResult.WIN || value === MatchResult.LOSE) {
          const winsNeeded = maxGameCountBasedOnMatchType[match.matchType].winsNeeded;
          if (gamesOfThisResult.length === winsNeeded) {
            patchMatch({
              id: matchId,
              field: 'result',
              value: value ? value.toString() : null,
            });
          }
        } else if (value === MatchResult.DRAW || value === undefined) {
          patchMatch({
            id: matchId,
            field: 'result',
            value: value ? value.toString() : null,
          });
        }
      }
    },
    [patchGame, patchMatch, gameId, matchId, match],
  );

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
          <GameResultChip
            result={game?.result}
            startingHand={game?.startingHand}
            oppStartingHand={game?.oppStartingHand}
            isOnPlay={game?.isOnPlay}
            onClick={() => setEditMode(true)}
          />
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
    game?.gameNumber,
    game?.startingHand,
    game?.oppStartingHand,
    game?.isOnPlay,
    game?.result,
    startingHandChangeHandler,
    oppStartingHandChangeHandler,
    isOnPlayChangeHandler,
    gameResult,
    resultChangeHandler,
    isPending,
    isLoading,
  ]);

  return (
    <div
      className={`flex flex-${editMode || !gameResult ? 'col' : 'row'} w-full gap-4 items-center`}
    >
      {content}
    </div>
  );
}
