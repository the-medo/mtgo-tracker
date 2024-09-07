import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import { QueryFunction, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { MatchExtended } from '@/app/api/match/route';
import { parseDate, Stringify } from '@/app/api/parsers';
import { GameExtended } from '@/app/api/game/route';
import { parseGame } from '@/app/api/game/getGames';
import { queryClient } from '@/app/providers';

export const parseMatch = (j: Stringify<MatchExtended>): MatchExtended =>
  ({
    ...j,
    startTime: parseDate(j.startTime),
    Games: (j.Games as unknown as Stringify<GameExtended>[]).map(g => parseGame(g)),
  }) as unknown as MatchExtended;

export type GetMatchesRequest = PrismaQueryApiParams<'Match'>;

export async function getMatches({ where, orderBy, skip, take }: GetMatchesRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match${params}`);

  const data = (await f.json()) as MatchExtended[];

  data.forEach(match => {
    queryClient.setQueryData([QK.MATCH, match.id], match);
    match.Games.forEach(g => {
      queryClient.setQueryData([QK.GAME, g.id], g);
    });
  });

  return data;
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
