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
import { parseDeckLink } from '@/app/api/parsers';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';

export default function DecksForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.DECK);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<string>();
  const [validatedLink, setValidatedLink] = useState(true);
  const [formatId, setFormatId] = useState<number>();

  const { isPending, data: formats } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const createDeck = useCallback(
    async (formData: FormData) => {
      const formatId = formData.get('formatId') as string | undefined;
      const formatVersionId = formData.get('formatVersionId') as string | undefined;
      const deckArchetypeId = formData.get('deckArchetypeId') as string | undefined;

      const data = {
        name: formData.get('name'),
        link: formData.get('link'),
        formatId: formatId ? parseInt(formatId) : undefined,
        formatVersionId: formatVersionId ? parseInt(formatVersionId) : undefined,
        deckArchetypeId: deckArchetypeId ? parseInt(deckArchetypeId) : undefined,
      };

      ref.current?.reset();

      mutate(data);
    },
    [mutate],
  );

  const onFormatChange = useCallback(
    (id: string | number | undefined) => {
      const newFormat = formats?.find(f => f.id.toString() === id);
      if (newFormat) {
        setFormatId(newFormat.id);
        setSelectedFormatVersion(newFormat.latestFormatVersionId?.toString());
      }
    },
    [formats],
  );

  const onLinkChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    setValidatedLink(parseDeckLink(e.target.value) !== false);
  }, []);

  return (
    <form ref={ref} action={createDeck} className="flex flex-col gap-2">
      <Input type="text" label="Name" size="sm" name="name" />
      <Input
        type="text"
        label="Link"
        size="sm"
        name="link"
        description="Link from Moxfield or MtgGoldfish"
        onChange={onLinkChange}
        isInvalid={!validatedLink}
        errorMessage="Invalid deck link"
      />
      <SelectFormat name="formatId" onChange={onFormatChange} />
      <SelectFormatVersion
        name="formatVersionId"
        value={selectedFormatVersion}
        description='Automatically changes to "latest" after format change'
      />
      {formatId && <SelectDeckArchetype name="deckArchetypeId" formatId={formatId} />}
      <Button type="submit">Create</Button>
    </form>
  );
}
