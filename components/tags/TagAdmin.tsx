'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { FormEventHandler, KeyboardEventHandler, useCallback, useRef } from 'react';
import useCreateTag from '@/components/tags/useCreateTag';
import { TagType } from '@prisma/client';
import { Spinner } from '@nextui-org/spinner';
import { useTags } from '@/app/api/tag/getTags';
import { Chip } from '@nextui-org/chip';
import { TbTag } from 'react-icons/tb';

type TagAdminProps = {
  type: TagType;
};

export default function TagAdmin({ type }: TagAdminProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = inputRef?.current?.value ?? '';

  const { createTag, isPending } = useCreateTag({ type, formRef, inputRef });
  const { data } = useTags(type);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      console.log({ formData });
      createTag(formData);
    },
    [createTag],
  );

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      formRef.current?.requestSubmit();
    }
  };

  const handleDelete = () => {};

  return (
    <div className="flex flex-col gap-4">
      <form ref={formRef} className="flex flex-row gap-2 items-center" onSubmit={onSubmit}>
        <Input
          type="text"
          ref={inputRef}
          size="sm"
          name="name"
          startContent={<TbTag size={20} />}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" size="sm" disabled={value.length === 0}>
          {isPending ? <Spinner size="sm" color="primary" /> : 'Create'}
        </Button>
      </form>
      <div className="flex gap-2 flex-wrap">
        {data?.map((tag, index) => (
          <Chip key={tag.id} onClose={() => handleDelete} variant="flat">
            {tag.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
