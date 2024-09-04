import { DeckExtended } from '@/app/api/deck/route';
import { MatchResult } from '@prisma/client';

type DeckResultPart = Record<MatchResult | 'unknown' | 'total' | 'percentage', number>;

const initialDeckResultPart: DeckResultPart = {
  [MatchResult.WIN]: 0,
  [MatchResult.LOSE]: 0,
  [MatchResult.DRAW]: 0,
  unknown: 0,
  total: 0,
  percentage: 0,
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

  result.matches.percentage =
    result.matches.total > 0
      ? Math.round((result.matches[MatchResult.WIN] / result.matches.total) * 100)
      : 0;

  result.games.percentage =
    result.games.total > 0
      ? Math.round((result.games[MatchResult.WIN] / result.games.total) * 100)
      : 0;

  return result;
};

export enum DeckBoxExpandType {
  EVENTS = 'events',
  MATCHES = 'matches',
}
