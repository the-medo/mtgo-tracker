import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Stringify } from '@/app/api/parsers';
import { EventExtended } from '@/app/api/event/route';
import { parseEvent } from '@/app/api/event/getEvents';

export async function getEvent(eventId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}`);
  const data = (await response.json()) as Stringify<EventExtended>;
  return parseEvent(data);
}

export function useEvent(eventId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<EventExtended, QueryKey> = () => getEvent(eventId);

  return useQuery({
    queryKey: [QK.EVENT, eventId],
    queryFn: skipQuery ? skipToken : queryFn,
  });
}
