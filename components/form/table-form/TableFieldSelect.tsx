'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { Input } from '@nextui-org/input';
import useStore from '@/store/store';
import { ChangeEventHandler, useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';

export type TableFieldSelectProps = {
  type: 'select';
  value?: string | number;
} & TableFieldProps;

export default function TableFieldSelect({
  tableId,
  id,
  fieldName,
  value,
  label,
  editable,
  onChange,
  endContent,
  isPending,
}: TableFieldSelectProps) {
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const changeHandler = useCallback(
    (x: number | string) => {
      const val = x ?? '';
      if (value !== val) {
        if (onChange) onChange(id, fieldName, val);
      }
    },
    [onChange, id, fieldName, value],
  );

  const content = useMemo(() => {
    return (
      <SelectFormatVersion
        textOnly={!isSelected}
        name={fieldName}
        value={value}
        onChange={changeHandler}
        // endContent={isPending ? <FieldCircularProgress /> : endContent}
      />
    );
  }, [isSelected, fieldName, value, changeHandler]);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  return (
    <div className="w-full h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
