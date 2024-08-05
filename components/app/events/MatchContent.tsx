'use client';

import { useMemo } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { maxGameCountBasedOnMatchType } from '@/lib/constants';
import MatchGameSection from '@/components/app/events/MatchGameSection';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import MatchTitle from '@/components/app/events/MatchTitle';
import MatchFooter from '@/components/app/events/MatchFooter';

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
      const matchGames = match.Games;

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
    <>
      <MatchTitle matchId={matchId} eventId={eventId} />
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
      <MatchFooter matchId={matchId} eventId={eventId} />
    </>
  );
}
