import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Stringify } from '@/app/api/parsers';
import { MatchExtended } from '@/app/api/match/route';
import { parseMatch } from '@/app/api/match/getMatches';

export async function getMatch(matchId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/${matchId}`);
  const data = (await response.json()) as Stringify<MatchExtended>;
  return parseMatch(data);
}

export function useMatch(matchId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<MatchExtended, QueryKey> = () => getMatch(matchId);

  return useQuery({
    queryKey: [QK.MATCH, matchId],
    queryFn: skipQuery ? skipToken : queryFn,
    staleTime: Infinity,
  });
}
