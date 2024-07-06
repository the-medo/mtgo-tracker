'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { useMemo } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import EventMatchTitle from '@/components/app/events/EventMatchTitle';
import { useInfiniteMatches } from '@/app/api/match/getMatches';
import { Spinner } from '@nextui-org/spinner';

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
  const matchFilter = useMemo(() => ({ where: { eventId } }), [eventId]);
  const { data: matches, isLoading } = useInfiniteMatches(matchFilter);

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
        <Accordion
          variant="light"
          selectionMode="multiple"
          showDivider={false}
          defaultSelectedKeys={eventMatchDisplayInfo.defaultSelectedKeys}
          keepContentMounted={true}
        >
          {eventMatchDisplayInfo.result.map((em, i) => (
            <AccordionItem
              key={em.key}
              aria-label={`Accordion ${i}`}
              title={`Round ${em.round}`}
              classNames={{
                base: `${em.matchId ? 'bg-zinc-50' : 'bg-white border-2 border-dashed'} my-4 px-4`,
              }}
            >
              <EventMatchTitle eventId={eventId} eventRound={em.round} matchId={em.matchId} />
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
