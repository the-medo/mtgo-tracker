'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { ChangeEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import SelectFormat from '@/components/form/select/SelectFormat';
import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';
import SelectEventType from '@/components/form/select/SelectEventType';
import { eventTypeInfo } from '@/app/(navbar)/(protected)/your/events/eventsLib';
import { EventType } from '@prisma/client';
import { DatePicker } from '@nextui-org/date-picker';
import { fromDate } from '@internationalized/date';
import SelectDeck from '@/components/form/select/SelectDeck';

export default function EventsForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.EVENT);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<string>();
  const [formatId, setFormatId] = useState<number>();

  const [name, setName] = useState<string>();
  const [rounds, setRounds] = useState<number>(0);
  const [entry, setEntry] = useState<number>(0);

  const { isPending, data: formats } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const createEvent = useCallback(
    async (formData: FormData) => {
      const formatId = formData.get('formatId') as string | undefined;
      const formatVersionId = formData.get('formatVersionId') as string | undefined;

      const data = {
        name: formData.get('name'),
        type: formData.get('type'),
        date: formData.get('date'),
        rounds: formData.get('rounds') ? parseInt(formData.get('rounds') as string) : undefined,
        entry: formData.get('entry') ? parseInt(formData.get('entry') as string) : undefined,
        winnings: formData.get('winnings')
          ? parseInt(formData.get('winnings') as string)
          : undefined,
        formatId: formatId ? parseInt(formatId) : undefined,
        formatVersionId: formatVersionId ? parseInt(formatVersionId) : undefined,
      };

      setName('');
      setRounds(0);
      setEntry(0);
      setFormatId(undefined);
      setSelectedFormatVersion(undefined);
      mutate(data);
    },
    [mutate],
  );

  const onFormatChange = useCallback(
    (id: string | number | undefined) => {
      const newFormat = formats?.find(f => f.id.toString() === id);
      setFormatId(newFormat?.id);
      setSelectedFormatVersion(newFormat?.latestFormatVersionId?.toString());
    },
    [formats],
  );

  const onEventTypeChange = useCallback((eventType: string | number | undefined) => {
    const et = eventType as EventType;
    const eventInfo = eventTypeInfo[et];
    if (eventInfo) {
      setName(eventInfo.name);
      setRounds(eventInfo.rounds);
      setEntry(eventInfo.entry);
    }
  }, []);

  const onNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setName(e.target.value),
    [],
  );

  const onRoundsChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setRounds(parseInt(e.target.value)),
    [],
  );

  const onEntryChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setEntry(parseInt(e.target.value)),
    [],
  );

  const defaultDate = useMemo(() => fromDate(new Date(), 'GMT'), []);

  return (
    <form ref={ref} action={createEvent} className="flex flex-col gap-2">
      <SelectFormat name="formatId" onChange={onFormatChange} />
      <SelectFormatVersion
        name="formatVersionId"
        value={selectedFormatVersion}
        description='Automatically changes to "latest" after format change'
      />

      <SelectEventType name="type" onChange={onEventTypeChange} />
      <Input
        type="text"
        label="Event name"
        size="sm"
        name="name"
        value={name}
        onChange={onNameChange}
      />
      <SelectDeck name="deckId" formatId={formatId} isFormatIdMandatory={true} />
      <Input
        type="number"
        label="Rounds"
        size="sm"
        name="rounds"
        value={rounds.toString()}
        onChange={onRoundsChange}
      />
      <Input
        type="number"
        label="Entry"
        size="sm"
        name="entry"
        value={entry.toString()}
        onChange={onEntryChange}
      />
      <Input type="number" label="Winnings" size="sm" name="winnings" />
      <DatePicker label="Date" size="sm" name="date" defaultValue={defaultDate} granularity="day" />
      <Button type="submit">Create</Button>
    </form>
  );
}
