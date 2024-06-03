'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef } from 'react';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';

export default function ArchetypeGroupsForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.ARCHETYPE_GROUPS);

  const createArchetypeGroup = useCallback(
    async (formData: FormData) => {
      ref.current?.reset();

      const data = {
        name: formData.get('name'),
      };

      mutate(data);
    },
    [mutate],
  );

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Title title="New Archetype Group" />
      </CardHeader>
      <CardBody>
        <form ref={ref} action={createArchetypeGroup} className="flex flex-col gap-2">
          <Input type="text" label="Name" size="sm" name="name" />
          <Button type="submit">Create</Button>
        </form>
      </CardBody>
    </Card>
  );
}
