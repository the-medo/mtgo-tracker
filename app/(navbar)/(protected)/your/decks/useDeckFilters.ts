import useStore from '@/store/store';
import {
  OrderByInput,
  parseDateOrRangeValueToCondition,
  parseStringToContainsCondition,
  WhereInput,
} from '@/types/api-params';
import { useMemo } from 'react';

type DeckFilter = {
  where?: WhereInput<'Deck'>;
  orderBy?: OrderByInput<'Deck'>;
};

export default function useDeckFilters(): DeckFilter {
  const deckName = useStore(state => state.decks.deckName);
  const formatId = useStore(state => state.decks.formatId);
  const deckArchetypeId = useStore(state => state.decks.deckArchetypeId);
  const lastPlayedAt = useStore(state => state.decks.lastPlayedAt);
  const createdAt = useStore(state => state.decks.createdAt);

  return useMemo(() => {
    const result: DeckFilter = {
      where: {
        name: parseStringToContainsCondition(deckName),
        formatId,
        deckArchetypeId,
        lastPlayedAt: parseDateOrRangeValueToCondition(lastPlayedAt),
        createdAt: parseDateOrRangeValueToCondition(createdAt),
      },
    };

    console.log(result);

    return result;
  }, [deckName, formatId, lastPlayedAt, createdAt, deckArchetypeId]);
}
