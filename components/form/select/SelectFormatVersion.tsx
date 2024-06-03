import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, Key, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';
import { FormatVersion } from '@prisma/client';
import { FORMAT_VERSIONS_QUERY_KEY } from '@/app/api/format-version/usePostFormatVersion';

export function textValueFormatVersion(fv: FormatVersion | undefined): string {
  if (!fv) return ` - no value - `;
  return `${fv.latestRelease ? `[${fv.latestRelease}]` : ''} ${fv.latestBans}`;
}

type Props = {
  textOnly?: boolean;
  value?: number | string;
  isLoading?: boolean;
  name?: string;
  onChange?: (x: number | string) => void;
};

export default function SelectFormatVersion({ textOnly, value, isLoading, name, onChange }: Props) {
  const { isPending, data } = useQuery({
    queryKey: [FORMAT_VERSIONS_QUERY_KEY],
    queryFn: getFormatVersions,
  });

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      console.log('onChangeHandler', e);
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange],
  );

  const selectedValue = useMemo(() => {
    if (value) return data?.find(fv => fv.id === value);
  }, [value, data]);

  if (textOnly) {
    return textValueFormatVersion(selectedValue);
  }

  return (
    <Select
      size="sm"
      label="Format version"
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading || isPending}
      // @ts-ignore
      defaultSelectedKeys={[selectedValue?.id.toString()]}
    >
      {(data ?? []).map(fv => (
        <SelectItem key={fv.id} textValue={textValueFormatVersion(fv)} description={fv.description}>
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
  );
}
