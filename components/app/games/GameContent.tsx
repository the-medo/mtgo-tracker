'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import HandSizeSelector from '@/components/form/HandSizeSelector';
import OnThePlaySelector from '@/components/form/OnThePlaySelector';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { useCallback, useEffect, useState } from 'react';
import { MatchResult } from '@prisma/client';
import { useGame } from '@/app/api/game/[id]/getGame';
import ResultSelector from '@/components/form/ResultSelector';
import { useQueryClient } from '@tanstack/react-query';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import { Button } from '@nextui-org/button';
import { TbX } from 'react-icons/tb';
import GameResultChip from '@/components/app/games/GameResultChip';
import TableField from '@/components/form/table-form/TableField';
import useStore from '@/store/store';
import { MatchExtended } from '@/app/api/match/getMatches';

export const gameContentIdentificator = `GameContent`;

interface GameContentProps {
  matchId: number;
  gameId: number;
}

export default function GameContent({ matchId, gameId }: GameContentProps) {
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const { data: match, isLoading: isLoadingMatch } = useMatch(matchId);
  const { data: game, isLoading } = useGame(gameId);
  const { mutate: patchGame, isPending } = useSimplePatch(QK.GAME);
  const { mutate: patchMatch, isPending: isPendingMatch } = useSimplePatch(QK.MATCH);

  const gameResult = game?.result ?? undefined;

  const setSelectedId = useStore(state => state.setSelectedId);

  useEffect(() => {
    setSelectedId(gameContentIdentificator, gameId);
  }, [setSelectedId, gameId]);

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
    (value: MatchResult | undefined | null) => {
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
    [patchGame, gameId, match, queryClient, matchId, patchMatch],
  );

  return (
    <div className={`flex flex-col w-full gap-4 items-center`}>
      <div className={`flex flex-row w-full justify-between`}>
        <Title title={`Game ${game?.gameNumber}`} />
        {editMode ? (
          <Button size="sm" color="default" isIconOnly onPress={() => setEditMode(false)}>
            <TbX />
          </Button>
        ) : (
          <GameResultChip
            gameId={gameId}
            includeEditIcon={true}
            onClick={() => setEditMode(true)}
          />
        )}
      </div>
      {editMode && (
        <>
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
        </>
      )}
      <ResultSelector
        value={gameResult}
        onValueChange={resultChangeHandler}
        isLoading={isPending || isLoading}
      />
      <TableField
        qk={QK.GAME}
        type="textarea"
        tableId={gameContentIdentificator}
        id={gameId}
        fieldName="notes"
        label="Game Notes"
        customLabel="Game Notes"
        editable={true}
        value={game?.notes ?? undefined}
      />
      <TableField
        qk={QK.GAME}
        type="tags"
        tableId={gameContentIdentificator}
        id={gameId}
        fieldName="tags"
        label="Tags"
        displaySelect={false}
        editable={true}
        values={game?.GameTags ?? []}
      />
    </div>
  );
}
