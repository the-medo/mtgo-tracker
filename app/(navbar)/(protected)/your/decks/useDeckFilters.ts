import useStore from '@/store/store';
import {
  OrderByInput,
  parseDateOrRangeValueToCondition,
  parseStringToContainsCondition,
  SorterOption,
  transformTableSorterDirection,
  WhereInput,
} from '@/types/api-params';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { parseNumber } from '@/app/api/parsers';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import debounce from 'lodash.debounce';
import { SortDescriptor } from '@react-types/shared/src/collections';

type DeckFilter = {
  filters: {
    where?: WhereInput<'Deck'>;
    orderBy?: OrderByInput<'Deck'>;
  };
};

export const deckSorterOptions: SorterOption<'Deck'>[] = [
  {
    field: 'name',
    label: 'Deck name',
    orderBy: d => ({
      name: d,
    }),
  },
  {
    field: 'deckArchetypeId',
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

const defaultSortDescriptor: SortDescriptor = {
  column: 'createdAt',
  direction: 'descending',
};

export default function useDeckFilters() {
  const deckName = useStore(state => state.decks.deckName);
  const [localDeckName, setLocalDeckName] = useState(deckName ?? '');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSortDescriptor);

  const formatId = useStore(state => state.decks.formatId);
  const deckArchetypeId = useStore(state => state.decks.deckArchetypeId);
  const lastPlayedAt = useStore(state => state.decks.lastPlayedAt);
  const createdAt = useStore(state => state.decks.createdAt);
  const orderBy = useStore(state => state.decks.orderBy);

  const setFilter = useStore(state => state.setFilter);
  const clearFilter = useStore(state => state.clearFilter);

  const onDeckNameChangeDebounced: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(e => setFilter('decks', 'deckName', e.target.value), 1000),
    [setFilter],
  );

  const onDeckNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setLocalDeckName(e.target.value);
      onDeckNameChangeDebounced(e);
    },
    [onDeckNameChangeDebounced],
  );

  const onFormatChange = useCallback(
    (id: string | number) => setFilter('decks', 'formatId', parseNumber(id)),
    [setFilter],
  );
  const onDeckArchetypeChange = useCallback(
    (id: string | number) => setFilter('decks', 'deckArchetypeId', parseNumber(id)),
    [setFilter],
  );
  const onLastPlayedAtChange = useCallback(
    (v: DateOrRangeValue) => setFilter('decks', 'lastPlayedAt', v),
    [setFilter],
  );
  const onCreatedAtChange = useCallback(
    (v: DateOrRangeValue) => setFilter('decks', 'createdAt', v),
    [setFilter],
  );
  const onOrderByChange = useCallback(
    (v: OrderByInput<'Deck'>) => setFilter('decks', 'orderBy', v),
    [setFilter],
  );

  const onClear = useCallback(() => {
    setLocalDeckName('');
    clearFilter('decks');
    setSortDescriptor(defaultSortDescriptor);
  }, [clearFilter]);

  const onSortChange = useCallback(({ column, direction }: SortDescriptor) => {
    console.log('Sort change: ', column, direction);
    setSortDescriptor({ column, direction });
    setFilter(
      'decks',
      'orderBy',
      deckSorterOptions
        .find(o => o.field === column)
        ?.orderBy(transformTableSorterDirection(direction)),
    );
  }, []);

  const filters = useMemo(
    () => ({
      where: {
        name: parseStringToContainsCondition(deckName),
        formatId,
        deckArchetypeId,
        lastPlayedAt: parseDateOrRangeValueToCondition(lastPlayedAt),
        createdAt: parseDateOrRangeValueToCondition(createdAt),
      },
      orderBy,
    }),
    [deckName, formatId, lastPlayedAt, createdAt, deckArchetypeId, orderBy],
  );

  return {
    filters,
    deckName: localDeckName,
    formatId,
    lastPlayedAt,
    createdAt,
    deckArchetypeId,
    orderBy,
    onDeckNameChange,
    onFormatChange,
    onDeckArchetypeChange,
    onLastPlayedAtChange,
    onCreatedAtChange,
    onOrderByChange,
    onClear,
    sortDescriptor,
    onSortChange,
  };
}
