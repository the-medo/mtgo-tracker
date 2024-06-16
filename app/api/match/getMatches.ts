import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { MatchExtended } from '@/app/api/match/route';

export type GetMatchesRequest = PrismaQueryApiParams<'Match'>;

export async function getMatches({ where, orderBy, skip, take }: GetMatchesRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match${params}`);

  return (await f.json()) as MatchExtended[];
}

export function useInfiniteMatches(request: GetMatchesRequest = {}) {
  const queryFn: QueryFunction<MatchExtended[], QueryKey, number> = useCallback(
    ({ pageParam }) => getMatches({ ...request, skip: pageParam, take: request.take ?? 10 }),
    [request],
  );

  return useInfiniteQuery({
    queryKey: [QK.MATCH, request],
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const entryCount = pages.reduce((p, c) => p + c.length, 0);
      return entryCount === lastPageParam ? undefined : entryCount;
    },
  });
}
