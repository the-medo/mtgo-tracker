'use server';

import { QueryClient } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';
import { QK } from '@/app/api/queryHelpers';
import DecksClient from '@/app/(navbar)/(protected)/your/decks/DecksClient';

export default async function Decks() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.DECK],
    queryFn: getFormats,
  });

  return <DecksClient />;
}
