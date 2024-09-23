import { useQuery, QueryKey, QueryFunction, skipToken } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Stringify } from '@/app/api/parsers';
import { EventExtended, parseEvent } from '@/app/api/event/getEvents';
import { queryClient } from '@/app/providers';
import { addMatchToCache } from '@/app/api/match/[id]/getMatch';

export const addEventToCache = (e: EventExtended) => {
  queryClient.setQueryData([QK.EVENT, e.id], e);
  e.Matches.forEach(m => addMatchToCache(m));
};

export async function getEvent(eventId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}`);
  const data = (await response.json()) as Stringify<EventExtended>;
  const parsedData = parseEvent(data);

  addEventToCache(parsedData);

  return parsedData;
}

export function useEvent(eventId: number, skipQuery?: boolean) {
  const queryFn: QueryFunction<EventExtended, QueryKey> = () => getEvent(eventId);

  return useQuery({
    queryKey: [QK.EVENT, eventId],
    queryFn: skipQuery ? skipToken : queryFn,
    staleTime: Infinity,
  });
}
