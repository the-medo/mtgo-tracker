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
      return 'success-100';
    case MatchResult.LOSE:
      return 'danger-100';
    case MatchResult.DRAW:
      return 'warning-100';
    default:
      return 'default-100';
  }
};

export const getBorderColorBasedOnMatchResult = (
  result: MatchResult | undefined | null,
): string => {
  switch (result) {
    case MatchResult.WIN:
      return 'success-700';
    case MatchResult.LOSE:
      return 'danger-700';
    case MatchResult.DRAW:
      return 'warning-700';
    default:
      return 'default-700';
  }
};
