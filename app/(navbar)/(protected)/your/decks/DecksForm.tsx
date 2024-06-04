'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef, useState } from 'react';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectArchetypeGroup from '@/components/form/select/SelectArchetypeGroup';
import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';

export default function DecksForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.DECK);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState();

  const { isPending, data: formats } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const createDeck = useCallback(
    async (formData: FormData) => {
      ref.current?.reset();

      const latestFormatVersionId = formData.get('latestFormatVersionId') as string | undefined;

      const data = {
        name: formData.get('name'),
        latestFormatVersionId: latestFormatVersionId ? parseInt(latestFormatVersionId) : undefined,
      };

      mutate(data);
    },
    [mutate],
  );

  const onFormatChange = useCallback(
    id => {
      console.log('FORMAT CHANGED!', id);
      const newFormat = formats?.find(f => f.id.toString() === id);
      if (newFormat) {
        console.log('new format found');
        setSelectedFormatVersion(newFormat.latestFormatVersionId);
      }
    },
    [formats],
  );

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Title title="New Deck" />
      </CardHeader>
      <CardBody>
        <form ref={ref} action={createDeck} className="flex flex-col gap-2">
          <Input type="text" label="Name" size="sm" name="name" />
          <Input
            type="text"
            label="Link"
            size="sm"
            name="link"
            description="Link from Moxfield or MtgGoldfish"
          />
          <SelectFormat name="formatId" onChange={onFormatChange} />
          <SelectFormatVersion
            name="formatVersionId"
            value={selectedFormatVersion}
            description='Automatically changes to "latest" after format change'
          />
          <Button type="submit">Create</Button>
        </form>
      </CardBody>
    </Card>
  );
}
