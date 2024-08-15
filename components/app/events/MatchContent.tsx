'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import MatchGameSection from '@/components/app/events/MatchGameSection';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { MatchResult } from '@prisma/client';
import TableField from '@/components/form/table-form/TableField';
import { deckInfoIdentificator } from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import ResultSelector from '@/components/form/ResultSelector';
import { TbEdit, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import GameResultChip from '@/components/app/events/GameResultChip';
import useStore from '@/store/store';
import MatchRowStart from '@/components/app/events/MatchRowStart';
import cn from 'classnames';

type MatchGameDisplayInfo = {
  gameId?: number;
  gameNumber: number;
  key: string;
};

interface MatchContentProps {
  matchId: number;
  eventId: number;
}

export default function MatchContent({ matchId, eventId }: MatchContentProps) {
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);

  const [matchLoaded, setMatchLoaded] = useState(false);
  const [matchEditMode, setMatchEditMode] = useState(false);

  const { mutate: patchMatch, isPending } = useSimplePatch(QK.MATCH);
  const setSelectedId = useStore(state => state.setSelectedId);

  useEffect(() => {
    if (!isLoading && !matchLoaded) {
      const hasStartedGame = match?.Games.find(g => g.result === null) !== undefined;
      const isEditMode = !match?.result || hasStartedGame;
      setMatchLoaded(true);
      setMatchEditMode(isEditMode);
      if (isEditMode) {
        setSelectedId(deckInfoIdentificator, matchId);
      }
    }
  }, [isLoading, matchLoaded, match?.Games, match?.result, setSelectedId, matchId]);

  const matchResult = match?.result ?? undefined;

  const matchResultChangeHandler = useCallback(
    (value: MatchResult | undefined) => {
      console.log('HM!', value, matchId);
      patchMatch({
        id: matchId,
        field: 'result',
        value: value ? value.toString() : null,
      });
    },
    [patchMatch, matchId],
  );

  const gamesToFill = useMemo(
    () =>
      new Array(match?.matchType ? maxGameCountBasedOnMatchType[match.matchType].maxGamesCount : 0)
        .fill(0)
        .map((_, i) => i + 1),
    [match?.matchType],
  );

  const matchGameDisplayInfo = useMemo(() => {
    const result: MatchGameDisplayInfo[] = [];

    if (!isLoading && match) {
      const usedGames: Record<number, boolean | undefined> = {};
      const matchGames = match.Games ?? [];

      const getKey = (r: number | undefined, gid: number | undefined) =>
        `game-number_${r ?? 'x'}-game_${gid ?? 'x'}`;

      gamesToFill.forEach(gNumber => {
        const existingGames = matchGames.filter(em => {
          const gameExists = em.gameNumber === gNumber;
          if (gameExists) usedGames[em.id] = true;
          return gameExists;
        });

        if (existingGames.length > 0) {
          result.push(
            ...existingGames.map(eg => ({
              gameNumber: gNumber,
              gameId: eg.id,
              key: getKey(gNumber, eg.id),
            })),
          );
        } else {
          const key = getKey(gNumber, undefined);
          result.push({
            gameNumber: gNumber,
            key,
          });
        }
      });

      matchGames.forEach(g => {
        if (!usedGames[g.id]) {
          result.push({
            gameNumber: g.gameNumber ?? 0,
            gameId: g.id,
            key: getKey(g.gameNumber ?? 0, g.id),
          });
        }
      });
    }

    return result;
  }, [isLoading, gamesToFill, match]);

  const editModeHandler = useCallback(() => {
    setSelectedId(deckInfoIdentificator, matchId);
    setMatchEditMode(p => !p);
  }, [matchId, setSelectedId]);

  // bg-${bgColor}

  return (
    <div className={`flex flex-row w-full`}>
      <MatchRowStart
        matchId={matchId}
        itemsCenter={!matchEditMode}
        roundNumber={match?.round ?? undefined}
      />
      <div
        className={`flex flex-col w-full gap-2 ${matchEditMode ? 'bg-default-50 border-default-200 border-1' : 'bg-default-100'} rounded-tr-md rounded-br-md `}
      >
        <div
          className={`p-4 flex flex-row w-full gap-2 ${matchEditMode ? 'items-start' : 'items-center'} justify-between`}
        >
          <div className={`flex flex-row gap-2 ${matchEditMode ? 'items-start' : 'items-center'} `}>
            <div
              className={cn(`flex flex-row gap-4 items-center`, {
                'w-[600px]': matchEditMode,
                'w-[200px]': !matchEditMode,
              })}
            >
              {matchEditMode ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <TableField
                      qk={QK.MATCH}
                      selectType={QK.DECK_ARCHETYPE}
                      formatId={event?.formatId}
                      type="select"
                      tableId={deckInfoIdentificator}
                      id={matchId}
                      fieldName="oppArchetypeId"
                      label="Opp. Archetype"
                      customLabel="Opp. Archetype"
                      preselectedItem={match?.oppArchetype ?? undefined}
                      editable={true}
                    />
                    <TableField
                      qk={QK.MATCH}
                      type="string"
                      tableId={deckInfoIdentificator}
                      id={matchId}
                      fieldName="oppArchetypeNote"
                      label="Opp. Archetype Note"
                      customLabel="Opp. Archetype Note"
                      editable={true}
                      value={match?.oppArchetypeNote ?? undefined}
                    />
                    <TableField
                      qk={QK.MATCH}
                      type="string"
                      tableId={deckInfoIdentificator}
                      id={matchId}
                      fieldName="oppName"
                      label="Opp. Name"
                      customLabel="Opp. Name"
                      editable={true}
                      value={match?.oppName ?? undefined}
                    />
                  </div>
                  <TableField
                    qk={QK.MATCH}
                    type="textarea"
                    tableId={deckInfoIdentificator}
                    id={matchId}
                    fieldName="notes"
                    label="Match Notes"
                    customLabel="Match Notes"
                    editable={true}
                    value={match?.notes ?? undefined}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-md">{match?.oppArchetype?.name}</p>
                  {match?.oppArchetypeNote && (
                    <p className="text-xs text-default-500">{match?.oppArchetypeNote}</p>
                  )}
                </div>
              )}
            </div>
            {!matchEditMode && (
              <>
                <div className="flex flex-row gap-2 items-center min-w-[220px]">
                  {match?.Games.sort((a, b) => a.gameNumber - b.gameNumber).map(g => (
                    <GameResultChip key={g.id} gameId={g.id} />
                  ))}
                </div>
                {match?.notes && <div className="italic text-xs">{match.notes}</div>}
              </>
            )}
          </div>

          {matchEditMode && (
            <div className="flex flex-row gap-2 items-center">
              <span>Result:</span>
              <ResultSelector
                value={matchResult}
                onValueChange={matchResultChangeHandler}
                isLoading={isPending || isLoading}
              />
            </div>
          )}
          <div className="flex flex-row gap-4 items-center">
            {matchEditMode ? null : <i>{match?.oppName}</i>}
            <Button size="sm" color="default" isIconOnly onPress={editModeHandler}>
              {matchEditMode ? <TbX /> : <TbEdit />}
            </Button>
          </div>
        </div>

        {(matchEditMode || !match?.result) && (
          <div className={`p-4 flex flex-row w-full gap-4 items-center`}>
            {isLoading || (!isLoading && matchGameDisplayInfo.length === 0) ? (
              <Spinner />
            ) : (
              matchGameDisplayInfo.map((em, i) => (
                <MatchGameSection
                  key={em.key}
                  matchId={matchId}
                  gameNumber={em.gameNumber}
                  gameId={em.gameId}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
