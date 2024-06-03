'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef } from 'react';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectArchetypeGroup from '@/components/form/select/SelectArchetypeGroup';

export default function DeckArchetypesForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.DECK_ARCHETYPE);

  const createDeckArchetype = useCallback(
    async (formData: FormData) => {
      ref.current?.reset();

      const formatId = formData.get('formatId') as string | undefined;
      const archetypeGroupId = formData.get('archetypeGroupId') as string | undefined;

      const data = {
        name: formData.get('name'),
        formatId: formatId ? parseInt(formatId) : undefined,
        archetypeGroupId: archetypeGroupId ? parseInt(archetypeGroupId) : undefined,
      };

      mutate(data);
    },
    [mutate],
  );

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Title title="New deck archetype" />
      </CardHeader>
      <CardBody>
        <form ref={ref} action={createDeckArchetype} className="flex flex-col gap-2">
          <Input type="text" label="Name" size="sm" name="name" />
          <SelectFormat name="formatId" />
          <SelectArchetypeGroup name="archetypeGroupId" />
          <Button type="submit">Create</Button>
        </form>
      </CardBody>
    </Card>
  );
}
