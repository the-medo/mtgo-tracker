import { QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { anyParser, QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';
import { useMemo } from 'react';
import { tagArrayPropertyNameByQK } from '@/types/tags';

export type SimplePatchRequest = {
  id: string | number;
  field: string;
  value: string | number | boolean | null;
};

export default function useSimplePatch<T extends QK>(qk: QK) {
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
    mutationKey: [qk],
    mutationFn: async (data: SimplePatchRequest): Promise<QTypes[T][number]> => {
      console.log('MUTATION FN', data, `/api/${qkRedirect[qk] ?? qk}/${data.id}`);

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
      // await queryClient.cancelQueries(filters);
      const previousData = queryClient.getQueriesData(filters);

      console.log(`/api/${qkRedirect[qk] ?? qk}/${data.id}`);
      console.log('previous data!', previousData);

      const valueParser = QTypeParsers[qk]?.[data.field] ?? anyParser;

      const propertyName = data.field;

      queryClient.setQueriesData(filters, (old: unknown) => {
        console.log('OLD', old);

        /* This is for infinite scroll hooks */
        // @ts-ignore
        if ('pages' in old && Array.isArray(old.pages)) {
          if (propertyName in old.pages[0]?.[0]) {
            const result = {
              ...old,
              pages: old.pages.map(o => {
                // @ts-ignore
                return o.map(x => ({
                  ...x,
                  [propertyName]: x.id === data.id ? valueParser(data.value) : x[propertyName],
                }));
              }),
            };

            console.log('Infinite result: ', result);
            return result;
          }
          /* This is for single property fetch  */
        } else {
          // @ts-ignore
          if (propertyName in old) {
            const result = {
              // @ts-ignore
              ...old,
              // @ts-ignore
              [propertyName]: old.id === data.id ? valueParser(data.value) : old[propertyName],
            };

            console.log('Single result: ', result);
            return result;
          }
        }

        return old;
      });

      queryClient.setQueryData([qk], (old: QTypes[T]) => [
        ...(old ?? []).map(o =>
          o.id === data.id ? { ...o, [data.field]: valueParser(data.value) } : o,
        ),
      ]);

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueriesData(filters, context?.previousData);
    },
  });
}
