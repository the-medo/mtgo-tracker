'use client';

import { useCallback } from 'react';
import { TbEdit, TbX } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import { QK } from '@/app/api/queryHelpers';
import useStore from '@/store/store';

interface EditButtonProps {
  tableId: string;
  id: number | string;
  qk: QK;
  onPress?: () => void;
  isToggle?: boolean;
}

export default function EditButton({ tableId, id, qk, onPress, isToggle = true }: EditButtonProps) {
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const toggleSelectedId = useStore(state => state.toggleSelectedId);
  const setSelectedId = useStore(state => state.setSelectedId);

  const onPressHandler = useCallback(() => {
    if (onPress) onPress();
    if (isToggle) {
      toggleSelectedId(tableId, id);
    } else {
      setSelectedId(tableId, id);
    }
  }, [onPress, toggleSelectedId, tableId, id, isToggle, setSelectedId]);

  return (
    <Button isIconOnly size="sm" onPress={onPressHandler}>
      {isSelected && isToggle ? <TbX size={16} /> : <TbEdit size={16} />}
    </Button>
  );
}
