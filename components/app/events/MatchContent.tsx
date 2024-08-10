'use client';

import { useCallback, useMemo, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import MatchGameSection from '@/components/app/events/MatchGameSection';
import { getBgColorBasedOnMatchResult, getBorderColorBasedOnMatchResult } from '@/lib/helpers';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';
import { MatchResult } from '@prisma/client';
import Title from '@/components/typography/Title';
import TableField from '@/components/form/table-form/TableField';
import { deckInfoIdentificator } from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import ResultSelector from '@/components/form/ResultSelector';
import { TbEdit, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import GameResultChip from '@/components/app/events/GameResultChip';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';

type MatchGameDisplayInfo = {
  gameId?: number;
  gameNumber: number;
  key: string;
};

interface MatchContentProps {
  matchId: number;
  eventId: number;
  matchResult?: MatchResult | null;
}

export default function MatchContent({
  matchId,
  eventId,
  matchResult: matchResultProp,
}: MatchContentProps) {
  const [matchEditMode, setMatchEditMode] = useState(!matchResultProp);
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);

  const { mutate: patchMatch, isPending } = useSimplePatch(QK.MATCH);

  const matchResult = match?.result ?? undefined;

  const valueChangeHandler = useCallback(
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

  const oppArchetypeChangeHandler = useCallback(
    (value: string | number | undefined) => {
      patchMatch({
        id: matchId,
        field: 'oppArchetypeId',
        value: value ? value.toString() : null,
      });
    },
    [patchMatch, matchId],
  );

  const bgColor = useMemo(() => getBgColorBasedOnMatchResult(match?.result), [match?.result]);
  const borderColor = useMemo(
    () => getBorderColorBasedOnMatchResult(match?.result),
    [match?.result],
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

  return (
    <div className={`p-4 flex flex-col gap-2 border-2 bg-${bgColor} border-${borderColor}`}>
      <div className="flex flex-row w-full gap-4 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Title title={`Round ${match?.round}`} />
          vs. <i>{match?.oppName}</i>
          <SelectDeckArchetype
            textOnly={!matchEditMode}
            formatId={event?.formatId}
            isLoading={isPending}
            name="oppArchetypeId"
            value={match?.oppArchetypeId?.toString() ?? undefined}
            onChange={oppArchetypeChangeHandler}
            customLabel="Opp. Archetype"
            preselectedItem={match?.oppArchetype ?? undefined}
          />
        </div>

        {matchEditMode && (
          <div className="flex flex-row gap-4 items-center">
            <span>Result:</span>
            <ResultSelector
              value={matchResult}
              onValueChange={valueChangeHandler}
              isLoading={isPending || isLoading}
            />
          </div>
        )}
        <div className="flex flex-row gap-4 items-center">
          {!matchEditMode &&
            match?.Games.sort((a, b) => a.gameNumber - b.gameNumber).map(g => (
              <GameResultChip key={g.id} gameId={g.id} />
            ))}
          <Button size="sm" color="default" isIconOnly onPress={() => setMatchEditMode(p => !p)}>
            {matchEditMode ? <TbX /> : <TbEdit />}
          </Button>
        </div>
      </div>
      {(matchEditMode || !match?.result) && (
        <div className={`flex flex-row w-full gap-4`}>
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
  );
}
