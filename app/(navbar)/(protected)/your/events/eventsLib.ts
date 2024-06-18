import { EventType } from '@prisma/client';

type EventFormValue = {
  name: string;
  rounds: number;
  entry: number;
  winnings: number;
};

const todayDate = new Date();
const todayDateString = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;

export const formValuesByEventType: Record<EventType, EventFormValue> = {
  CHALLENGE32: {
    name: `Challenge 32 [${todayDateString}]`,
    rounds: 7,
    entry: 30,
    winnings: -30,
  },
  CHALLENGE64: {
    name: `Challenge 64 [${todayDateString}]`,
    rounds: 8,
    entry: 0,
    winnings: 0,
  },
  FRIENDLY_LEAGUE: {
    name: `Friendly League [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  LEAGUE: {
    name: `League [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  OPEN_PLAY: {
    name: `Open Play [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  OTHER: {
    name: `Other Event [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  PRELIMINARY: {
    name: `Preliminary [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  RL_BIG: {
    name: `RL Big [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  RL_MEDIUM: {
    name: `RL Medium [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  RL_SMALL: {
    name: `RL Small [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
  TWO_PLAYER_QUEUE: {
    name: `Two Player Queue [${todayDateString}]`,
    rounds: 0,
    entry: 0,
    winnings: 0,
  },
};
