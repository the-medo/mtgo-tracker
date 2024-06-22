import { MatchType } from '@prisma/client';

type MatchTypeInfo = {
  winsNeeded: number;
};

export const matchTypeInfo: Record<MatchType, MatchTypeInfo> = {
  [MatchType.BO1]: {
    winsNeeded: 1,
  },
  [MatchType.BO3]: {
    winsNeeded: 2,
  },
  [MatchType.BO5]: {
    winsNeeded: 3,
  },
  [MatchType.OTHER]: {
    winsNeeded: 1,
  },
};
