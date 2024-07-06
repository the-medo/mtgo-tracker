'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useState } from 'react';
import SelectDeckArchetype, {
  getDeckArchetypeLabel,
} from '@/components/form/select/SelectDeckArchetype';
import Title from '@/components/typography/Title';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import { Button } from '@nextui-org/button';

interface EventMatchTitleProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
}

export default function EventMatchTitle({ eventId, eventRound }: EventMatchTitleProps) {
  const { data } = useEvent(eventId);
  const { mutate: createMatch } = useSimplePost(QK.MATCH);
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
        <Button onPress={createMatchHandler} isDisabled={oppName.length === 0}>
          Create
        </Button>
      </div>
    </>
  );
}
