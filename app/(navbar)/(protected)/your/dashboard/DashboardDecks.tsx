'use client';

import Title from '@/components/typography/Title';
import { GetDecksRequest, useInfiniteDecks } from '@/app/api/deck/getDecks';
import DeckBox from '@/components/app/decks/DeckBox';
import DashedBox from '@/components/layout/DashedBox';
import { Spinner } from '@nextui-org/spinner';

interface DashboardDecksProps {}

export default function DashboardDecks({}: DashboardDecksProps) {
  const filters: GetDecksRequest = {
    take: 3,
    orderBy: {
      id: 'desc',
    },
  };

  const { data, isFetching } = useInfiniteDecks(filters);

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4 w-1/3 min-w-[450px] grow">
      <Title title="Recent decks" />
      {items.length > 0 ? (
        items.map(i => <DeckBox key={i.id} deckId={i.id} />)
      ) : isFetching ? (
        <Spinner />
      ) : (
        <DashedBox title="No decks found" />
      )}
    </div>
  );
}