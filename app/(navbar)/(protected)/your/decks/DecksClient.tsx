'use client';

import { useInfiniteDecks } from '@/app/api/deck/getDecks';
import useDeckFilters from '@/app/(navbar)/(protected)/your/decks/useDeckFilters';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import DeckBox from '@/components/app/decks/DeckBox';
import { Spinner } from '@nextui-org/spinner';
import Title from '@/components/typography/Title';

interface Props {}

export default function DecksClient({}: Props) {
  const { filters } = useDeckFilters();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDecks(filters);

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      {isFetching && <Spinner />}
      {!isFetching && items.length === 0 ? <Title title="No decks found" /> : null}
      {items.map(i => (
        <DeckBox key={i.id} deckId={i.id} />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
    </div>
  );
}
