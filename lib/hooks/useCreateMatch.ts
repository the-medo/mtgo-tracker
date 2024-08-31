import { QueryFilters, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import useSimplePost, { SimplePostRequest } from '@/app/api/useSimplePost';
import { useCallback, useMemo } from 'react';
import useCreateGame from '@/lib/hooks/useCreateGame';
import { EventExtended } from '@/app/api/event/route';

export default function useCreateMatch() {
  const queryClient = useQueryClient();

  const { mutate: createMatch, isPending } = useSimplePost(QK.MATCH);
  const { mutate: createGame, isPending: isPendingGame } = useCreateGame();

  const eventFilters: QueryFilters = useMemo(
    () => ({
      type: 'all',
      exact: false,
      queryKey: [QK.EVENT],
    }),
    [],
  );

  return useMemo(
    () => ({
      mutate: async (matchData: SimplePostRequest) => {
        createMatch(matchData, {
          onSuccess: async newMatch => {
            console.log('useCreateMatch onSuccess callback');
            console.log('NEW MATCH: ', newMatch);

            //add to "matches"
            queryClient.setQueriesData(eventFilters, (old: unknown) => {
              console.log('OLD', old);
              // @ts-ignore
              if (old && 'pages' in old && Array.isArray(old.pages)) {
                const pgs = old.pages as EventExtended[][];

                const result = {
                  ...old,
                  pages: pgs.map(p => {
                    // @ts-ignore
                    return p.map(x => ({
                      ...x,
                      // @ts-ignore
                      Matches: x.id === newMatch.eventId ? [...x.Matches, newMatch] : x.Matches,
                    }));
                  }),
                };

                console.log('Infinite result: ', result);
                return result;
              } else {
                // @ts-ignore
                if ('id' in old && old.id === newMatch.eventId) {
                  const result = {
                    // @ts-ignore
                    ...old,
                    // @ts-ignore
                    Matches: [...(old.Matches ?? []), newMatch],
                  };

                  console.log('Single result: ', result);
                  return result;
                }
              }
            });
          },
        });
      },
      isPending,
    }),
    [createGame, isPending],
  );
}
