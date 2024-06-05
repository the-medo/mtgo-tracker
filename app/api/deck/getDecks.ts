import { Deck } from '@prisma/client';
import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';

export type GetDecksRequest = PrismaQueryApiParams<'Deck'>;

export async function getDecks({ where, orderBy, skip, take }: GetDecksRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck${params}`);

  return (await f.json()) as Deck[];
}

export function useInfiniteDecks(request: GetDecksRequest = {}) {
  const queryFn: QueryFunction<Deck[], QueryKey, number> = useCallback(
    ({ pageParam }) => getDecks({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.DECK, request],
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
