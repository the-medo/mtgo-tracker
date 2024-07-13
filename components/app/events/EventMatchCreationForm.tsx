'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, FormEventHandler, useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';
import Title from '@/components/typography/Title';

interface EventMatchCreationFormProps {
  eventId: number;
  eventRound?: number;
}

export default function EventMatchCreationForm({
  eventId,
  eventRound,
}: EventMatchCreationFormProps) {
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

  const submitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    async e => {
      e.preventDefault();
      createMatchHandler();
    },
    [createMatchHandler],
  );

  return (
    <form className="flex w-full gap-4 max-w-md align-middle items-center" onSubmit={submitHandler}>
      <Title title={`Round ${eventRound}`} />
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
    </form>
  );
}
