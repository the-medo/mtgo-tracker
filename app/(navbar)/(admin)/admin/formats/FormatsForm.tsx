'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import Title from '@/components/typography/Title';
import { useCallback, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';

export default function FormatsForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);

  const createFormat = useCallback(
    async (formData: FormData) => {
      ref.current?.reset();

      const latestFormatVersionId = formData.get('latestFormatVersionId') as string | undefined;

      const data = {
        name: formData.get('name'),
        latestFormatVersionId: latestFormatVersionId ? parseInt(latestFormatVersionId) : undefined,
      };

      const res = await fetch('/api/format', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      startTransition(() => {
        router.refresh();
      });
    },
    [router],
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
          <Button type="submit" disabled={isPending} isLoading={isPending}>
            Create
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
