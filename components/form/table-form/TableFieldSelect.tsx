'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import useStore from '@/store/store';
import { useCallback, useMemo } from 'react';
import SelectFormatVersion, {
  SelectFormatVersionPropsOuter,
} from '@/components/form/select/SelectFormatVersion';
import SelectFormat, { SelectFormatPropsOuter } from '@/components/form/select/SelectFormat';
import SelectArchetypeGroup, {
  SelectArchetypeGroupPropsOuter,
} from '@/components/form/select/SelectArchetypeGroup';
import { QK } from '@/app/api/queryHelpers';

export type BaseSelectProps = {
  textOnly?: boolean;
  value?: number | string;
  isLoading?: boolean;
  name?: string;
  onChange?: (x: number | string) => void;
};

export type TableFieldSelectProps = {
  type: 'select';
  value?: string | number;
} & TableFieldProps &
  (SelectFormatPropsOuter | SelectFormatVersionPropsOuter | SelectArchetypeGroupPropsOuter);

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
  selectType,
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
    switch (selectType) {
      case QK.FORMATS:
        return (
          <SelectFormat
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
          />
        );
      case QK.FORMAT_VERSIONS:
        return (
          <SelectFormatVersion
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
          />
        );
      case QK.ARCHETYPE_GROUPS:
        return (
          <SelectArchetypeGroup
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
          />
        );
    }
  }, [isSelected, fieldName, value, changeHandler, selectType]);

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
