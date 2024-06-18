import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { GameExtended } from '@/app/api/game/route';

export type GetGamesRequest = PrismaQueryApiParams<'Game'>;

export async function getGames({ where, orderBy, skip, take }: GetGamesRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game${params}`);

  return (await f.json()) as GameExtended[];
}

export function useInfiniteGames(request: GetGamesRequest = {}) {
  const queryFn: QueryFunction<GameExtended[], QueryKey, number> = useCallback(
    ({ pageParam }) => getGames({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.GAME, request],
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
