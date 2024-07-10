'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';

interface EventMatchTitleProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
}

export default function EventMatchTitle({ eventId, eventRound }: EventMatchTitleProps) {
  const { data } = useEvent(eventId);
  const { mutate: createMatch, isPending } = useCreateMatch();
  const [oppName, setOppName] = useState<string>('');

  const onOppNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setOppName(e.target.value),
    [],
  );

  const createMatchHandler = useCallback(async () => {
    if (!data || oppName.length === 0) return;

    const matchData = {
      eventId,
      round: eventRound,
      oppName,
      formatId: data?.formatId,
      formatVersionId: data?.formatVersionId,
      deckId: data?.deckId,
      matchType: data?.matchType,
    };

    createMatch(matchData);
  }, [createMatch, data, eventId, eventRound, oppName]);

  return (
    <>
      <div className="flex flex-col w-full gap-4 max-w-xs">
        <Input
          type="text"
          label="Opponent name"
          size="sm"
          name="oppName"
          value={oppName}
          onChange={onOppNameChange}
        />
        <Button
          onPress={createMatchHandler}
          isDisabled={oppName.length === 0 || isPending}
          isLoading={isPending}
        >
          Create
        </Button>
      </div>
    </>
  );
}
