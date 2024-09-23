import { useCallback } from 'react';
import { TbTrash } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import useSimpleDelete from '@/app/api/useSimpleDelete';
import { QTypes } from '@/app/api/queryHelpers';

interface Props {
  id: number | string;
  qk: keyof QTypes;
}

export default function DeleteButton({ id, qk }: Props) {
  const { mutate } = useSimpleDelete(qk);

  const onDelete = useCallback(() => {
    mutate({ id });
  }, [mutate, id]);

  return (
    <Button isIconOnly color="danger" size="sm" onClick={onDelete}>
      <TbTrash size={16} />
    </Button>
  );
}
