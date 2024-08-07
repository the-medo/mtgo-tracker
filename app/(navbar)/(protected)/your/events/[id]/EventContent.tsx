'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { useMemo } from 'react';
import EventMatchSection from '@/components/app/events/EventMatchSection';
import { GetMatchesRequest, useInfiniteMatches } from '@/app/api/match/getMatches';
import { Spinner } from '@nextui-org/spinner';
import Title from '@/components/typography/Title';
import { GetGamesRequest, useInfiniteGames } from '@/app/api/game/getGames';

type EventMatchDisplayInfo = {
  round: number;
  matchId?: number;
  key: string;
};

interface EventContentProps {
  eventId: number;
}

export default function EventContent({ eventId }: EventContentProps) {
  const { data } = useEvent(eventId);

  const matchFilter: GetMatchesRequest = useMemo(() => ({ where: { eventId } }), [eventId]);
  const { data: matches, isLoading } = useInfiniteMatches(matchFilter);

  /* for preloading games of current event */
  const gameFilter: GetGamesRequest = useMemo(
    () => ({
      where: {
        match: {
          eventId,
        },
      },
      take: 50,
    }),
    [eventId],
  );
  const { data: _ } = useInfiniteGames(gameFilter);
  /* ===================================== */

  const matchesToFill = useMemo(
    () => new Array(data?.rounds ?? 0).fill(0).map((_, i) => i + 1),
    [data?.rounds],
  );

  const eventMatchDisplayInfo = useMemo(() => {
    const result: EventMatchDisplayInfo[] = [];
    const defaultSelectedKeys: string[] = [];

    if (!isLoading) {
      const usedMatches: Record<number, boolean | undefined> = {};
      const eventMatches = matches?.pages?.flat() ?? [];

      const getKey = (r: number | undefined, mid: number | undefined) =>
        `round_${r ?? 'x'}-match_${mid ?? 'x'}`;

      matchesToFill.forEach(m => {
        const existingMatches = eventMatches.filter(em => {
          const isRound = em.round === m;
          if (isRound) usedMatches[em.id] = true;
          return isRound;
        });

        if (existingMatches.length > 0) {
          result.push(
            ...existingMatches.map(em => ({
              round: m,
              matchId: em.id,
              key: getKey(m, em.id),
            })),
          );
        } else {
          const key = getKey(m, undefined);
          result.push({
            round: m,
            key,
          });
          defaultSelectedKeys.push(key);
        }
      });

      eventMatches.forEach(m => {
        if (!usedMatches[m.id]) {
          result.push({
            round: m.round ?? 0,
            matchId: m.id,
            key: getKey(m.round ?? 0, m.id),
          });
        }
      });
    }

    return { result, defaultSelectedKeys };
  }, [isLoading, matches?.pages, matchesToFill]);

  return (
    <div className="flex flex-col w-full gap-4">
      {isLoading || (!isLoading && eventMatchDisplayInfo.result.length === 0) ? (
        <Spinner />
      ) : (
        eventMatchDisplayInfo.result.map((em, i) => (
          <EventMatchSection
            key={em.key}
            eventId={eventId}
            eventRound={em.round}
            matchId={em.matchId}
          />
        ))
      )}
    </div>
  );
}
