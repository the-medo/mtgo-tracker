import { parseNumber, Stringify } from '@/app/api/parsers';
import { DeckArchetype, Prisma } from '@prisma/client';
import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { useCallback } from 'react';

export type GetDeckArchetypesRequest = PrismaQueryApiParams<'DeckArchetype'>;

export async function getDeckArchetypes({ where, orderBy, skip, take }: GetDeckArchetypesRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck-archetype${params}`);

  // return await f.json();
  // //==
  const jsonData = (await f.json()) as Stringify<DeckArchetype>[];
  return jsonData.map(j => ({
    ...j,
    id: parseNumber(j.id),
    formatId: parseNumber(j.formatId),
    archetypeGroupId: parseNumber(j.archetypeGroupId),
  })) as DeckArchetype[];
}

export function useDeckArchetypes(request: GetDeckArchetypesRequest = {}) {
  const queryFn = useCallback(() => getDeckArchetypes(request), [request]);

  return useQuery({
    queryKey: [QK.DECK_ARCHETYPE, request],
    queryFn,
  });
}

export function useInfiniteDeckArchetypes(request: GetDeckArchetypesRequest = {}) {
  const queryFn: QueryFunction<DeckArchetype[], QueryKey, number> = useCallback(
    ({ pageParam }) => getDeckArchetypes({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.DECK_ARCHETYPE, request],
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
