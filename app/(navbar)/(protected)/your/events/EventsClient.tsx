'use client';

import { Checkbox } from '@nextui-org/react';
import { useCallback, useMemo, useState } from 'react';
import { useInfiniteEvents } from '@/app/api/event/getEvents';
import useEventFilters from '@/app/(navbar)/(protected)/your/events/useEventFilters';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import EventBox from '@/components/app/events/EventBox';
import StatModal from '@/components/app/stats/StatModal';
import { Spinner } from '@nextui-org/spinner';
import Title from '@/components/typography/Title';

interface Props {}

export default function EventsClient({}: Props) {
  const { filters } = useEventFilters();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteEvents(filters);
  const [openMatches, setOpenMatches] = useState(false);

  const changeHandler = useCallback((checked: boolean) => {
    setOpenMatches(checked);
  }, []);

  const items = useMemo(() => data?.pages?.flat() ?? [], [data?.pages]);
  const statData = useMemo(() => items.map(i => i.Matches).flat(), [items]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Checkbox onValueChange={changeHandler}>Open event matches</Checkbox>
        <hr />
        {isFetching && <Spinner />}
        {!isFetching && items.length === 0 ? <Title title="No events found" /> : null}
        {items.map(i => (
          <EventBox key={i.id} eventId={i.id} openMatches={openMatches} />
        ))}
        {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
      </div>
      <StatModal matchData={statData} />
    </>
  );
}
