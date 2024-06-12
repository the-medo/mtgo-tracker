import { useMutation, useQueryClient } from '@tanstack/react-query';
import { anyParser, QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';

export type SimpleDeleteRequest = {
  id: string | number;
};

export default function useSimpleDelete<T extends QK>(qk: QK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SimpleDeleteRequest): Promise<QTypes[T][number]> => {
      const res = await fetch(`/api/${qkRedirect[qk] ?? qk}/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await res.json();
    },
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: [qk] });
      const previousData = queryClient.getQueryData([qk]);

      queryClient.setQueryData([qk], (old: QTypes[T]) => [
        ...(old ?? []).filter(o => o.id !== data.id),
      ]);

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([qk], context?.previousData);
    },
  });
}
