import { Tag, TagType } from '@prisma/client';
import { createQueryApiParams, PrismaQueryApiParams } from '@/types/api-params';
import {
  QueryFunction,
  QueryKey,
  skipToken,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import { useCallback } from 'react';

export const tagTypeToQK: Record<TagType, QK> = {
  [TagType.DECK]: QK.TAG_DECK,
  [TagType.EVENT]: QK.TAG_EVENT,
  [TagType.MATCH]: QK.TAG_MATCH,
  [TagType.GAME]: QK.TAG_GAME,
};

export type GetTagsRequest = PrismaQueryApiParams<'Tag'>;

export async function getTags({ where, orderBy, skip, take }: GetTagsRequest) {
  const params = createQueryApiParams({ where, orderBy, skip, take });
  const f = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag${params}`);

  return await f.json();
}

// export function useInfiniteTags(
//   request: GetTagsRequest = {},
//   tagType: TagType,
//   skipQuery?: boolean,
// ) {
//   const queryFn: QueryFunction<Tag[], QueryKey, number> = useCallback(
//     ({ pageParam }) => getTags({ ...request, skip: pageParam, take: request.take ?? 10 }),
//     [request],
//   );
//
//   return useInfiniteQuery({
//     queryKey: [tagTypeToQK[tagType], request],
//     queryFn: skipQuery ? skipToken : queryFn,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, pages, lastPageParam) => {
//       const entryCount = pages.reduce((p, c) => p + c.length, 0);
//       return entryCount === lastPageParam ? undefined : entryCount;
//     },
//   });
// }

export function useTags(tagType: TagType, request: GetTagsRequest = {}, skipQuery?: boolean) {
  console.log('INSIDE useTags');
  const queryFn: QueryFunction<Tag[], QueryKey, number> = useCallback(() => getTags({}), [request]);

  return useQuery({
    queryKey: [tagTypeToQK[tagType]],
    queryFn: skipQuery ? skipToken : queryFn,
  });
}