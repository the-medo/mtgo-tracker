'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { Input } from '@nextui-org/input';
import useStore from '@/store/store';
import { ChangeEventHandler, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';

export type TableFieldStringProps = {
  type: 'string';
  value?: string;
  selectAllOnFocus?: boolean;
} & TableFieldProps;

export default function TableFieldString({
  tableId,
  id,
  fieldName,
  value,
  label,
  editable,
  onChange,
  endContent,
  isPending,
}: TableFieldStringProps) {
  const ref = useRef<HTMLInputElement>(null);
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
    [onChange, id, fieldName, value],
  );

  const debouncedChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(changeHandler, 1000),
    [changeHandler],
  );

  const content = useMemo(() => {
    if (isSelected)
      return (
        <Input
          ref={ref}
          type="text"
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

  return (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
