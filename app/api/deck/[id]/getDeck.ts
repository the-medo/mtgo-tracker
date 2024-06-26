import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { DeckExtended } from '@/app/api/deck/route';

export async function getDeck(deckId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deck/${deckId}`);
  return (await response.json()) as DeckExtended;
}

export function useDeck(deckId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<DeckExtended, QueryKey> = () => getDeck(deckId);

  return useQuery({
    queryKey: [QK.DECK, deckId],
    queryFn: skipQuery ? skipToken : queryFn,
  });
}
