import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormatVersion } from '@prisma/client';

export const FORMAT_VERSIONS_QUERY_KEY = 'format-version';

export default function usePostFormatVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<FormatVersion, 'id'>): Promise<FormatVersion> => {
      const res = await fetch('/api/format-version', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey: [FORMAT_VERSIONS_QUERY_KEY] });
      const previousData = queryClient.getQueryData([FORMAT_VERSIONS_QUERY_KEY]);
      queryClient.setQueryData<FormatVersion[]>([FORMAT_VERSIONS_QUERY_KEY], old => [
        ...(old ?? []),
        { ...newData, id: -1 },
      ]);

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([FORMAT_VERSIONS_QUERY_KEY], context?.previousData);
    },
    onSuccess: data => {
      queryClient.setQueryData<FormatVersion[]>([FORMAT_VERSIONS_QUERY_KEY], old => [
        ...(old ?? []).map(o => (o.id === -1 ? data : o)),
      ]);
    },
  });
}
