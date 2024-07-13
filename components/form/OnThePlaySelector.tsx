import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';

interface OnThePlaySelectorProps {
  value?: boolean;
  onValueChange: (x: boolean) => void;
}

export default function OnThePlaySelector({ value, onValueChange }: OnThePlaySelectorProps) {
  const [localValue, setLocalValue] = useState(value);

  const valueChangeHandler = useCallback(
    (x: boolean) => {
      onValueChange(x);
      setLocalValue(x);
    },
    [onValueChange],
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="flex flex-row gap-1">
      <Button
        size="md"
        onClick={() => valueChangeHandler(true)}
        variant={localValue === true ? 'solid' : 'bordered'}
      >
        On the play
      </Button>
      <Button
        size="md"
        onClick={() => valueChangeHandler(false)}
        variant={localValue === false ? 'solid' : 'bordered'}
      >
        On the draw
      </Button>
    </div>
  );
}
