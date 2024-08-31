'use client';

import { Checkbox } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { useInfiniteEvents } from '@/app/api/event/getEvents';
import useEventFilters from '@/app/(navbar)/(protected)/your/events/useEventFilters';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import EventBox from '@/components/app/events/EventBox';

interface Props {}

export default function EventsClient({}: Props) {
  const { filters } = useEventFilters();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteEvents(filters);
  const [openMatches, setOpenMatches] = useState(false);

  const items = data?.pages?.flat() ?? [];

  const changeHandler = useCallback((checked: boolean) => {
    setOpenMatches(checked);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Checkbox onValueChange={changeHandler}>Open event matches</Checkbox>
      <hr />
      {items.map(i => (
        <EventBox key={i.id} eventId={i.id} openMatches={openMatches} />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
    </div>
  );
}
