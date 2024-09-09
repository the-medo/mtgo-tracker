'use client';

import { GetEventsRequest, useInfiniteEvents } from '@/app/api/event/getEvents';
import EventBox from '@/components/app/events/EventBox';
import Title from '@/components/typography/Title';
import DashedBox from '@/components/layout/DashedBox';
import { Spinner } from '@nextui-org/spinner';
import EventAggregations from '@/app/(navbar)/(protected)/your/dashboard/EventAggregations';

interface DashboardEventsProps {}

export default function DashboardEvents({}: DashboardEventsProps) {
  const filters: GetEventsRequest = {
    take: 3,
    orderBy: {
      id: 'desc',
    },
  };

  const { data, isFetching } = useInfiniteEvents(filters);

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4 w-1/3 min-w-[450px] grow">
      <EventAggregations />
      <Title title="Recent events" />
      {items.length > 0 ? (
        items.map(i => <EventBox key={i.id} eventId={i.id} />)
      ) : isFetching ? (
        <Spinner />
      ) : (
        <DashedBox title="No events found" />
      )}
    </div>
  );
}