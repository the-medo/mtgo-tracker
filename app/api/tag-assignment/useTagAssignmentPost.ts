import { QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Tag, TagType } from '@prisma/client';
import { tagArrayPropertyNameByQK, tagPropertyIdByQK } from '@/types/tags';

export type TagAssignmentPostRequest = Record<
  string,
  FormDataEntryValue | number | null | undefined
>;

export default function useTagAssignmentPost(tagType: TagType | undefined, qk: QK) {
  const queryClient = useQueryClient();

  const propertyId = tagPropertyIdByQK[qk];
  const propertyName = tagArrayPropertyNameByQK[qk];

  if (!propertyName || !propertyId) {
    throw new Error(`${qk} tag-assignment not implemented!`);
  }

  return useMutation({
    mutationFn: async (data: TagAssignmentPostRequest): Promise<Tag> => {
      if (!tagType) throw new Error('No tag type present in useTagAssignmentPost');
      const res = await fetch(`/api/tag-assignment`, {
        method: 'POST',
        body: JSON.stringify({
          type: data.type,
          tagId: data.tagId,
          [propertyId]: data.entityId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    onMutate: async data => {
      const filters: QueryFilters = {
        type: 'all',
        exact: false,
        queryKey: [qk],
      };
      const previousData = queryClient.getQueriesData(filters);

      const tagData = {
        tagId: typeof data.tagId === 'string' ? parseInt(data.tagId) : data.tagId,
        [propertyId]: data.entityId,
      };

      queryClient.setQueriesData(filters, (old: unknown) => {
        // @ts-ignore
        if (old && 'pages' in old && Array.isArray(old.pages)) {
          if (propertyName in old.pages[0]?.[0]) {
            const result = {
              ...old,
              pages: old.pages.map(o => {
                // @ts-ignore
                return o.map(x => ({
                  ...x,
                  [propertyName]:
                    x.id === tagData[propertyId] ? [...x[propertyName], tagData] : x[propertyName],
                }));
              }),
            };
            return result;
          }
        } else {
          // @ts-ignore
          if (propertyName in old) {
            return {
              // @ts-ignore
              ...old,
              [propertyName]:
                // @ts-ignore
                old.id === tagData[propertyId]
                  ? // @ts-ignore
                    [...old[propertyName], tagData]
                  : // @ts-ignore
                    old[propertyName],
            };
          }
        }
        return old;
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueriesData(
        {
          type: 'all',
          exact: false,
          queryKey: [qk],
        },
        context?.previousData,
      );
    },
    onSuccess: data => {
      // queryClient.invalidateQueries({ queryKey: [qk] });
    },
  });
}
