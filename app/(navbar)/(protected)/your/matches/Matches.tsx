'use server';

import { QueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { getMatches } from '@/app/api/match/getMatches';
import MatchesClient from '@/app/(navbar)/(protected)/your/matches/MatchesClient';

export default async function Matches() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.MATCH],
    queryFn: getMatches,
  });

  return <MatchesClient />;
}
