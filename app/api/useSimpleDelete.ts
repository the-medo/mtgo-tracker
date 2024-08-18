import { QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK, qkRedirect, QTypes } from '@/app/api/queryHelpers';
import { useMemo } from 'react';
import { isNumber } from 'node:util';
import { isNumeric } from '@nextui-org/shared-utils';

export type SimpleDeleteRequest = {
  id: string | number;
};

export default function useSimpleDelete<T extends QK>(qk: QK) {
  const queryClient = useQueryClient();

  const filters: QueryFilters = useMemo(
    () => ({
      type: 'all',
      exact: false,
      queryKey: [qk],
    }),
    [qk],
  );

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
      const id = typeof data.id === 'string' && isNumeric(data.id) ? parseInt(data.id) : data.id;
      await queryClient.cancelQueries({ queryKey: [qk] });
      const previousData = queryClient.getQueriesData(filters);

      queryClient.setQueriesData(filters, (old: unknown) => {
        console.log('OLD', old);

        /* This is for infinite scroll hooks */
        // @ts-ignore
        if ('pages' in old && 'pageParams' in old && Array.isArray(old.pages)) {
          let fromPage: number | undefined = undefined;
          // @ts-ignore
          const result = {
            ...old,
            pages: old.pages.filter((o, i) => {
              const found = o.id === id;
              if (found) {
                fromPage = i;
              }
              return !found;
            }),
            // @ts-ignore
            pageParams: old.pageParams.map((o, i) =>
              fromPage !== undefined && fromPage >= i ? o - 1 : o,
            ),
          };

          return result;
        }
      });

      queryClient.setQueryData([qk], (old: QTypes[T]) => (old ?? []).filter(o => o.id !== id));

      /* This is for single property fetch  */
      queryClient.removeQueries({
        queryKey: [qk, id],
        type: 'all',
        exact: true,
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueriesData(filters, context?.previousData);
    },
  });
}
