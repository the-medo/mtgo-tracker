import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { EventExtended } from '@/app/api/event/route';

export type GetEventsRequest = PrismaQueryApiParams<'Event'>;

export async function getEvents({ where, orderBy, skip, take }: GetEventsRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event${params}`);

  return (await f.json()) as EventExtended[];
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
