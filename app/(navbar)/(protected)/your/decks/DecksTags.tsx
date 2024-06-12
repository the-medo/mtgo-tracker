import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useRef } from 'react';
import useCreateTag from '@/components/tags/useCreateTag';
import { TagType } from '@prisma/client';
import { Spinner } from '@nextui-org/spinner';

export default function DecksTags() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = inputRef?.current?.value ?? '';

  const { createTag, isPending } = useCreateTag({ type: TagType.DECK, formRef, inputRef });

  return (
    <>
      <form ref={formRef} className="flex flex-row gap-2 items-center" action={createTag}>
        <Input ref={inputRef} size="sm" name="name" />
        <Button type="submit" size="sm" disabled={value.length === 0}>
          {isPending ? <Spinner size="sm" color="primary" /> : 'Create'}
        </Button>
      </form>
    </>
  );
}
