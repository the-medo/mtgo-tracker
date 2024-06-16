'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import useStore from '@/store/store';
import { Key, useCallback, useMemo } from 'react';
import { Tag } from '@prisma/client';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem } from '@nextui-org/select';
import { emptyRequest, qkToTagType, useTags } from '@/app/api/tag/getTags';
import { TbTag } from 'react-icons/tb';
import { MultipleSelection, Selection } from '@react-types/shared/src/selection';
import useTagAssignmentPost from '@/app/api/tag-assignment/useTagAssignmentPost';

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
  const tagType = qkToTagType[qk];
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);
  const { data: tags } = useTags(tagType, emptyRequest, !isSelected);
  const { mutate: assignTag } = useTagAssignmentPost(tagType, qk);

  const selectedKeys = values.map(v => v.id.toString());

  const changeHandler: MultipleSelection['onSelectionChange'] = useCallback(
    (x: Selection) => {
      if (x === 'all') return;
      console.log('TableFieldTags - changeHandler', x);
      const arrayKeys = Array.from(x);
      const tagsToAdd = arrayKeys.filter(
        key => typeof key === 'string' && !selectedKeys.includes(key),
      );
      if (tagsToAdd.length > 0) {
        console.log('Will add these tags: ', tagsToAdd);
        if (tagsToAdd.length > 1) {
          console.log('more than 1 tag, weird');
          return;
        }
        tagsToAdd.forEach(tagId => {
          assignTag({
            type: tagType,
            tagId,
            deckId: id,
          });
        });
      } else {
        const tagsToDelete = selectedKeys.filter(k => !arrayKeys.includes(k));
        console.log('Will delete these tags: ', tagsToDelete);
      }
    },
    [selectedKeys],
  );

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
          selectedKeys={selectedKeys}
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
  }, [isSelected, changeHandler, selectedKeys, tags, values]);

  return (
    <div className="w-full h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
