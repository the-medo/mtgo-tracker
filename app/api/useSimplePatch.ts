import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { anyParser, QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';
import { useMemo } from 'react';

export type SimplePatchRequest = {
  id: string | number;
  field: string;
  value: string | number | boolean | null;
};

export default function useSimplePatch<T extends keyof QTypes>(qk: keyof QTypes) {
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
        if (old && 'pages' in old && Array.isArray(old.pages)) {
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
          if (propertyName in old && old.id === data.id) {
            const result = {
              // @ts-ignore
              ...old,
              [propertyName]: valueParser(data.value),
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
    onSuccess: (responseData, input) => {
      console.log('useSimplePatch onSuccess callback', qk);

      const propertyName = input.field;

      queryClient.setQueriesData(filters, (old: unknown) => {
        console.log('OLD', old);

        /* This is for infinite scroll hooks */
        // @ts-ignore
        if (old && 'pages' in old && Array.isArray(old.pages)) {
          if (propertyName in old.pages[0]?.[0]) {
            const result = {
              ...old,
              pages: old.pages.map(o => {
                // @ts-ignore
                return o.map(x => (x.id === responseData.id ? { ...x, ...responseData } : x));
              }),
            };

            console.log('Infinite result: ', result);
            return result;
          }
          /* This is for single property fetch  */
        } else {
          // @ts-ignore
          if (propertyName in old && old.id === responseData.id) {
            const result = {
              // @ts-ignore
              ...old,
              ...responseData,
            };

            console.log('Single result: ', result);
            return result;
          }
        }

        return old;
      });

      queryClient.setQueryData([qk], (old: QTypes[T]) => [
        ...(old ?? []).map(o => (o.id === responseData.id ? { ...o, ...responseData } : o)),
      ]);
    },
    onError: (err, newData, context) => {
      queryClient.setQueriesData(filters, context?.previousData);
    },
  });
}
