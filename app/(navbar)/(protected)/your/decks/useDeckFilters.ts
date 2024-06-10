import useStore from '@/store/store';
import {
  OrderByInput,
  parseDateOrRangeValueToCondition,
  parseStringToContainsCondition,
  SorterOption,
  WhereInput,
} from '@/types/api-params';
import { useMemo } from 'react';

type DeckFilter = {
  where?: WhereInput<'Deck'>;
  orderBy?: OrderByInput<'Deck'>;
};

export const deckSorterOptions: SorterOption<'Deck'>[] = [
  {
    field: 'deckName',
    label: 'Deck name',
    orderBy: d => ({
      name: d,
    }),
  },
  {
    field: 'deckArchetypeName',
    label: 'Deck archetype',
    orderBy: d => ({
      deckArchetype: {
        name: d,
      },
    }),
  },
  {
    field: 'lastPlayedAt',
    label: 'Last played at',
    orderBy: d => ({
      lastPlayedAt: d,
    }),
  },
  {
    field: 'createdAt',
    label: 'Created at',
    orderBy: d => ({
      createdAt: d,
    }),
  },
];

export default function useDeckFilters(): DeckFilter {
  const deckName = useStore(state => state.decks.deckName);
  const formatId = useStore(state => state.decks.formatId);
  const deckArchetypeId = useStore(state => state.decks.deckArchetypeId);
  const lastPlayedAt = useStore(state => state.decks.lastPlayedAt);
  const createdAt = useStore(state => state.decks.createdAt);
  const orderBy = useStore(state => state.decks.orderBy);

  return useMemo(
    () => ({
      where: {
        name: parseStringToContainsCondition(deckName),
        formatId,
        deckArchetypeId,
        lastPlayedAt: parseDateOrRangeValueToCondition(lastPlayedAt),
        createdAt: parseDateOrRangeValueToCondition(createdAt),
      },
      orderBy: orderBy ?? {
        createdAt: 'desc',
      },
    }),
    [deckName, formatId, lastPlayedAt, createdAt, deckArchetypeId, orderBy],
  );
}
