'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import { DatePicker } from '@nextui-org/react';
import { useCallback, useMemo, useRef } from 'react';
import useStore from '@/store/store';
import debounce from 'lodash.debounce';
import { fromDate, ZonedDateTime } from '@internationalized/date';
import FieldCircularProgress from '@/components/form/table-form/FieldCircularProgress';

function zonedDateTimeToISOString(zdt: ZonedDateTime): string {
  const { year, month, day } = zdt;
  const d = new Date(`${year}-${month}-${day}`);
  return d.toISOString();
}

export type TableFieldDateProps = {
  type: 'date';
  value?: Date;
} & TableFieldProps;

export default function TableFieldDate({
  tableId,
  id,
  fieldName,
  value,
  label,
  editable,
  onChange,
  isPending,
  endContent,
}: TableFieldDateProps) {
  const ref = useRef(null);
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const val = useMemo(() => (value ? fromDate(value, 'GMT') : undefined), [value]);

  const changeHandler = useCallback(
    (e: ZonedDateTime) => {
      if (onChange) onChange(id, fieldName, zonedDateTimeToISOString(e));
    },
    [onChange, id, fieldName],
  );

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 1000), [changeHandler]);

  const content = useMemo(() => {
    if (isSelected)
      return (
        <DatePicker
          ref={ref}
          label={label}
          size="sm"
          name={fieldName}
          defaultValue={val}
          onChange={debouncedChangeHandler}
          granularity="day"
          endContent={isPending ? <FieldCircularProgress /> : endContent}
        />
      );
    if (!value) return <p className="text-xs italic">- empty -</p>;
    return (
      <DatePicker
        size="sm"
        isDisabled
        defaultValue={val}
        granularity="day"
        selectorIcon={null}
        aria-label={label}
      />
    );
  }, [isSelected, label, fieldName, debouncedChangeHandler, val, isPending, endContent]);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  return (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
