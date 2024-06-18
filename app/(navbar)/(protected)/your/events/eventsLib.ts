import { EventType } from '@prisma/client';

type EventTypeInfo = {
  name: string;
  rounds: number;
  entry: number;
  winnings: Record<number, number | undefined>;
};

const todayDate = new Date();
const todayDateString = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;

export const eventTypeInfo: Record<EventType, EventTypeInfo> = {
  CHALLENGE32: {
    name: `Challenge 32 [${todayDateString}]`,
    rounds: 7,
    entry: 30,
    winnings: {},
  },
  CHALLENGE64: {
    name: `Challenge 64 [${todayDateString}]`,
    rounds: 8,
    entry: 30,
    winnings: {},
  },
  FRIENDLY_LEAGUE: {
    name: `Friendly League [${todayDateString}]`,
    rounds: 5,
    entry: 6,
    winnings: {
      0: 0,
      1: 0,
      2: 3,
      3: 7,
      4: 10,
      5: 18,
    },
  },
  LEAGUE: {
    name: `League [${todayDateString}]`,
    rounds: 5,
    entry: 10,
    winnings: {
      0: 0,
      1: 0,
      2: 5,
      3: 12,
      4: 22,
      5: 37,
    },
  },
  OPEN_PLAY: {
    name: `Open Play [${todayDateString}]`,
    rounds: 100,
    entry: 0,
    winnings: {},
  },
  OTHER: {
    name: `Other Event [${todayDateString}]`,
    rounds: 1,
    entry: 0,
    winnings: {},
  },
  PRELIMINARY: {
    name: `Preliminary [${todayDateString}]`,
    rounds: 4,
    entry: 20,
    winnings: {
      0: 0,
      1: 0,
      2: 12,
      3: 28,
      4: 50,
    },
  },
  RL_BIG: {
    name: `RL Big [${todayDateString}]`,
    rounds: 9,
    entry: 0,
    winnings: {},
  },
  RL_MEDIUM: {
    name: `RL Medium [${todayDateString}]`,
    rounds: 4,
    entry: 0,
    winnings: {},
  },
  RL_SMALL: {
    name: `RL Small [${todayDateString}]`,
    rounds: 3,
    entry: 0,
    winnings: {},
  },
  TWO_PLAYER_QUEUE: {
    name: `Two Player Queue [${todayDateString}]`,
    rounds: 1,
    entry: 2,
    winnings: {
      0: 0.5,
      1: 3,
    },
  },
};
