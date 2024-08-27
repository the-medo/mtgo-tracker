'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { Input } from '@nextui-org/input';
import useStore from '@/store/store';
import { ChangeEventHandler, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';
import LabelledValue from '@/components/typography/LabelledValue';
import Title from '@/components/typography/Title';

export type TableFieldStringProps = {
  type: 'string' | 'number';
  value?: string | number;
  selectAllOnFocus?: boolean;
  isMainTitle?: boolean;
} & TableFieldProps;

export default function TableFieldString({
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
}: TableFieldStringProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const changeHandler = useCallback(
    (e: { target: { value?: string } }) => {
      const val = type === 'number' ? parseInt(e.target.value ?? '') : e.target.value ?? '';
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

  const stringValue = typeof value === 'number' ? value.toString() : value;

  const content = useMemo(() => {
    if (isSelected)
      return (
        <Input
          ref={ref}
          className="bg-white"
          type={type === 'string' ? 'text' : 'number'}
          label={label}
          size="sm"
          name={fieldName}
          defaultValue={stringValue}
          onChange={debouncedChangeHandler}
          onBlur={changeHandler}
          endContent={isPending ? <FieldCircularProgress /> : endContent}
        />
      );
    if (value === '' || value === undefined || value === null)
      return <p className="text-xs italic">- empty -</p>;
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
      {isMainTitle && !isSelected ? <Title title={stringValue ?? '-'} size="xl" /> : content}
    </div>
  );
}
