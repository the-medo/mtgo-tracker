import { DeckArchetype, MatchResult } from '@prisma/client';
import { MatchExtended } from '@/app/api/match/route';
import { GameExtended } from '@/app/api/game/route';

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

type OpeningHandSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type OpeningSizeGames = GameList & Record<OpeningHandSize, number[]>;
type GameList = { gameList: number[] };
type GameDistributionResult = GameList & Record<OpeningHandSize, OpeningSizeGames>;

export type GameDistribution = {
  gameMap: Record<number, GameExtended | undefined>;
  onThePlay: GameDistributionResult;
  onTheDraw: GameDistributionResult;
};
const getEmptyOpeningSizeGames = (): OpeningSizeGames => ({
  gameList: [],
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
});

const getEmptyGameDistributionResult = (): GameDistributionResult => ({
  gameList: [],
  0: getEmptyOpeningSizeGames(),
  1: getEmptyOpeningSizeGames(),
  2: getEmptyOpeningSizeGames(),
  3: getEmptyOpeningSizeGames(),
  4: getEmptyOpeningSizeGames(),
  5: getEmptyOpeningSizeGames(),
  6: getEmptyOpeningSizeGames(),
  7: getEmptyOpeningSizeGames(),
});

const getEmptyGameDistribution = (): GameDistribution => ({
  gameMap: {},
  onThePlay: getEmptyGameDistributionResult(),
  onTheDraw: getEmptyGameDistributionResult(),
});

// -------------- Stats

export type StatData = {
  archetypeMap: ArchetypeMap;
  matchDistribution: MatchDistribution;
  gameDistribution: GameDistribution;
};

const getEmptyStatData = (): StatData => ({
  archetypeMap: {},
  matchDistribution: getEmptyMatchDistribution(),
  gameDistribution: getEmptyGameDistribution(),
});
