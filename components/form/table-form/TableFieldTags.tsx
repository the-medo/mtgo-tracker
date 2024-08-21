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
import { TagAssignment } from '@/types/tags';
import useTagAssignmentDelete from '@/app/api/tag-assignment/useTagAssignmentDelete';
import LabelledValue from '@/components/typography/LabelledValue';
import cn from 'classnames';

export type TableFieldTagsProps = {
  type: 'tags';
  values: TagAssignment[];
  displaySelect?: boolean;
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
  displaySelect = true,
  ...other
}: TableFieldTagsProps) {
  const tagType = qkToTagType[qk];
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);
  const { data: tags } = useTags(tagType);
  const { mutate: assignTag, isPending: isPendingPost } = useTagAssignmentPost(tagType, qk);
  const { mutate: deleteTag, isPending: isPendingDelete } = useTagAssignmentDelete(tagType, qk);
  const isLoading = isPendingPost || isPendingDelete;

  const selectedKeys = useMemo(() => (values ?? []).map(v => v.tagId.toString()), [values]);

  const changeHandler: MultipleSelection['onSelectionChange'] = useCallback(
    (x: Selection) => {
      if (x === 'all') return;
      const arrayKeys = Array.from(x);
      const tagsToAdd = arrayKeys.filter(
        key => typeof key === 'string' && !selectedKeys.includes(key),
      );
      if (tagsToAdd.length > 0) {
        if (tagsToAdd.length > 1) return;
        tagsToAdd.forEach(tagId => {
          assignTag({
            type: tagType,
            tagId: tagId,
            entityId: id,
          });
        });
      } else {
        const tagsToDelete = selectedKeys.filter(k => !arrayKeys.includes(k)).map(t => parseInt(t));
        tagsToDelete.forEach(tagId => {
          deleteTag({
            tagId,
            entityId: id,
          });
        });
      }
    },
    [selectedKeys, assignTag, tagType, id, deleteTag],
  );

  const toggleTag = useCallback(
    (tagId: number) => {
      if (selectedKeys.find(k => k === tagId.toString())) {
        deleteTag({
          tagId,
          entityId: id,
        });
      } else {
        assignTag({
          type: tagType,
          tagId: tagId,
          entityId: id,
        });
      }
    },
    [selectedKeys, deleteTag, id, assignTag],
  );

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  const content = useMemo(() => {
    if (isSelected && displaySelect) {
      return (
        <Select
          label="Tags"
          size="sm"
          selectionMode="multiple"
          onSelectionChange={changeHandler}
          startContent={<TbTag />}
          selectedKeys={selectedKeys}
          isLoading={isLoading}
        >
          {(tags ?? [])?.map(t => <SelectItem key={t.id}>{t.name}</SelectItem>)}
        </Select>
      );
    } else if (isSelected && !displaySelect) {
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {(tags ?? [])?.length === 0 && <p className="text-xs italic">No tags to choose from</p>}
          {(tags ?? []).map(v => {
            const isTagSelected = selectedKeys.find(k => k === v.id.toString());

            return (
              <Chip
                size="sm"
                key={v.id}
                color="default"
                variant={isTagSelected ? 'flat' : 'bordered'}
                onClick={() => toggleTag(v.id)}
                className={cn('cursor-pointer border-2', {
                  'border-transparent': isTagSelected,
                  'opacity-70': !isTagSelected,
                  'hover:opacity-100': !isTagSelected,
                })}
              >
                {v.name}
              </Chip>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {(tags ?? [])
            .filter(t => values.find(v => v.tagId === t.id))
            .map(v => (
              <Chip key={v.id} color="default" variant="flat" size="sm">
                {v.name}
              </Chip>
            ))}
        </div>
      );
    }
  }, [isLoading, isSelected, changeHandler, selectedKeys, tags, values, displaySelect, toggleTag]);

  const isLabelledViewVisible = !isSelected && other.isLabelledView;

  return isLabelledViewVisible ? (
    <LabelledValue label={label} value={content} onClick={selectRow} />
  ) : (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
