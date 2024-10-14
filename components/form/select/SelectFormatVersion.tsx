'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';
import { FormatVersion } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';

export function textValueFormatVersion(fv: FormatVersion | undefined): string {
  if (!fv) return ` - no version - `;
  return `${fv.latestRelease ? `[${fv.latestRelease}]` : ''} ${fv.latestBans ?? ''}`;
}

export type SelectFormatVersionPropsOuter = {
  selectType: QK.FORMAT_VERSIONS;
};

type SelectFormatVersionProps = BaseSelectProps & Omit<SelectFormatVersionPropsOuter, 'selectType'>;

export default function SelectFormatVersion({
  textOnly,
  value,
  isLoading,
  name,
  onChange,
  description,
}: SelectFormatVersionProps) {
  const [selectedValue, setSelectedValue] = useState(value?.toString());
  const { isPending, data } = useQuery({
    queryKey: [QK.FORMAT_VERSIONS],
    queryFn: getFormatVersions,
  });

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      console.log('onChangeHandler SelectFormatVersion', e);
      setSelectedValue(e.target.value);
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange],
  );

  useEffect(() => {
    if (value) setSelectedValue(value?.toString());
  }, [value]);

  const selectedItem = data?.find(i => i.id.toString() === selectedValue);
  const selectedKeys = selectedItem ? [selectedItem.id?.toString()] : undefined;

  if (textOnly) {
    return textValueFormatVersion(selectedItem);
  }

  return (
    <>
      <Select
        size="sm"
        label="Format version"
        selectionMode="single"
        className="max-w-xs"
        onChange={onChangeHandler}
        name={name}
        isLoading={isLoading || isPending}
        // @ts-ignore
        selectedKeys={selectedKeys}
        defaultSelectedKeys={selectedKeys}
        description={description}
      >
        {(data ?? []).map(fv => (
          <SelectItem
            key={fv.id}
            textValue={textValueFormatVersion(fv)}
            description={fv.description}
          >
            {fv.id}
            <div className="flex flex-row gap-2">
              {fv.latestRelease && fv.latestRelease !== '' ? (
                <p className="text-medium">[{fv.latestRelease}]</p>
              ) : undefined}
              {fv.latestBans && fv.latestBans !== '' ? (
                <p className="text-medium">({fv.latestBans})</p>
              ) : undefined}
            </div>
          </SelectItem>
        ))}
      </Select>
    </>
  );
}
