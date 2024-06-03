import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { getDeleteRequest } from '@/components/form/table-form/tableFieldEvents';
import { TbTrash } from 'react-icons/tb';
import { Button } from '@nextui-org/button';

interface Props {
  id: number | string;
  path: string;
}

export default function DeleteButton({ id, path }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = useCallback(getDeleteRequest(path, router, startTransition), [router, path]);

  return (
    <Button
      isIconOnly
      color="danger"
      size="sm"
      onClick={() => onDelete(id)}
      isLoading={isPending}
      disabled={isPending}
    >
      <TbTrash size={16} />
    </Button>
  );
}
