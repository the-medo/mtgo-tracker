import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';

interface HandSizeSelectorButtonProps {
  n: number;
  isSelected?: boolean;
  onValueChange: (x: number) => void;
}

export function HandSizeSelectorButton({
  n,
  isSelected,
  onValueChange,
}: HandSizeSelectorButtonProps) {
  const onClickHandler = useCallback(() => onValueChange(n), [n, onValueChange]);

  return (
    <Button
      onPress={onClickHandler}
      size="sm"
      style={{ width: '15px !important' }}
      variant={isSelected ? 'solid' : 'bordered'}
      isIconOnly
    >
      {n}
    </Button>
  );
}

interface HandSizeSelectorProps {
  value?: number;
  onValueChange: (x: number) => void;
}

const baseRow = [7, 6, 5];
const extendedRow = [4, 3, 2, 1, 0];

export default function HandSizeSelector({ value, onValueChange }: HandSizeSelectorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [extendedView, setExtendedView] = useState(false);

  const valueChangeHandler = useCallback(
    (x: number) => {
      onValueChange(x);
      setLocalValue(x);
    },
    [onValueChange],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row justify-center gap-1">
        {baseRow.map(n => (
          <HandSizeSelectorButton
            key={n}
            n={n}
            onValueChange={valueChangeHandler}
            isSelected={localValue === n}
          />
        ))}
        {!extendedView && (
          <Button size="sm" onClick={() => setExtendedView(p => !p)} isIconOnly>
            ...
          </Button>
        )}
      </div>
      {extendedView && (
        <div className="flex flex-row gap-1">
          {extendedRow.map(n => (
            <HandSizeSelectorButton
              key={n}
              n={n}
              onValueChange={valueChangeHandler}
              isSelected={localValue === n}
            />
          ))}
        </div>
      )}
    </div>
  );
}
