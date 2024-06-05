import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK, QTypeParsers, QTypes } from '@/app/api/queryHelpers';

export type SimplePostRequest = Record<string, FormDataEntryValue | number | null | undefined>;

export default function useSimplePost<T extends QK>(qk: QK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SimplePostRequest): Promise<QTypes[T][number]> => {
      const res = await fetch(`/api/${qk}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: [qk] });
      const previousData = queryClient.getQueryData([qk]);

      const newData = {
        ...data,
      };

      Object.keys(data).forEach(field => {
        const valueParser = QTypeParsers[qk]?.[field];
        if (valueParser) {
          newData[field] = valueParser(data[field]);
        }
      });

      queryClient.setQueryData([qk], (old: QTypes[T]) => [...(old ?? []), { ...newData, id: -1 }]);

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData([qk], context?.previousData);
    },
    onSuccess: data => {
      // queryClient.setQueryData([qk], (old: QTypes[T]) => [
      //   ...(old ?? []).map(o => (o.id === -1 ? { ...o, id: data.id } : o)),
      // ]);
      queryClient.invalidateQueries({ queryKey: [qk] });
    },
  });
}
