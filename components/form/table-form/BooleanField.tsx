'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { TbCheck, TbLineDashed, TbQuestionMark, TbSquareOff, TbX } from 'react-icons/tb';

interface BooleanFieldProps {
  name: string;
  label?: string;
  value?: boolean;
  allowEmptyValue?: boolean;
  onChange?: (value: boolean | undefined) => void;
}

export default function BooleanField({
  name,
  label,
  value,
  allowEmptyValue = true,
  onChange,
}: BooleanFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleClick = useCallback(
    (val: boolean | undefined) => {
      setLocalValue(val);
      if (onChange) onChange(val);
    },
    [onChange],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex flex-row gap-2 justify-between items-center w-full p-1 hover:bg-zinc-100">
      {label && <span className="pl-1 text-tiny text-foreground-500">{label}</span>}
      <input
        type="hidden"
        name={name}
        value={localValue === undefined ? '' : localValue.toString()}
      />
      <div className="flex gap-2">
        {allowEmptyValue && (
          <Button
            isIconOnly
            size="sm"
            color={localValue === undefined ? 'primary' : 'default'}
            onClick={() => handleClick(undefined)}
          >
            <TbSquareOff size={16} />
          </Button>
        )}
        <Button
          isIconOnly
          size="sm"
          color={localValue === true ? 'success' : 'default'}
          onClick={() => handleClick(true)}
        >
          <TbCheck size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          color={localValue === false ? 'danger' : 'default'}
          onClick={() => handleClick(false)}
        >
          <TbX size={16} />
        </Button>
      </div>
    </div>
  );
}
