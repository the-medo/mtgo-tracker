import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeGroup } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { getArchetypeGroups } from '@/app/api/archetype-group/getArchetypeGroups';

export function textValueArchetypeGroup(f: ArchetypeGroup | undefined): string {
  if (!f) return ` - no arch. group - `;
  return f.name;
}

type Props = {
  textOnly?: boolean;
  value?: number | string;
  isLoading?: boolean;
  name?: string;
  onChange?: (x: number | string) => void;
};

export default function SelectArchetypeGroup({
  textOnly,
  value,
  isLoading,
  name,
  onChange,
}: Props) {
  const { isPending, data } = useQuery({
    queryKey: [QK.ARCHETYPE_GROUPS],
    queryFn: getArchetypeGroups,
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
    return textValueArchetypeGroup(selectedValue);
  }

  return (
    <Select
      size="sm"
      label="Archetype group"
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading || isPending}
      // @ts-ignore
      defaultSelectedKeys={[selectedValue?.id.toString()]}
    >
      {(data ?? []).map(fv => (
        <SelectItem key={fv.id}>{textValueArchetypeGroup(fv)}</SelectItem>
      ))}
    </Select>
  );
}
