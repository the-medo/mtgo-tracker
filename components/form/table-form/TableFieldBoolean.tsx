'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { Checkbox } from '@nextui-org/react';
import { ChangeEventHandler, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import useStore from '@/store/store';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';
import LabelledValue from '@/components/typography/LabelledValue';

export type TableFieldBooleanProps = {
  type: 'boolean';
  value?: boolean;
} & TableFieldProps;

export default function TableFieldBoolean({
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
}: TableFieldBooleanProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const changeHandler = useCallback(
    (checked: boolean) => {
      if (value !== checked) {
        if (onChange) onChange(id, fieldName, checked);
      }
    },
    [onChange, id, fieldName, value],
  );

  const content = useMemo(() => {
    if (isSelected)
      return (
        <Checkbox
          name={fieldName}
          ref={ref}
          aria-label={label}
          isSelected={value}
          onValueChange={changeHandler}
        >
          {label}
          {isPending ? <FieldCircularProgress /> : null}
        </Checkbox>
      );
    if (value) return 'Yes';
    if (value === false) return 'No';
    return '-';
  }, [isSelected, label, value, isPending, fieldName, changeHandler]);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  const isLabelledViewVisible = !isSelected && isLabelledView;

  return isLabelledViewVisible ? (
    <LabelledValue label={label} value={content} onClick={selectRow} />
  ) : (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
