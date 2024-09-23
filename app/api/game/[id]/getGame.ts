import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Stringify } from '@/app/api/parsers';
import { GameExtended, parseGame } from '@/app/api/game/getGames';

export async function getGame(gameId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/${gameId}`);
  const data = (await response.json()) as Stringify<GameExtended>;
  return parseGame(data);
}

export function useGame(gameId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<GameExtended, QueryKey> = () => getGame(gameId);

  return useQuery({
    queryKey: [QK.GAME, gameId],
    queryFn: skipQuery ? skipToken : queryFn,
    staleTime: Infinity,
  });
}
