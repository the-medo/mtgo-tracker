'use server';

import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';
import { QueryClient } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';
import { QK } from '@/app/api/queryHelpers';

export default async function FormatVersions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.FORMAT_VERSIONS],
    queryFn: getFormatVersions,
  });

  return <FormatVersionsClient />;
}
