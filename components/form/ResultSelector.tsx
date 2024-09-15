import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { MatchResult } from '@prisma/client';
import { TbX } from 'react-icons/tb';

interface ResultSelectorProps {
  value?: MatchResult | null;
  onValueChange: (x: MatchResult | undefined | null) => void;
  includeClearOption?: boolean;
  isLoading?: boolean;
}

export default function ResultSelector({
  value,
  onValueChange,
  isLoading,
  includeClearOption = false,
}: ResultSelectorProps) {
  const [localValue, setLocalValue] = useState(value);

  const valueChangeHandler = useCallback(
    (x: MatchResult | undefined | null) => {
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
        onClick={() => valueChangeHandler(includeClearOption ? null : undefined)}
        variant={localValue === (includeClearOption ? null : undefined) ? 'solid' : 'bordered'}
        color="default"
        title="In progress"
        isIconOnly
      >
        P...
      </Button>
      {includeClearOption ? (
        <Button
          size="sm"
          onClick={() => valueChangeHandler(undefined)}
          variant={localValue === undefined ? 'solid' : 'bordered'}
          color="default"
          title="Clear value"
          isIconOnly
        >
          <TbX />
        </Button>
      ) : null}
    </div>
  );
}
