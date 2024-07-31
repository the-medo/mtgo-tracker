import { MatchType } from '@prisma/client';

export const LOGO_URL =
  'https://imagedelivery.net/zchNIWFramhipgMjPiGPQQ/455d4127-0a46-4e77-7f92-86f69e03a000/300x300';

export type MatchTypeInfo = {
  maxGamesCount: number;
  winsNeeded: number;
};

export const maxGameCountBasedOnMatchType: Record<MatchType, MatchTypeInfo> = {
  [MatchType.BO1]: {
    maxGamesCount: 1,
    winsNeeded: 1,
  },
  [MatchType.BO3]: {
    maxGamesCount: 3,
    winsNeeded: 2,
  },
  [MatchType.BO5]: {
    maxGamesCount: 5,
    winsNeeded: 3,
  },
  [MatchType.OTHER]: {
    maxGamesCount: 1,
    winsNeeded: 0,
  },
};
