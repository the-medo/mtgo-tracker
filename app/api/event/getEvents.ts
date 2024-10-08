import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { parseDate, Stringify } from '@/app/api/parsers';
import { MatchExtended, matchExtension, parseMatch } from '@/app/api/match/getMatches';
import { addEventToCache } from '@/app/api/event/[id]/getEvent';
import { Prisma } from '@prisma/client';

export const eventExtension = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    deck: true,
    EventTags: true,
    format: true,
    Matches: {
      ...matchExtension,
    },
  },
});

export const eventPatchExtension = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    deck: true,
    format: true,
  },
});

export type EventExtended = Prisma.EventGetPayload<typeof eventExtension>;

export const parseEvent = (j: Stringify<EventExtended>): EventExtended =>
  ({
    ...j,
    date: parseDate(j.date),
    Matches: (j.Matches as unknown as Stringify<MatchExtended>[]).map(m => parseMatch(m)),
    format: j.format,
  }) as unknown as EventExtended;

export type GetEventsRequest = PrismaQueryApiParams<'Event'>;

export async function getEvents({ where, orderBy, skip, take }: GetEventsRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event${params}`);

  const data = (await f.json()).map((j: Stringify<EventExtended>) =>
    parseEvent(j),
  ) as EventExtended[];

  data.forEach(e => addEventToCache(e));

  return data;
}

export function useInfiniteEvents(request: GetEventsRequest = {}) {
  const queryFn: QueryFunction<EventExtended[], QueryKey, number> = useCallback(
    ({ pageParam }) => getEvents({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.EVENT, request],
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
