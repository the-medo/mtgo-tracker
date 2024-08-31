import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Format } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { getFormats } from '@/app/api/format/getFormats';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import { TbTower } from 'react-icons/tb';
import { parseNumber } from '@/app/api/parsers';
import useSelect from '@/components/form/select/useSelect';

export function textValueFormat(f: Format | undefined): string {
  if (!f) return ` - no format - `;
  return f.name;
}

export type SelectFormatPropsOuter = {
  selectType: QK.FORMATS;
};

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbTower size={20} />
    Format
  </div>
);

type SelectFormatProps = BaseSelectProps & Omit<SelectFormatPropsOuter, 'selectType'>;

export default function SelectFormat({
  textOnly,
  value,
  isLoading,
  name,
  onChange,
}: SelectFormatProps) {
  const { localValue, onChangeHandler, getSelection } = useSelect<Format>({
    value,
    onChange,
    isNumber: true,
  });

  const { isPending, data } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const { selectedItem, selectedKeys } = useMemo(
    () => getSelection(data, localValue),
    [getSelection, data, localValue],
  );

  if (textOnly) {
    return textValueFormat(selectedItem);
  }

  return (
    <Select
      size="sm"
      label={label}
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading || isPending}
      // @ts-ignore
      defaultSelectedKeys={selectedKeys}
      selectedKeys={selectedKeys}
    >
      {(data ?? []).map(fv => (
        <SelectItem key={fv.id}>{textValueFormat(fv)}</SelectItem>
      ))}
    </Select>
  );
}
