import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { MatchResult } from '@prisma/client';

interface ResultSelectorProps {
  value?: MatchResult;
  onValueChange: (x: MatchResult | undefined) => void;
  isLoading?: boolean;
}

export default function ResultSelector({ value, onValueChange, isLoading }: ResultSelectorProps) {
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
        title="Win"
        isIconOnly
      >
        W
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(MatchResult.LOSE)}
        variant={localValue === MatchResult.LOSE ? 'solid' : 'bordered'}
        color="danger"
        title="Lose"
        isIconOnly
      >
        L
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(MatchResult.DRAW)}
        variant={localValue === MatchResult.DRAW ? 'solid' : 'bordered'}
        color="warning"
        title="Draw"
        isIconOnly
      >
        D
      </Button>
      <Button
        size="sm"
        onClick={() => valueChangeHandler(undefined)}
        variant={localValue === undefined ? 'solid' : 'bordered'}
        color="default"
        title="In progress"
        isIconOnly
      >
        P...
      </Button>
    </div>
  );
}
