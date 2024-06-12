import { QK } from '@/app/api/queryHelpers';
import useSimplePost from '@/app/api/useSimplePost';
import { RefObject, useCallback } from 'react';
import { TagType } from '@prisma/client';

type Props = {
  type: TagType;
  formRef?: RefObject<HTMLFormElement>;
  inputRef?: RefObject<HTMLInputElement>;
};

export default function useCreateTag({ type, formRef, inputRef }: Props) {
  const { mutate, isPending } = useSimplePost(QK.TAG);

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
    [mutate],
  );

  return {
    createTag,
    isPending,
  };
}
