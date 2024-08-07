'use client';

import { TableFieldProps } from '@/components/form/table-form/TableField';
import useStore from '@/store/store';
import { ReactNode, useCallback, useMemo } from 'react';
import SelectFormatVersion, {
  SelectFormatVersionPropsOuter,
} from '@/components/form/select/SelectFormatVersion';
import SelectFormat, { SelectFormatPropsOuter } from '@/components/form/select/SelectFormat';
import SelectArchetypeGroup, {
  SelectArchetypeGroupPropsOuter,
} from '@/components/form/select/SelectArchetypeGroup';
import { QK } from '@/app/api/queryHelpers';
import SelectDeckArchetype, {
  SelectDeckArchetypePropsOuter,
} from '@/components/form/select/SelectDeckArchetype';
import SelectEventType, {
  SelectEventTypePropsOuter,
} from '@/components/form/select/SelectEventType';
import SelectMatchType, {
  SelectMatchTypePropsOuter,
} from '@/components/form/select/SelectMatchType';
import SelectDeck, { SelectDeckPropsOuter } from '@/components/form/select/SelectDeck';
import SelectEvent, { SelectEventPropsOuter } from '@/components/form/select/SelectEvent';
import LabelledValue from '@/components/typography/LabelledValue';

export type BaseSelectProps = {
  textOnly?: boolean;
  value?: number | string;
  isLoading?: boolean;
  name?: string;
  description?: string;
  onChange?: (x: number | string | undefined) => void;
  customLabel?: ReactNode;
};

export type TableFieldSelectProps = {
  type: 'select';
  value?: string | number;
} & TableFieldProps &
  (
    | SelectFormatPropsOuter
    | SelectFormatVersionPropsOuter
    | SelectArchetypeGroupPropsOuter
    | SelectDeckArchetypePropsOuter
    | SelectDeckPropsOuter
    | SelectEventPropsOuter
    | SelectEventTypePropsOuter
    | SelectMatchTypePropsOuter
  );

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
  qk,
  ...other
}: TableFieldSelectProps) {
  const isSelected = useStore(state => state.tables[tableId]?.selectedIds[id]);
  const setSelectedId = useStore(state => state.setSelectedId);
  const setClickedColumn = useStore(state => state.setClickedColumn);

  const changeHandler = useCallback(
    (x: number | string | undefined) => {
      const val = x ?? '';
      if (value !== val) {
        if (onChange) onChange(id, fieldName, val);
      }
    },
    [onChange, id, fieldName, value],
  );

  const content = useMemo(() => {
    switch (other.selectType) {
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
      case QK.DECK_ARCHETYPE:
        return (
          <SelectDeckArchetype
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
            {...other}
          />
        );
      case QK.DECK:
        return (
          <SelectDeck
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
            {...other}
          />
        );
      case QK.EVENT:
        return (
          <SelectEvent
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
            {...other}
          />
        );
      case 'EVENT_TYPE':
        return (
          <SelectEventType
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
            {...other}
          />
        );
      case 'MATCH_TYPE':
        return (
          <SelectMatchType
            textOnly={!isSelected}
            name={fieldName}
            value={value}
            onChange={changeHandler}
            {...other}
          />
        );
    }
  }, [isSelected, fieldName, value, changeHandler, other]);

  const selectRow = useCallback(() => {
    if (editable && !isSelected) {
      setSelectedId(tableId, id);
      setClickedColumn(tableId, fieldName);
    }
  }, [editable, setSelectedId, tableId, id, isSelected, setClickedColumn, fieldName]);

  const isLabelledViewVisible = !isSelected && other.isLabelledView;

  return isLabelledViewVisible ? (
    <LabelledValue label={label} value={content} onClick={selectRow} />
  ) : (
    <div className="w-full min-h-[48px] flex items-center justify-items-start" onClick={selectRow}>
      {content}
    </div>
  );
}
