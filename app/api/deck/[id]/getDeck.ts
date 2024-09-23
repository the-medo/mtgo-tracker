import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { DeckExtended, parseDeck } from '@/app/api/deck/getDecks';
import { Stringify } from '@/app/api/parsers';

export async function getDeck(deckId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck/${deckId}`);
  const data = (await response.json()) as Stringify<DeckExtended>;
  return parseDeck(data);
}

export function useDeck(deckId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<DeckExtended, QueryKey> = () => getDeck(deckId);

  return useQuery({
    queryKey: [QK.DECK, deckId],
    queryFn: skipQuery ? skipToken : queryFn,
    staleTime: Infinity,
  });
}
