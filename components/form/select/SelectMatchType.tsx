'use client';

import { Select, SelectItem } from '@nextui-org/select';
import { MatchType } from '@prisma/client';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import useSelect from '@/components/form/select/useSelect';
import { useMemo } from 'react';
import { TbBoxMultiple3 } from 'react-icons/tb';

type MatchTypeOption = { id: MatchType; label: string };

const matchTypes: MatchTypeOption[] = [
  { id: MatchType.BO1, label: 'Best of 1' },
  { id: MatchType.BO3, label: 'Best of 3' },
  { id: MatchType.BO5, label: 'Best of 5' },
  { id: MatchType.OTHER, label: 'Other' },
];

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbBoxMultiple3 size={20} />
    Match type
  </div>
);

export function textValueMatchType(f: MatchTypeOption | undefined): string {
  if (!f) return ` - no match type - `;
  return f.label;
}

export type SelectMatchTypePropsOuter = {
  selectType: 'MATCH_TYPE';
};

type SelectMatchTypeProps = BaseSelectProps & Omit<SelectMatchTypePropsOuter, 'selectType'>;

export default function SelectMatchType({
  textOnly,
  value,
  isLoading,
  name,
  onChange,
}: SelectMatchTypeProps) {
  const { localValue, onChangeHandler, getSelection } = useSelect<MatchTypeOption>({
    value,
    onChange,
  });

  const { selectedItem, selectedKeys } = useMemo(
    () => getSelection(matchTypes, localValue),
    [getSelection, localValue],
  );

  if (textOnly) {
    return textValueMatchType(selectedItem);
  }

  return (
    <Select
      size="sm"
      label={label}
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading}
      // @ts-ignore
      defaultSelectedKeys={selectedKeys}
      selectedKeys={selectedKeys}
    >
      {matchTypes.map(et => (
        <SelectItem key={et.id}>{et.label}</SelectItem>
      ))}
    </Select>
  );
}
