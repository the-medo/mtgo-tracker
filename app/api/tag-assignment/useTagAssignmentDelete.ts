import { QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { Tag, TagType } from '@prisma/client';
import { tagArrayPropertyNameByQK, tagPropertyIdByQK } from '@/types/tags';

export type TagAssignmentDeleteRequest = {
  tagId: number;
  entityId: number;
};

export default function useTagAssignmentDelete(tagType: TagType | undefined, qk: QK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TagAssignmentDeleteRequest): Promise<Tag> => {
      if (!tagType) throw new Error('No tag type present in useTagAssignmentDelete');
      const res = await fetch(
        `/api/tag-assignment/type/${tagType}/tagId/${data.tagId}/entityId/${data.entityId}`,
        {
          method: 'DELETE',
        },
      );

      return await res.json();
    },
    onMutate: async data => {
      const filters: QueryFilters = {
        type: 'all',
        exact: false,
        queryKey: [qk],
      };
      const previousData = queryClient.getQueriesData(filters);

      const propertyName = tagArrayPropertyNameByQK[qk];
      const propertyId = tagPropertyIdByQK[qk];

      if (!propertyName || !propertyId) {
        throw new Error(`${qk} tag-assignment not implemented!`);
      }

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
                    x.id === data.entityId
                      ? // @ts-ignore
                        x[propertyName].filter(y => y.tagId !== data.tagId)
                      : x[propertyName],
                }));
              }),
            };

            console.log('RESULT', result);
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
                old.id === data.entityId
                  ? // @ts-ignore
                    old[propertyName].filter(y => y.tagId !== data.tagId)
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
