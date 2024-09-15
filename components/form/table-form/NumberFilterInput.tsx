import { Input, InputProps } from '@nextui-org/input';
import { Prisma } from '@prisma/client';
import IntFilter = Prisma.IntFilter;
import useSelect, { SelectOnChangeFunction } from '@/components/form/select/useSelect';
import React, { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import debounce from 'lodash.debounce';

type ConditionSelectOption = { id: keyof IntFilter; label: string };

/*Not used options (for now):
  in?: number[] | ListIntFieldRefInput<$PrismaModel>
  notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
  not?: NestedIntFilter<$PrismaModel> | number
*/
const conditionSelectTypes: ConditionSelectOption[] = [
  { id: 'equals', label: '==' },
  { id: 'lt', label: '<' },
  { id: 'lte', label: '<=' },
  { id: 'gt', label: '>' },
  { id: 'gte', label: '>=' },
];

interface ConditionSelectProps {
  value: keyof IntFilter;
  onChange: (value: keyof IntFilter) => void;
}

const ConditionSelect: React.FC<ConditionSelectProps> = ({ value, onChange }) => {
  const { localValue, onChangeHandler, getSelection } = useSelect<ConditionSelectOption>({
    value,
    onChange: onChange as SelectOnChangeFunction,
  });

  const { selectedKeys } = useMemo(
    () => getSelection(conditionSelectTypes, localValue),
    [getSelection, localValue],
  );

  return (
    <Select
      size="sm"
      selectionMode="single"
      className="max-w-[50px]"
      onChange={onChangeHandler}
      classNames={{
        trigger: 'h-4 min-h-4',
        mainWrapper: 'h-4',
        innerWrapper: 'w-full min-h-4 h-4',
      }}
      // @ts-ignore
      defaultSelectedKeys={selectedKeys}
      selectedKeys={selectedKeys}
      selectorIcon={<></>}
    >
      {conditionSelectTypes.map(et => (
        <SelectItem key={et.id}>{et.label}</SelectItem>
      ))}
    </Select>
  );
};

interface NumberFilterInputProps extends InputProps {
  filterValue?: IntFilter;
  onChangeFilter: (v: IntFilter | undefined) => void;
}

export default function NumberFilterInput({
  filterValue,
  onChangeFilter,
  ...rest
}: NumberFilterInputProps) {
  const [conditionValue, setConditionValue] = useState<keyof IntFilter>('equals');
  const [value, setValue] = useState<string>();

  // this is debounced call to change the filter - we don't want to call API after every keystroke
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onValueChangeDebounced: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(
      e =>
        onChangeFilter(
          e.target.value !== '' ? { [conditionValue]: parseInt(e.target.value) } : undefined,
        ),
      1000,
    ),
    [onChangeFilter, conditionValue],
  );

  // sets value and calls debounced method to set the filter
  const onValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setValue(e.target.value);
      onValueChangeDebounced(e);
    },
    [onValueChangeDebounced],
  );

  //when changing condition type, we can actually call the change instantly, without debounce
  const onConditionChange = useCallback(
    (conditionValue: keyof IntFilter) => {
      setConditionValue(conditionValue);
      onChangeFilter(value && value !== '' ? { [conditionValue]: parseInt(value) } : undefined);
    },
    [onChangeFilter, value],
  );

  const conditionSelector = useMemo(
    () => <ConditionSelect value={conditionValue} onChange={onConditionChange} />,
    [conditionValue, onConditionChange],
  );

  const onClearHandler = useCallback(() => {
    setValue('');
    onChangeFilter(undefined);
  }, [onChangeFilter]);

  return (
    <Input
      {...rest}
      value={value}
      onClear={onClearHandler}
      onChange={onValueChange}
      startContent={conditionSelector}
    />
  );
}
