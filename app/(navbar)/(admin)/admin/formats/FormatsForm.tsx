'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef } from 'react';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';

export default function FormatsForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.FORMATS);

  const createFormat = useCallback(
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

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Title title="New Format" />
      </CardHeader>
      <CardBody>
        <form ref={ref} action={createFormat} className="flex flex-col gap-2">
          <Input type="text" label="Name" size="sm" name="name" />
          <SelectFormatVersion name="latestFormatVersionId" />
          <Button type="submit">Create</Button>
        </form>
      </CardBody>
    </Card>
  );
}
