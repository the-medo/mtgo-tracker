import { DeckArchetype, MatchResult } from '@prisma/client';
import { MatchExtended } from '@/app/api/match/route';
import { GameExtended } from '@/app/api/game/route';

export enum StatGrouping {
  MATCH = 'match',
  GAME = 'game',
}

export type ArchetypeMap = Record<
  number,
  | (DeckArchetype & { totalMatches: number; totalGames: number; matches: MatchExtended[] })
  | undefined
>;

// ---------- Matches

type MatchList = { matchList: number[] };
type MatchDistributionResult = MatchList & Record<MatchResult, number[]>;

export type MatchDistribution = {
  matchMap: Record<number, MatchExtended>;
  onThePlay: MatchDistributionResult;
  onTheDraw: MatchDistributionResult;
};

const getEmptyMatchDistributionResult = (): MatchDistributionResult => ({
  matchList: [],
  [MatchResult.WIN]: [],
  [MatchResult.DRAW]: [],
  [MatchResult.LOSE]: [],
});

export const getEmptyMatchDistribution = (): MatchDistribution => ({
  matchMap: {},
  onThePlay: getEmptyMatchDistributionResult(),
  onTheDraw: getEmptyMatchDistributionResult(),
});

// ---------- Games

export type OpeningHandSize = 4 | 5 | 6 | 7;

type OpeningSizeGames = GameList & Record<OpeningHandSize, Record<MatchResult, number[]>>;
type GameList = { gameList: number[] };
type GameDistributionResult = GameList & Record<OpeningHandSize, OpeningSizeGames>;

export type GameDistribution = {
  gameMap: Record<number, GameExtended | undefined>;
  onThePlay: GameDistributionResult;
  onTheDraw: GameDistributionResult;
};

const getEmptyOpeningSizeGamePart = (): Record<MatchResult, number[]> => ({
  [MatchResult.WIN]: [],
  [MatchResult.DRAW]: [],
  [MatchResult.LOSE]: [],
});

const getEmptyOpeningSizeGames = (): OpeningSizeGames => ({
  gameList: [],
  4: getEmptyOpeningSizeGamePart(),
  5: getEmptyOpeningSizeGamePart(),
  6: getEmptyOpeningSizeGamePart(),
  7: getEmptyOpeningSizeGamePart(),
});

const getEmptyGameDistributionResult = (): GameDistributionResult => ({
  gameList: [],
  4: getEmptyOpeningSizeGames(),
  5: getEmptyOpeningSizeGames(),
  6: getEmptyOpeningSizeGames(),
  7: getEmptyOpeningSizeGames(),
});

export const getEmptyGameDistribution = (): GameDistribution => ({
  gameMap: {},
  onThePlay: getEmptyGameDistributionResult(),
  onTheDraw: getEmptyGameDistributionResult(),
});

// -------------- Stats

export type StatData = {
  archetypeMap: ArchetypeMap;
  archetypeList: number[];
  matchDistribution: MatchDistribution;
  gameDistribution: GameDistribution;
  byArchetype: Record<
    number,
    | {
        matchDistribution: MatchDistribution;
        gameDistribution: GameDistribution;
      }
    | undefined
  >;
};

export const getEmptyStatData = (): StatData => ({
  archetypeMap: {},
  archetypeList: [],
  matchDistribution: getEmptyMatchDistribution(),
  gameDistribution: getEmptyGameDistribution(),
  byArchetype: {},
});

// ===============

export const addMatchToDistributions = (
  matchDistribution: MatchDistribution,
  gameDistribution: GameDistribution,
  m: MatchExtended,
) => {
  if (!m.result) return;

  matchDistribution.matchMap[m.id] = m;
  const firstGame = m.Games.find(g => g.gameNumber === 1);
  if (firstGame) {
    if (firstGame.isOnPlay) {
      matchDistribution.onThePlay.matchList.push(m.id);
      matchDistribution.onThePlay[m.result].push(m.id);
    } else {
      matchDistribution.onTheDraw.matchList.push(m.id);
      matchDistribution.onTheDraw[m.result].push(m.id);
    }
  }

  m.Games.forEach(g => {
    if (!g.result || !g.startingHand || !g.oppStartingHand) return;
    gameDistribution.gameMap[g.id] = g;

    const playerHandSize = (g.startingHand < 4 ? 4 : g.startingHand) as OpeningHandSize;
    const oppHandSize = (g.oppStartingHand < 4 ? 4 : g.oppStartingHand) as OpeningHandSize;

    if (g.isOnPlay) {
      gameDistribution.onThePlay.gameList.push(g.id);
      gameDistribution.onThePlay[playerHandSize].gameList.push(g.id);
      gameDistribution.onThePlay[playerHandSize][oppHandSize][g.result].push(g.id);
    } else {
      gameDistribution.onTheDraw.gameList.push(g.id);
      gameDistribution.onTheDraw[playerHandSize].gameList.push(g.id);
      gameDistribution.onTheDraw[playerHandSize][oppHandSize][g.result].push(g.id);
    }
  });
};
