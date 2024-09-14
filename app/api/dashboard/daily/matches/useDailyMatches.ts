'use client';

import { QueryFunction, QueryKey, useQuery } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';

export type DailyMatch = {
  matchDate: string;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
};

export function useDailyMatches() {
  const queryFn: QueryFunction<DailyMatch[], QueryKey> = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/daily/matches`);
    const data = (await response.json()) as DailyMatch[];

    return data;
  };

  return useQuery({
    queryKey: [QK.DASHBOARD_DAILY_MATCHES],
    queryFn,
    staleTime: Infinity,
  });
}
