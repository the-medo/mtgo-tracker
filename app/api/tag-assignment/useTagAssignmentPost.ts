import { QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK, qkRedirect, QTypeParsers, QTypes } from '@/app/api/queryHelpers';
import { Tag, TagType } from '@prisma/client';
import { NextResponse } from 'next/server';

export type TagAssignmentPostRequest = Record<string, FormDataEntryValue | number | null | undefined>;


export default function useTagAssignmentPost(tagType: TagType | undefined, qk: QK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TagAssignmentPostRequest): Promise<Tag> => {
      if (!tagType) throw new Error("No tag type present in useTagAssignmentPost")
      const res = await fetch(`/api/tag-assignment`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await res.json();
    },
    onMutate: async data => {
      const previousData = queryClient.getQueriesData({
        type: 'all',
        exact: false,
        queryKey: [qk]
      });

      console.log(previousData);
      previousData.forEach(pd => {
        console.log("pd", pd)
      });


      /*const newData = {
        ...data,
      };

      Object.keys(data).forEach(field => {
        const valueParser = QTypeParsers[qk]?.[field];
        if (valueParser) {
          newData[field] = valueParser(data[field]);
        }
      });

      queryClient.setQueryData([qk], (old: QTypes[T]) => [...(old ?? []), { ...newData, id: -1 }]);*/

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
