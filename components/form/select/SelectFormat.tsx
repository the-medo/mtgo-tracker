import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Format } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { getFormats } from '@/app/api/format/getFormats';

export function textValueFormat(f: Format | undefined): string {
  if (!f) return ` - no format - `;
  return f.name;
}

type Props = {
  textOnly?: boolean;
  value?: number | string;
  isLoading?: boolean;
  name?: string;
  onChange?: (x: number | string) => void;
};

export default function SelectFormat({ textOnly, value, isLoading, name, onChange }: Props) {
  const { isPending, data } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
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
    return textValueFormat(selectedValue);
  }

  return (
    <Select
      size="sm"
      label="Format"
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading || isPending}
      // @ts-ignore
      defaultSelectedKeys={[selectedValue?.id.toString()]}
    >
      {(data ?? []).map(fv => (
        <SelectItem key={fv.id}>{textValueFormat(fv)}</SelectItem>
      ))}
    </Select>
  );
}
