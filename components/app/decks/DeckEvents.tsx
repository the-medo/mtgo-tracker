'use client';

import { GetEventsRequest, useInfiniteEvents } from '@/app/api/event/getEvents';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import EventBox from '@/components/app/events/EventBox';

interface DeckEventsProps {
  deckId: number;
}

export default function DeckEvents({ deckId }: DeckEventsProps) {
  const filters: GetEventsRequest = {
    where: {
      deckId,
    },
  };

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteEvents(filters);
  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      {items.map(i => (
        <EventBox key={i.id} eventId={i.id} whiteBackground compact />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
    </div>
  );
}
