import { ArchetypeGroup, Deck, DeckArchetype, Format, FormatVersion } from '@prisma/client';

export enum QK {
  FORMAT_VERSIONS = 'format-version',
  FORMATS = 'format',
  ARCHETYPE_GROUPS = 'archetype-group',
  DECK_ARCHETYPE = 'deck-archetype',
  DECK = 'deck',
}

export type QTypes = {
  [QK.FORMAT_VERSIONS]: FormatVersion[];
  [QK.FORMATS]: Format[];
  [QK.ARCHETYPE_GROUPS]: ArchetypeGroup[];
  [QK.DECK_ARCHETYPE]: DeckArchetype[];
  [QK.DECK]: Deck[];
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
