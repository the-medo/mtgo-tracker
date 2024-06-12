import { useMutation, useQueryClient } from '@tanstack/react-query';
import { anyParser, QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';

export type SimplePatchRequest = {
  id: string | number;
  field: string;
  value: string | number;
};

export default function useSimplePatch<T extends QK>(qk: QK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SimplePatchRequest): Promise<QTypes[T][number]> => {
      const res = await fetch(`/api/${qkRedirect[qk] ?? qk}/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          [data.field]: data.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: [qk] });
      const previousData = queryClient.getQueryData([qk]);

      const valueParser = QTypeParsers[qk]?.[data.field] ?? anyParser;

      queryClient.setQueryData([qk], (old: QTypes[T]) => [
        ...(old ?? []).map(o =>
          o.id === data.id ? { ...o, [data.field]: valueParser(data.value) } : o,
        ),
      ]);

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([qk], context?.previousData);
    },
  });
}
