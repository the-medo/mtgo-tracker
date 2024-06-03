'use server';

import { QueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { getArchetypeGroups } from '@/app/api/archetype-group/getArchetypeGroups';
import ArchetypeGroupsClient from '@/app/(navbar)/(admin)/admin/archetypes/ArchetypeGroupsClient';

export default async function ArchetypeGroups() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.ARCHETYPE_GROUPS],
    queryFn: getArchetypeGroups,
  });

  return <ArchetypeGroupsClient />;
}
