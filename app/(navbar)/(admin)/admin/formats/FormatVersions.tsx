'use server';

import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';
import { QueryClient } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';
import { FORMAT_VERSIONS_QUERY_KEY } from '@/app/api/format-version/usePostFormatVersion';

export default async function FormatVersions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [FORMAT_VERSIONS_QUERY_KEY],
    queryFn: getFormatVersions,
  });

  return <FormatVersionsClient />;
}
