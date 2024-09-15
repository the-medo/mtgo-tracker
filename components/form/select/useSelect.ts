import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

export type SelectOnChangeFunction = (x: string | number | undefined) => void;

export type UseSelectProps = {
  value?: string | number;
  onChange?: SelectOnChangeFunction;
  isNumber?: boolean;
};

const parseValueToString = (v: string | number | undefined) => {
  if (!v) return undefined;
  if (typeof v === 'number') return v.toString();
  return v;
};

export default function useSelect<T extends { id: string | number }>({
  value,
  onChange,
  isNumber,
}: UseSelectProps) {
  const [localValue, setLocalValue] = useState(parseValueToString(value));

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      let newValue = e.target.value === '' ? undefined : e.target.value;

      setLocalValue(newValue);
      if (onChange) {
        if (isNumber && newValue) {
          onChange(parseInt(newValue));
        } else {
          onChange(newValue);
        }
      }
    },
    [isNumber, onChange],
  );

  useEffect(() => {
    setLocalValue(parseValueToString(value));
  }, [value]);

  const getSelection = useCallback((data: T[] | undefined, localValue: string | undefined) => {
    const selectedItem = data?.find(d => {
      if (typeof d.id === 'number') return d.id.toString() === localValue;
      return d.id === localValue;
    });

    const selectedKeys = selectedItem
      ? [typeof selectedItem.id === 'number' ? selectedItem.id.toString() : selectedItem.id]
      : [];

    return {
      selectedItem,
      selectedKeys,
    };
  }, []);

  return {
    localValue,
    onChangeHandler,
    getSelection,
  };
}
