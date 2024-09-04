import { DeckExtended } from '@/app/api/deck/route';
import { MatchResult } from '@prisma/client';

type DeckResultPart = Record<MatchResult | 'unknown' | 'total', number>;

const initialDeckResultPart: DeckResultPart = {
  [MatchResult.WIN]: 0,
  [MatchResult.LOSE]: 0,
  [MatchResult.DRAW]: 0,
  unknown: 0,
  total: 0,
};

export type DeckResult = {
  matches: DeckResultPart;
  games: DeckResultPart;
};

export const computeDeckResults = (
  deckMatches: DeckExtended['Matches'] | undefined,
): DeckResult => {
  const result = {
    matches: { ...initialDeckResultPart },
    games: { ...initialDeckResultPart },
  };

  (deckMatches ?? []).forEach(m => {
    if (m.result) {
      result.matches[m.result]++;
      result.matches.total++;
    } else {
      result.matches.unknown++;
    }
    m.Games.forEach(g => {
      if (g.result) {
        result.games[g.result]++;
        result.games.total++;
      } else {
        result.games.unknown++;
      }
    });
  });

  return result;
};
