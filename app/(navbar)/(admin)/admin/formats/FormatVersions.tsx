'use server';

import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';
import { QueryClient } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';

export default async function FormatVersions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['format-versions'],
    queryFn: getFormatVersions,
  });

  return <FormatVersionsClient />;
}
