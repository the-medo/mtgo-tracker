import { DeckArchetype, MatchResult } from '@prisma/client';
import { CSSProperties } from 'react';
import { BarDatum } from '@nivo/bar/dist/types/types';
import { GameExtended } from '@/app/api/game/getGames';
import { MatchExtended } from '@/app/api/match/getMatches';

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

export type StartingPlayerKey = 'onThePlay' | 'onTheDraw';
export const startingPlayerKeyArray: StartingPlayerKey[] = ['onThePlay', 'onTheDraw'];
export const MatchResultArray: MatchResult[] = [
  MatchResult.WIN,
  MatchResult.DRAW,
  MatchResult.LOSE,
];

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

//================ bar chart keys and colors
export type StatBarChartData = BarDatum & { archetype: number };
type StatKeyInfo = Record<
  string,
  {
    color: CSSProperties['color'];
    label: string;
    matchResult: MatchResult;
  }
>;

export const statKeyInfo: StatKeyInfo = {
  w: {
    color: '#1aa122',
    label: 'Wins',
    matchResult: MatchResult.WIN,
  },
  wp: {
    color: '#1aa122',
    label: 'Wins (on the play)',
    matchResult: MatchResult.WIN,
  },
  wd: {
    color: '#75d178',
    label: 'Wins (on the draw)',
    matchResult: MatchResult.WIN,
  },
  d: {
    color: '#dcad14',
    label: 'Draws',
    matchResult: MatchResult.DRAW,
  },
  dp: {
    color: '#dcad14',
    label: 'Draws (on the play)',
    matchResult: MatchResult.DRAW,
  },
  dd: {
    color: '#dcd214',
    label: 'Draws (on the draw)',
    matchResult: MatchResult.DRAW,
  },
  l: {
    color: '#dda3a0',
    label: 'Losses',
    matchResult: MatchResult.LOSE,
  },
  ld: {
    color: '#dda3a0',
    label: 'Losses (on the draw)',
    matchResult: MatchResult.LOSE,
  },
  lp: {
    color: '#cd746b',
    label: 'Losses (on the play)',
    matchResult: MatchResult.LOSE,
  },
};

export const statBaseKeys: Record<StartingPlayerKey | 'none', string[]> = {
  none: ['w', 'd', 'l'],
  onThePlay: ['wp', 'dp', 'lp'],
  onTheDraw: ['wd', 'dd', 'ld'],
};

export const openingHandSizeArray: OpeningHandSize[] = [7, 6, 5, 4];

const fillStatKeyInfo = () => {
  const baseKeys = Object.keys(statKeyInfo);

  const hexSuffixes = [
    '60',
    '68',
    '70',
    '78',
    '80',
    '88',
    '90',
    '98',
    'a0',
    'a8',
    'b0',
    'b8',
    'c0',
    'c8',
    'd0',
    'e0',
  ];

  openingHandSizeArray.forEach(o1 => {
    openingHandSizeArray.forEach(o2 => {
      const k = `${o1}v${o2}`;
      baseKeys.forEach(baseKey => {
        statKeyInfo[`${baseKey}_${k}`] = {
          ...statKeyInfo[baseKey],
          color: statKeyInfo[baseKey].color + hexSuffixes[(o1 - 4) * 4 + (o2 - 4)],
          label: statKeyInfo[baseKey].label + '(' + k + ')',
        };
      });
    });
  });
};

fillStatKeyInfo();

export const getOpeningHandSizeMatrixInArray = () => {
  const result: string[] = [];
  openingHandSizeArray.forEach(o1 => {
    openingHandSizeArray.forEach(o2 => {
      result.push(`${o1}v${o2}`);
    });
  });
  return result;
};
