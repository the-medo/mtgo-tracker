import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

export type UseSelectProps = {
  value?: string | number;
  onChange?: (x: string | number) => void;
};

const parseValueToString = (v: string | number | undefined) => {
  if (!v) return undefined;
  if (typeof v === 'number') return v.toString();
  return v;
};

export default function useSelect<T extends { id: string | number }>({
  value,
  onChange,
}: UseSelectProps) {
  const [localValue, setLocalValue] = useState(parseValueToString(value));

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      setLocalValue(e.target.value);
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange],
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
