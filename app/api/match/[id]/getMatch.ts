import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Stringify } from '@/app/api/parsers';
import { MatchExtended } from '@/app/api/match/route';
import { parseMatch } from '@/app/api/match/getMatches';
import { queryClient } from '@/app/providers';

export const addMatchToCache = (m: MatchExtended) => {
  queryClient.setQueryData([QK.MATCH, m.id], m);
  m.Games.forEach(g => {
    queryClient.setQueryData([QK.GAME, g.id], g);
  });
};

export async function getMatch(matchId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/${matchId}`);
  const data = (await response.json()) as Stringify<MatchExtended>;

  const parsedMatch = parseMatch(data);

  parsedMatch.Games.forEach(g => {
    queryClient.setQueryData([QK.GAME, g.id], g);
  });

  return parsedMatch;
}

export function useMatch(matchId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<MatchExtended, QueryKey> = () => getMatch(matchId);

  return useQuery({
    queryKey: [QK.MATCH, matchId],
    queryFn: skipQuery || !matchId ? skipToken : queryFn,
    staleTime: Infinity,
  });
}
