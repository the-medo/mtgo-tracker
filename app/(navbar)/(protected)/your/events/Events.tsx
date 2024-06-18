'use server';

import { QueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { getEvents } from '@/app/api/event/getEvents';
import EventsClient from '@/app/(navbar)/(protected)/your/events/EventsClient';

export default async function Events() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.EVENT],
    queryFn: getEvents,
  });

  return <EventsClient />;
}
