import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { MatchResult } from '@prisma/client';

interface MatchResultSelectorProps {
  value?: MatchResult;
  onValueChange: (x: MatchResult | undefined) => void;
  isLoading?: boolean;
}

export default function MatchResultSelector({
  value,
  onValueChange,
  isLoading,
}: MatchResultSelectorProps) {
  const [localValue, setLocalValue] = useState(value);

  const valueChangeHandler = useCallback(
    (x: MatchResult | undefined) => {
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
        size="sm"
        onClick={() => valueChangeHandler(MatchResult.WIN)}
        variant={localValue === MatchResult.WIN ? 'solid' : 'bordered'}
        color="success"
      >
        Win
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(MatchResult.LOSE)}
        variant={localValue === MatchResult.LOSE ? 'solid' : 'bordered'}
        color="danger"
      >
        Lose
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(MatchResult.DRAW)}
        variant={localValue === MatchResult.DRAW ? 'solid' : 'bordered'}
        color="warning"
      >
        Draw
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(undefined)}
        variant={localValue === undefined ? 'solid' : 'bordered'}
        color="default"
      >
        In progress
      </Button>
    </div>
  );
}
