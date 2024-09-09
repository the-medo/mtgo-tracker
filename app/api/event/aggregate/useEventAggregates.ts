'use client';

import { QueryFunction, QueryKey, useQuery } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';

export type EventAggregation = {
  totalEntry: number;
  totalWinnings: number;
  totalEvents: number;
};

export function useEventAggregates() {
  const queryFn: QueryFunction<EventAggregation, QueryKey> = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/aggregate`);
    const data = (await response.json()) as EventAggregation;

    return data;
  };

  return useQuery({
    queryKey: [QK.EVENT_AGGREGATE],
    queryFn,
    staleTime: Infinity,
  });
}
