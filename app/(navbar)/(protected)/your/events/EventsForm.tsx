'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { ChangeEventHandler, useCallback, useRef, useState } from 'react';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import SelectFormat from '@/components/form/select/SelectFormat';
import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';
import SelectEventType from '@/components/form/select/SelectEventType';

export default function EventsForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.EVENT);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<string>();
  const [formatId, setFormatId] = useState<number>();
  const [name, setName] = useState<string>();
  const [round, setRounds] = useState<number>(0);
  const [entry, setEntry] = useState<number>(0);
  const [winnings, setWinnings] = useState<number>(0);

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

      ref.current?.reset();

      mutate(data);
    },
    [mutate],
  );

  const onFormatChange = useCallback(
    (id: string | number) => {
      const newFormat = formats?.find(f => f.id.toString() === id);
      if (newFormat) {
        setFormatId(newFormat.id);
        setSelectedFormatVersion(newFormat.latestFormatVersionId?.toString());
      }
    },
    [formats],
  );

  return (
    <form ref={ref} action={createEvent} className="flex flex-col gap-2">
      <SelectEventType name="type" />
      <SelectFormat name="formatId" onChange={onFormatChange} />
      <SelectFormatVersion
        name="formatVersionId"
        value={selectedFormatVersion}
        description='Automatically changes to "latest" after format change'
      />

      <Input type="text" label="Name" size="sm" name="name" />
      <Input type="number" label="Rounds" size="sm" name="rounds" />
      <Input type="number" label="Entry" size="sm" name="entry" />
      <Input type="number" label="Winnings" size="sm" name="winnings" />
      <Button type="submit">Create</Button>
    </form>
  );
}
