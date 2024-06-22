import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, skipToken, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { DeckExtended } from '@/app/api/deck/route';

export type GetDecksRequest = PrismaQueryApiParams<'Deck'>;

export async function getDecks({ where, orderBy, skip, take }: GetDecksRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck${params}`);

  return (await f.json()) as DeckExtended[];
}

export function useInfiniteDecks(request: GetDecksRequest = {}, skipQuery?: boolean) {
  const queryFn: QueryFunction<DeckExtended[], QueryKey, number> = useCallback(
    ({ pageParam }) => getDecks({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.DECK, request],
    queryFn: skipQuery ? skipToken : queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
