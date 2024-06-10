import { Select, SelectItem } from '@nextui-org/select';
import { Deck, Prisma } from '@prisma/client';
import { OrderByInput, SorterOption } from '@/types/api-params';
import { TbArrowsSort, TbSortAscendingLetters, TbSortDescendingLetters } from 'react-icons/tb';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

export type SorterProps<T extends Prisma.ModelName> = {
  data: SorterOption<T>[];
  value?: OrderByInput<T>;
  onChange?: (value: OrderByInput<T>) => void;
};

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbArrowsSort size={20} />
    Order by
  </div>
);

export default function SelectSorter<T extends Prisma.ModelName>({
  data,
  value,
  onChange,
}: SorterProps<T>) {
  const [localValue, setLocalValue] = useState<string>();

  const finalData: SorterOption<T>[] = useMemo(() => {
    const result: SorterOption<T>[] = [];

    data.forEach(d => {
      result.push({
        ...d,
        field: d.field + '-asc',
        textValue: d.label + ' (asc)',
        orderBy: () => d.orderBy('asc'), //in data, we get universal function, here we can narrow it down to asc
        label: (
          <div className="flex flex-row justify-between items-center">
            {d.label}
            <span className="flex flex-row gap-1 items-center text-xs">
              asc <TbSortAscendingLetters size={16} />
            </span>
          </div>
        ),
      });
      result.push({
        ...d,
        field: d.field + '-desc',
        textValue: d.label + ' (desc)',
        orderBy: () => d.orderBy('desc'), //in data, we get universal function, here we can narrow it down to desc
        label: (
          <div className="flex flex-row justify-between items-center">
            {d.label}
            <span className="flex flex-row gap-1 items-center text-xs">
              desc <TbSortDescendingLetters size={16} />
            </span>
          </div>
        ),
      });
    });

    return result;
  }, [data]);

  useEffect(() => {
    //value object can be nested, so we have to stringify to compare
    const stringified = JSON.stringify(value);
    const result = finalData.find(x => JSON.stringify(x.orderBy()) === stringified);
    setLocalValue(result?.field);
  }, [finalData, value]);

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      setLocalValue(e.target.value);
      if (onChange) {
        const fieldKey = e.target.value;
        const selectedOption = finalData.find(d => d.field === fieldKey);
        if (selectedOption) {
          console.log('FOUND: ', selectedOption.orderBy());
          onChange(selectedOption.orderBy());
        }
      }
    },
    [onChange, finalData],
  );

  return (
    <Select
      size="sm"
      label={label}
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      selectedKeys={localValue ? [localValue] : []}
    >
      {(finalData ?? []).map(fv => (
        <SelectItem key={fv.field} textValue={fv.textValue}>
          {fv.label}
        </SelectItem>
      ))}
    </Select>
  );
}
