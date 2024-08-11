import { MatchResult } from '@prisma/client';
import { ChipProps } from '@nextui-org/chip';

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
  switch (result) {
    case MatchResult.WIN:
      return 'bg-success-300';
    case MatchResult.LOSE:
      return 'bg-danger-300';
    case MatchResult.DRAW:
      return 'bg-warning-200';
    default:
      return 'bg-default-200';
  }
};
