import {
  ArchetypeGroup,
  Deck,
  DeckArchetype,
  Format,
  FormatVersion,
  Game,
  Tag,
} from '@prisma/client';

import { EventExtended } from '@/app/api/event/getEvents';
import { MatchExtended } from '@/app/api/match/getMatches';
import { EventAggregation } from '@/app/api/event/aggregate/useEventAggregates';

export enum QK {
  FORMAT_VERSIONS = 'format-version',
  FORMATS = 'format',
  ARCHETYPE_GROUPS = 'archetype-group',
  DECK_ARCHETYPE = 'deck-archetype',
  DECK = 'deck',
  EVENT = 'event',
  EVENT_AGGREGATE = 'event-aggregate',
  DASHBOARD_DAILY_MATCHES = 'dashboard-daily-matches',
  MATCH = 'match',
  GAME = 'game',
  TAG = 'tag',
  TAG_DECK = 'tag-deck',
  TAG_EVENT = 'tag-event',
  TAG_MATCH = 'tag-match',
  TAG_GAME = 'tag-game',
}

export type QTypes = {
  [QK.FORMAT_VERSIONS]: FormatVersion[];
  [QK.FORMATS]: Format[];
  [QK.ARCHETYPE_GROUPS]: ArchetypeGroup[];
  [QK.DECK_ARCHETYPE]: DeckArchetype[];
  [QK.DECK]: Deck[];
  [QK.EVENT]: EventExtended[];
  [QK.MATCH]: MatchExtended[];
  [QK.GAME]: Game[];
  [QK.TAG]: Tag[];
  [QK.TAG_DECK]: Tag[];
  [QK.TAG_EVENT]: Tag[];
  [QK.TAG_MATCH]: Tag[];
  [QK.TAG_GAME]: Tag[];
};

export const qkRedirect: Partial<Record<QK, QK>> = {
  [QK.TAG_DECK]: QK.TAG,
  [QK.TAG_EVENT]: QK.TAG,
  [QK.TAG_MATCH]: QK.TAG,
  [QK.TAG_GAME]: QK.TAG,
};

const dateParser = (value: string | undefined): Date | undefined =>
  value ? new Date(value) : undefined;

export const anyParser = <T>(value: T): T => value;

type ParserFunction = (value: any) => any;

export type QTypeParsersType = {
  [key in QK]?: {
    [field: string]: ParserFunction;
  };
};

export const QTypeParsers: QTypeParsersType = {
  [QK.FORMAT_VERSIONS]: {
    validFrom: dateParser,
  },
};
