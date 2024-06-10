import { useCallback } from 'react';
import { TbEdit, TbTrash, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import useSimpleDelete from '@/app/api/useSimpleDelete';
import { QK } from '@/app/api/queryHelpers';
import useStore from '@/store/store';

interface EditButtonProps {
  tableId: string;
  id: number | string;
  qk: QK;
}

export default function EditButton({ tableId, id, qk }: EditButtonProps) {
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const toggleSelectedId = useStore(state => state.toggleSelectedId);

  return (
    <Button isIconOnly size="sm" onClick={() => toggleSelectedId(tableId, id)}>
      {isSelected ? <TbX size={16} /> : <TbEdit size={16} />}
    </Button>
  );
}
