import { QK } from '@/app/api/queryHelpers';
import useSimplePost from '@/app/api/useSimplePost';
import { RefObject, useCallback } from 'react';
import { TagType } from '@prisma/client';
import { tagTypeToQK } from '@/app/api/tag/getTags';

type Props = {
  type: TagType;
  formRef?: RefObject<HTMLFormElement>;
  inputRef?: RefObject<HTMLInputElement>;
};

export default function useCreateTag({ type, formRef, inputRef }: Props) {
  const { mutate, isPending } = useSimplePost(tagTypeToQK[type]);

  const createTag = useCallback(
    async (formData: FormData) => {
      formRef?.current?.reset();

      const data = {
        type,
        name: formData.get('name'),
      };

      mutate(data);

      inputRef?.current?.focus();
    },
    [formRef, inputRef, mutate, type],
  );

  return {
    createTag,
    isPending,
  };
}
