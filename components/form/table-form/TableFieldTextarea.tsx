'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { Textarea } from '@nextui-org/input';
import useStore from '@/store/store';
import { ChangeEventHandler, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';
import LabelledValue from '@/components/typography/LabelledValue';
import Title from '@/components/typography/Title';

export type TableFieldTextareaProps = {
  type: 'textarea';
  value?: string;
  selectAllOnFocus?: boolean;
  isMainTitle?: boolean;
} & TableFieldProps;

export default function TableFieldTextarea({
  type,
  tableId,
  id,
  fieldName,
  value,
  label,
  editable,
  onChange,
  endContent,
  isPending,
  isLabelledView,
  isMainTitle,
}: TableFieldTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const changeHandler = useCallback(
    (e: { target: { value?: string } }) => {
      const val = e.target.value ?? '';
      if (value !== val) {
        if (onChange) onChange(id, fieldName, val);
      }
    },
    [onChange, id, fieldName, value, type],
  );

  const debouncedChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(changeHandler, 1000),
    [changeHandler],
  );

  const content = useMemo(() => {
    if (isSelected)
      return (
        <Textarea
          ref={ref}
          label={label}
          size="sm"
          name={fieldName}
          defaultValue={value}
          onChange={debouncedChangeHandler}
          onBlur={changeHandler}
          endContent={isPending ? <FieldCircularProgress /> : endContent}
        />
      );
    if (value === '' || !value) return <p className="text-xs italic">- empty -</p>;
    return <p>{value}</p>;
  }, [
    isSelected,
    label,
    fieldName,
    value,
    debouncedChangeHandler,
    changeHandler,
    isPending,
    endContent,
    type,
  ]);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
      setTimeout(() => {
        ref.current?.focus();
        ref.current?.select();
      }, 100);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  const isLabelledViewVisible = !isSelected && isLabelledView;

  return isLabelledViewVisible ? (
    <LabelledValue label={label} value={content} onClick={selectRow} />
  ) : (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {isMainTitle && !isSelected ? <Title title={value ?? '-'} size="xl" /> : content}
    </div>
  );
}
