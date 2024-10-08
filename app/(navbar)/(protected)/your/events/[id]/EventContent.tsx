'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { useMemo } from 'react';
import EventMatchSection from '@/components/app/events/EventMatchSection';
import { Spinner } from '@nextui-org/spinner';
import useStore from '@/store/store';
import EventInfo from '@/app/(navbar)/(protected)/your/events/[id]/EventInfo';

type EventMatchDisplayInfo = {
  round: number;
  matchId?: number;
  key: string;
};

interface EventContentProps {
  eventId: number;
}

export default function EventContent({ eventId }: EventContentProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const compact = ['xs', 'sm'].includes(breakpoint);
  const { data: ev, isLoading } = useEvent(eventId);

  const matches = ev?.Matches;

  const matchesToFill = useMemo(
    () => new Array(ev?.rounds ?? 0).fill(0).map((_, i) => i + 1),
    [ev?.rounds],
  );

  const eventMatchDisplayInfo = useMemo(() => {
    const result: EventMatchDisplayInfo[] = [];
    const defaultSelectedKeys: string[] = [];

    if (!isLoading && matches) {
      const usedMatches: Record<number, boolean | undefined> = {};

      const getKey = (r: number | undefined, mid: number | undefined) =>
        `round_${r ?? 'x'}-match_${mid ?? 'x'}`;

      matchesToFill.forEach(m => {
        const existingMatches = matches.filter(em => {
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

      matches.forEach(m => {
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
  }, [isLoading, matches, matchesToFill]);

  return (
    <div className="flex flex-col w-full gap-2">
      {compact ? (
        <>
          <EventInfo eventId={eventId} compact />
          <hr />
        </>
      ) : null}
      {isLoading || (!isLoading && eventMatchDisplayInfo.result.length === 0) ? (
        <Spinner />
      ) : (
        eventMatchDisplayInfo.result.map((em, i) => (
          <EventMatchSection
            key={em.key}
            eventId={eventId}
            eventRound={em.round}
            matchId={em.matchId}
            compact={compact}
          />
        ))
      )}
    </div>
  );
}
