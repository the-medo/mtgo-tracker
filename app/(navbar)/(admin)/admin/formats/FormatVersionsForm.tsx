'use client';

import { Input } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef } from 'react';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';

export default function FormatVersionsForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.FORMAT_VERSIONS);

  const createFormatVersion = useCallback(
    async (formData: FormData) => {
      ref.current?.reset();

      const data = {
        latestRelease: formData.get('latestRelease'),
        latestBans: formData.get('latestBans'),
        description: formData.get('description'),
        validFrom: formData.get('validFrom'),
      };

      mutate(data);
    },
    [mutate],
  );

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Title title="New Format Version" />
      </CardHeader>
      <CardBody>
        <form ref={ref} action={createFormatVersion} className="flex flex-col gap-2">
          <Input type="text" label="Latest release" size="sm" name="latestRelease" />
          <Input type="text" label="Latest bans" size="sm" name="latestBans" />
          <Input type="text" label="Description" size="sm" name="description" />
          <DatePicker label="Valid from" size="sm" name="validFrom" />
          <Button type="submit">Create</Button>
        </form>
      </CardBody>
    </Card>
  );
}
