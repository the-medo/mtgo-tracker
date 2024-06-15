'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import useStore from '@/store/store';
import { useCallback, useMemo } from 'react';
import { Tag } from '@prisma/client';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem } from '@nextui-org/select';
import { emptyRequest, qkToTagType, useTags } from '@/app/api/tag/getTags';
import { TbTag } from 'react-icons/tb';
import { MultipleSelection, Selection } from '@react-types/shared/src/selection';

export type TableFieldTagsProps = {
  type: 'tags';
  values: Tag[];
} & TableFieldProps;

export default function TableFieldTags({
  tableId,
  id,
  fieldName,
  values,
  label,
  editable,
  onChange,
  endContent,
  isPending,
  qk,
  ...other
}: TableFieldTagsProps) {
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);
  const { data: tags } = useTags(qkToTagType[qk], emptyRequest, !isSelected);

  const changeHandler: MultipleSelection['onSelectionChange'] = useCallback((x: Selection) => {
    console.log('TableFieldTags - changeHandler', x);
  }, []);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  const content = useMemo(() => {
    if (isSelected) {
      return (
        <Select
          label="Tags"
          selectionMode="multiple"
          onSelectionChange={changeHandler}
          startContent={<TbTag />}
        >
          {(tags ?? [])?.map(t => <SelectItem key={t.id}>{t.name}</SelectItem>)}
        </Select>
      );
    } else {
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {(values ?? []).map(v => (
            <Chip key={v.id} variant="flat">
              {v.name}
            </Chip>
          ))}
        </div>
      );
    }
  }, [isSelected, values, changeHandler, tags]);

  return (
    <div className="w-full h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
