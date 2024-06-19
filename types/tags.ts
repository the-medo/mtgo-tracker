import { QK } from '@/app/api/queryHelpers';

export type TagAssignment = {
  tagId: number;
};

export const tagArrayPropertyNameByQK: Partial<Record<QK, string>> = {
  [QK.DECK]: 'DeckTags',
  [QK.EVENT]: 'EventTags',
  [QK.MATCH]: 'MatchTags',
  [QK.GAME]: 'GameTags',
};

export const tagPropertyIdByQK: Partial<Record<QK, string>> = {
  [QK.DECK]: 'deckId',
  [QK.EVENT]: 'eventId',
  [QK.MATCH]: 'matchId',
  [QK.GAME]: 'gameId',
};
