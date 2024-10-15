'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import MatchGameSection from '@/components/app/matches/MatchGameSection';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { DeckArchetype, Match, MatchResult } from '@prisma/client';
import TableField from '@/components/form/table-form/TableField';
import ResultSelector from '@/components/form/ResultSelector';
import { TbEdit, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import GameResultChip from '@/components/app/games/GameResultChip';
import useStore from '@/store/store';
import MatchRowStart from '@/components/app/matches/MatchRowStart';
import cn from 'classnames';
import { InfiniteData, QueryFilters } from '@tanstack/react-query';
import { queryClient } from '@/app/providers';

type MatchGameDisplayInfo = {
  gameId?: number;
  gameNumber: number;
  key: string;
};

interface MatchBoxProps {
  matchId: number;
  eventId: number | null;
  compact?: boolean;
  whiteBackground?: boolean;
  showDeckName?: boolean;
  insideAnotherBox?: boolean;
  smallMatchRow?: boolean;
}

export const matchBoxIdentificator = `MatchContent`;

export default function MatchBox({
  matchId,
  eventId,
  compact,
  whiteBackground,
  showDeckName,
  insideAnotherBox,
  smallMatchRow,
}: MatchBoxProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId ?? 0, !eventId);

  const [matchLoaded, setMatchLoaded] = useState(false);
  const [matchEditMode, setMatchEditMode] = useState(false);

  const { mutate: patchMatch, isPending } = useSimplePatch(QK.MATCH);
  const setSelectedId = useStore(state => state.setSelectedId);
  const unsetSelectedId = useStore(state => state.unsetSelectedId);

  useEffect(() => {
    if (!isLoading && !matchLoaded) {
      const hasStartedGame = match?.Games.find(g => g.result === null) !== undefined;
      const isEditMode = !match?.result || hasStartedGame;
      setMatchLoaded(true);
      setMatchEditMode(isEditMode);
      if (isEditMode) {
        setSelectedId(matchBoxIdentificator, matchId);
      }
    }
  }, [isLoading, matchLoaded, match?.Games, match?.result, setSelectedId, matchId]);

  const matchResult = match?.result ?? undefined;
  const matchTags = match?.MatchTags ?? [];

  const matchResultChangeHandler = useCallback(
    (value: MatchResult | undefined | null) => {
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

  /*
  when patching archetype, only property is patched, but oppArchetype object stays empty
   */
  useEffect(() => {
    if (match?.oppArchetypeId) {
      const filters: QueryFilters = {
        type: 'all',
        exact: false,
        queryKey: [QK.DECK_ARCHETYPE],
      };
      const allQueries = queryClient.getQueriesData(filters);
      allQueries.forEach(([_qk, d]) => {
        const data = d as unknown as InfiniteData<DeckArchetype[]>;
        if (data && 'pages' in data && Array.isArray(data.pages)) {
          const archetype = data.pages.flat().find(a => a.id === match?.oppArchetypeId);
          if (archetype) {
            queryClient.setQueryData([QK.MATCH, matchId], (o: Match) => ({
              ...o,
              oppArchetype: archetype,
            }));
          }
        }
      });
    }
  }, [match?.oppArchetypeId, matchId]);

  const editModeHandler = useCallback(() => {
    setMatchEditMode(p => {
      if (p) {
        unsetSelectedId(matchBoxIdentificator, matchId);
      } else {
        setSelectedId(matchBoxIdentificator, matchId);
      }
      return !p;
    });
  }, [matchId, setSelectedId, unsetSelectedId]);

  return (
    <div
      className={cn(`flex flex-row`, {
        '-ml-20': insideAnotherBox,
        'w-full': !insideAnotherBox,
        'w-[calc(100%+theme(spacing.28))]':
          insideAnotherBox && (breakpoint === 'xs' || breakpoint === 'sm'),
        'w-[calc(100%+theme(spacing.20))]':
          insideAnotherBox && breakpoint !== 'xs' && breakpoint !== 'sm',
      })}
    >
      <MatchRowStart
        matchId={matchId}
        itemsCenter={!matchEditMode}
        roundNumber={match?.round ?? undefined}
        compact={compact}
        small={insideAnotherBox || smallMatchRow}
      />
      <div
        className={cn(`flex flex-col w-full gap-2 relative`, {
          'bg-default-50 border-default-200 border-1': matchEditMode,
          'bg-default-100': !matchEditMode && !whiteBackground,
          'bg-background': whiteBackground,
          'rounded-tr-md rounded-br-md': compact,
        })}
      >
        <div
          className={cn(`flex flex-row flex-wrap w-full gap-2 md:gap-4`, {
            'items-start': matchEditMode,
            'items-center': !matchEditMode,
            'p-2 md:p-4': !compact,
            'p-2 px-2 md:px-4': compact,
          })}
        >
          <div
            className={cn(`flex flex-row flex-wrap gap-2 `, {
              'items-start': matchEditMode,
              'items-center': !matchEditMode,
            })}
          >
            <div className={cn(`flex flex-row gap-2 md:gap-4 items-center w-[min(100%,500px)]`)}>
              {matchEditMode ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row flex-wrap gap-2">
                    <TableField
                      qk={QK.MATCH}
                      selectType={QK.DECK_ARCHETYPE}
                      formatId={event?.formatId}
                      type="select"
                      tableId={matchBoxIdentificator}
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
                      tableId={matchBoxIdentificator}
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
                      tableId={matchBoxIdentificator}
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
                    tableId={matchBoxIdentificator}
                    id={matchId}
                    fieldName="notes"
                    label="Match Notes"
                    customLabel="Match Notes"
                    editable={true}
                    value={match?.notes ?? undefined}
                  />
                </div>
              ) : (
                <div
                  className={cn('flex gap-2 items-center p-2', {
                    'flex-row flex-wrap': breakpoint !== 'xs' && breakpoint !== 'sm',
                    'flex-col': breakpoint === 'xs' || breakpoint === 'sm',
                  })}
                >
                  {showDeckName && (
                    <>
                      <div className="flex flex-col gap-1 min-w-[150px]">
                        <p className="text-md text-primary-dark">{match?.deck?.name}</p>
                      </div>
                      <p className="text-xs text-default-500">vs.</p>
                    </>
                  )}
                  <div className="flex flex-col gap-1 min-w-[150px]">
                    <p className="text-md">{match?.oppArchetype?.name}</p>
                    {match?.oppArchetypeNote && (
                      <p className="text-xs text-default-500">{match?.oppArchetypeNote}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!matchEditMode && (
            <>
              <div className="flex flex-row flex-wrap gap-2 items-center min-w-[150px]">
                {match?.Games.sort((a, b) => a.gameNumber - b.gameNumber).map(g => (
                  <GameResultChip key={g.id} gameId={g.id} />
                ))}
              </div>
              {match?.notes && <div className="italic text-xs min-w-[150px]">{match.notes}</div>}
            </>
          )}

          {matchEditMode && (
            <div className="flex flex-col gap-2 items-center">
              <div className="flex flex-row gap-2 items-center">
                <span>Result:</span>
                <ResultSelector
                  value={matchResult}
                  onValueChange={matchResultChangeHandler}
                  isLoading={isPending || isLoading}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <span>Tags:</span>
                <div className="flex flex-row items-center max-w-[300px]">
                  <TableField
                    qk={QK.MATCH}
                    type="tags"
                    tableId={matchBoxIdentificator}
                    id={matchId}
                    fieldName="tags"
                    label="Tags"
                    displaySelect={false}
                    // @ts-ignore
                    values={matchTags}
                  />
                </div>
              </div>
            </div>
          )}
          {matchEditMode || matchTags.length === 0 ? null : (
            <div className="flex flex-row items-center max-w-[300px]">
              <TableField
                qk={QK.MATCH}
                type="tags"
                tableId={matchBoxIdentificator}
                id={matchId}
                fieldName="tags"
                label="Tags"
                displaySelect={false}
                // @ts-ignore
                values={matchTags}
                editable={false}
              />
            </div>
          )}
        </div>

        <div className="absolute top-1 right-2 text-default-500 text-xs">
          <i>{match?.oppName}</i>
        </div>

        {(matchEditMode || !match?.result) && !compact && (
          <div className={`p-2 md:p-4 flex flex-row flex-wrap w-full gap-2 md:gap-4 items-start`}>
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

      {!compact && (
        <div
          className={cn(
            'p-2 rounded-tr-md rounded-br-md flex flex-col w-12 h-full bg-default-200 items-center',
          )}
        >
          <Button size="sm" color="default" isIconOnly onPress={editModeHandler}>
            {matchEditMode ? <TbX /> : <TbEdit />}
          </Button>
        </div>
      )}
    </div>
  );
}
