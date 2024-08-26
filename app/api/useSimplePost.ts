import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';
import { useMemo } from 'react';
import { parseDate } from '@/app/api/parsers';

const dateTimeProperties = ['validFrom', 'lastPlayedAt', 'createdAt', 'date', 'startTime'];

export type SimplePostRequest = Record<
  string,
  FormDataEntryValue | number | null | boolean | undefined
>;

export default function useSimplePost<T extends QK>(qk: QK) {
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
    mutationKey: [`${qk}-post`],
    mutationFn: async (data: SimplePostRequest): Promise<QTypes[T][number]> => {
      const res = await fetch(`/api/${qkRedirect[qk] ?? qk}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resp = await res.json();

      dateTimeProperties.forEach(p => {
        if (p in resp) resp[p] = parseDate(resp[p]);
      });

      return resp;
    },
    onSuccess: data => {
      console.log('useSimplePost onSuccess callback', qk);
      const queries = queryClient.getQueryCache().findAll(filters);

      console.log({ queries });

      queries.forEach(q => {
        console.log('================== ', q);
        const queryKey = q.queryKey;

        if (Array.isArray(queryKey)) {
          // console.log('is array! length: ', queryKey.length);
          if (queryKey.length > 1) {
            // console.log('type: ', typeof queryKey[1]);
            if (typeof queryKey[1] === 'object') {
              if (Object.keys(queryKey[0]).length > 0) {
                // console.log(queryKey, ' => INVALIDATING');
                queryClient.invalidateQueries({ queryKey });
              } else {
                // console.log(queryKey, ' => SETTING');
                queryClient.setQueryData(queryKey, (old: InfiniteData<QTypes[T][number][]>) => ({
                  ...old,
                  pages: old.pages.map((o, i) => (i === 0 ? [data, ...o] : o)),
                  // @ts-ignore
                  pageParams: old.pageParams.map((o, i) => (i === 0 ? o : o + 1)),
                }));
              }
            }
          }
        }

        console.log('================== =');
      });

      queryClient.setQueryData([qk, data.id], old => data);

      queryClient.setQueryData([qk], (old: QTypes[T]) => [...(old ?? []), { ...data }]);
    },
  });
}
