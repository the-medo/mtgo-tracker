import {
  ArchetypeGroup,
  Deck,
  DeckArchetype,
  Format,
  FormatVersion,
  Tag,
} from '@prisma/client';

export enum QK {
  FORMAT_VERSIONS = 'format-version',
  FORMATS = 'format',
  ARCHETYPE_GROUPS = 'archetype-group',
  DECK_ARCHETYPE = 'deck-archetype',
  DECK = 'deck',
  TAG_DECK = 'deck-tag',
  TAG_EVENT = 'event-tag',
  TAG_MATCH = 'match-tag',
  TAG_GAME = 'game-tag',
}

export type QTypes = {
  [QK.FORMAT_VERSIONS]: FormatVersion[];
  [QK.FORMATS]: Format[];
  [QK.ARCHETYPE_GROUPS]: ArchetypeGroup[];
  [QK.DECK_ARCHETYPE]: DeckArchetype[];
  [QK.DECK]: Deck[];
  [QK.TAG_DECK]: Tag[];
  [QK.TAG_EVENT]: Tag[];
  [QK.TAG_MATCH]: Tag[];
  [QK.TAG_GAME]: Tag[];
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
