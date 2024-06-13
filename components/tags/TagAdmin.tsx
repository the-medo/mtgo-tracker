'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { FormEventHandler, KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import useCreateTag from '@/components/tags/useCreateTag';
import { TagType } from '@prisma/client';
import { Spinner } from '@nextui-org/spinner';
import { tagTypeToQK, useTags } from '@/app/api/tag/getTags';
import { Chip } from '@nextui-org/chip';
import { TbTag } from 'react-icons/tb';
import useSimpleDelete from '@/app/api/useSimpleDelete';
import useSimplePatch from '@/app/api/useSimplePatch';

type TagAdminProps = {
  type: TagType;
};

export default function TagAdmin({ type }: TagAdminProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<number>();

  const value = inputRef?.current?.value ?? '';

  const { createTag, isPending } = useCreateTag({ type, formRef, inputRef });
  const { mutate: patchTag, isPending: isPendingPatch } = useSimplePatch(tagTypeToQK[type]);
  const { data } = useTags(type);

  const { mutate: deleteTag } = useSimpleDelete(tagTypeToQK[type]);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      console.log({ formData, name: formData.get('name') });
      if (!selectedId) {
        createTag(formData);
      } else {
        const v = formData.get('name') as string | undefined;
        if (v && v !== '') {
          patchTag({
            id: selectedId,
            field: 'name',
            value: v,
          });
        }
        formRef?.current?.reset();
        inputRef?.current?.focus();
        setSelectedId(undefined);
      }
    },
    [createTag, selectedId, patchTag],
  );

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      formRef.current?.requestSubmit();
    }
  };

  const selectTag = useCallback((id: number, name: string) => {
    setSelectedId(id);
    if (inputRef.current) {
      console.log('Selecting... ', name);
      inputRef.current.value = name;
    }
  }, []);

  const buttonText = selectedId ? 'Update' : 'Create';
  const loading = isPending || isPendingPatch;

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
          {loading ? <Spinner size="sm" color="primary" /> : buttonText}
        </Button>
      </form>
      <div className="flex gap-2 flex-wrap">
        {data?.map((tag, index) => (
          <Chip
            key={tag.id}
            variant={selectedId === tag.id ? 'shadow' : 'flat'}
            onClick={() => selectTag(tag.id, tag.name)}
            onClose={() => deleteTag({ id: tag.id })}
          >
            {tag.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
