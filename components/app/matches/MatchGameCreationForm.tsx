'use client';

import { FormEventHandler, useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import Title from '@/components/typography/Title';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import useCreateGame from '@/lib/hooks/useCreateGame';
import HandSizeSelector from '@/components/form/HandSizeSelector';
import OnThePlaySelector from '@/components/form/OnThePlaySelector';

interface MatchGameCreationFormProps {
  matchId: number;
  gameNumber?: number;
}

export default function MatchGameCreationForm({ matchId, gameNumber }: MatchGameCreationFormProps) {
  const { data } = useMatch(matchId);
  const { mutate: createGame, isPending } = useCreateGame();
  const [isOnPlay, setIsOnPlay] = useState<boolean>(true);
  const [startingHand, setStartingHand] = useState<number>(7);
  const [oppStartingHand, setOppStartingHand] = useState<number>(7);

  const onPlayChange = useCallback((e: boolean) => setIsOnPlay(e), []);

  const createGameHandler = useCallback(async () => {
    if (!data) return;

    const gameData = {
      matchId: matchId,
      gameNumber,
      startingHand,
      oppStartingHand,
      isOnPlay,
    };

    createGame(gameData);
  }, [data, matchId, gameNumber, startingHand, oppStartingHand, isOnPlay, createGame]);

  const submitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    async e => {
      e.preventDefault();
      createGameHandler();
    },
    [createGameHandler],
  );

  return (
    <form
      className="flex flex-col w-full gap-2 md:gap-4 max-w-md align-middle items-center"
      onSubmit={submitHandler}
    >
      <Title title={`Game ${gameNumber}`} />
      <span>Your starting hand: </span>
      <HandSizeSelector value={startingHand} onValueChange={setStartingHand} />
      <span>Opp. starting hand: </span>
      <HandSizeSelector value={oppStartingHand} onValueChange={setOppStartingHand} />

      <OnThePlaySelector value={isOnPlay} onValueChange={setIsOnPlay} />
      <Button onPress={createGameHandler} isLoading={isPending}>
        Create
      </Button>
    </form>
  );
}
