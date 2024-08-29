import { MatchResult } from '@prisma/client';
import { ChipProps } from '@nextui-org/chip';
import cn from 'classnames';

export const getChipColorBasedOnMatchResult = (
  result: MatchResult | undefined | null,
): ChipProps['color'] => {
  switch (result) {
    case MatchResult.WIN:
      return 'success';
    case MatchResult.LOSE:
      return 'danger';
    case MatchResult.DRAW:
      return 'warning';
    default:
      return 'default';
  }
};

export const getBgColorBasedOnMatchResult = (result: MatchResult | undefined | null): string => {
  return cn({
    'bg-success-300': result === MatchResult.WIN,
    'bg-danger-300': result === MatchResult.LOSE,
    'bg-warning-200': result === MatchResult.DRAW,
    'bg-default-200': result == null || result === undefined,
  });
};
