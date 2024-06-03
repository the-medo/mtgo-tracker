'use server';

import FormatsClient from '@/app/(navbar)/(admin)/admin/formats/FormatsClient';
import { QueryClient } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';
import { QK } from '@/app/api/queryHelpers';

export default async function Formats() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  return <FormatsClient />;
}
