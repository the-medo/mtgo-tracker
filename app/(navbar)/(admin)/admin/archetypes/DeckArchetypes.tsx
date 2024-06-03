'use server';

import { QueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { getDeckArchetypes } from '@/app/api/deck-archetype/getDeckArchetypes';
import DeckArchetypesClient from '@/app/(navbar)/(admin)/admin/archetypes/DeckArchetypesClient';

export default async function DeckArchetypes() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.DECK_ARCHETYPE],
    queryFn: getDeckArchetypes,
  });

  return <DeckArchetypesClient />;
}
