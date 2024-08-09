import { QueryFilters, useQueryClient } from '@tanstack/react-query';
import { QK } from '@/app/api/queryHelpers';
import useSimplePost, { SimplePostRequest } from '@/app/api/useSimplePost';
import { useCallback, useMemo } from 'react';
import { MatchExtended } from '@/app/api/match/route';

export default function useCreateGame() {
  const queryClient = useQueryClient();

  const { mutate: createGame, isPending } = useSimplePost(QK.GAME);

  const matchFilters: QueryFilters = useMemo(
    () => ({
      type: 'all',
      exact: false,
      queryKey: [QK.MATCH],
    }),
    [],
  );

  return useMemo(
    () => ({
      mutate: async (gameData: SimplePostRequest) => {
        createGame(gameData, {
          onSuccess: newGame => {
            console.log('useCreateGame onSuccess callback');
            console.log('NEW GAME: ', newGame);
            //add to "game" cache
            queryClient.setQueryData([QK.GAME, newGame.id], () => newGame);

            //add to "matches"
            queryClient.setQueriesData(matchFilters, (old: unknown) => {
              console.log('OLD', old);
              // @ts-ignore
              if ('pages' in old && Array.isArray(old.pages)) {
                const pgs = old.pages as MatchExtended[][];

                const result = {
                  ...old,
                  pages: pgs.map(p => {
                    // @ts-ignore
                    return p.map(x => ({
                      ...x,
                      // @ts-ignore
                      Games: x.id === newGame.matchId ? [...x.Games, newGame] : x.Games,
                    }));
                  }),
                };

                console.log('Infinite result: ', result);
                return result;
              } else {
                // @ts-ignore
                if ('id' in old && old.id === newGame.matchId) {
                  const result = {
                    // @ts-ignore
                    ...old,
                    // @ts-ignore
                    Games: [...(old.Games ?? []), newGame],
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
    [isPending],
  );
}
