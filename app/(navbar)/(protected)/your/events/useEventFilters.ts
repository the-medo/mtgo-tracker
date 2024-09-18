import useStore from '@/store/store';
import {
  OrderByInput,
  parseDateOrRangeValueToCondition,
  parseStringToContainsCondition,
  SorterOption,
  transformTableSorterDirection,
} from '@/types/api-params';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import debounce from 'lodash.debounce';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { EventType, Prisma } from '@prisma/client';
import { GetEventsRequest } from '@/app/api/event/getEvents';
import { parseNumber } from '@/app/api/parsers';
import IntFilter = Prisma.IntFilter;

export const eventSorterOptions: SorterOption<'Event'>[] = [
  {
    field: 'name',
    label: 'Event name',
    orderBy: e => ({
      name: e,
    }),
  },
  {
    field: 'type',
    label: 'Event type',
    orderBy: e => ({
      type: e,
    }),
  },
  {
    field: 'rounds',
    label: 'Rounds',
    orderBy: e => ({
      rounds: e,
    }),
  },
  {
    field: 'entry',
    label: 'Entry',
    orderBy: e => ({
      entry: e,
    }),
  },
  {
    field: 'winnings',
    label: 'Winnings',
    orderBy: e => ({
      winnings: e,
    }),
  },
  {
    field: 'date',
    label: 'Date',
    orderBy: e => ({
      date: e,
    }),
  },
];

const defaultSortDescriptor: SortDescriptor = {
  column: 'date',
  direction: 'descending',
};

export default function useEventFilters() {
  const eventName = useStore(state => state.events.eventName);
  const [localEventName, setLocalEventName] = useState(eventName ?? '');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSortDescriptor);

  const formatId = useStore(state => state.events.formatId);
  const deckId = useStore(state => state.events.deckId);
  const type = useStore(state => state.events.type);
  const rounds = useStore(state => state.events.rounds);
  const entry = useStore(state => state.events.entry);
  const winnings = useStore(state => state.events.winnings);
  const date = useStore(state => state.events.date);
  const tagIds = useStore(state => state.events.tagIds);
  const deckTagIds = useStore(state => state.events.deckTagIds);
  const orderBy = useStore(state => state.events.orderBy);

  const setFilter = useStore(state => state.setFilter);
  const clearFilter = useStore(state => state.clearFilter);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onEventNameChangeDebounced: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(e => setFilter('events', 'eventName', e.target.value), 1000),
    [setFilter],
  );

  const onEventNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setLocalEventName(e.target.value);
      onEventNameChangeDebounced(e);
    },
    [onEventNameChangeDebounced],
  );

  const onFormatIdChange = useCallback(
    (id: string | number | undefined) => setFilter('events', 'formatId', parseNumber(id)),
    [setFilter],
  );
  const onDeckIdChange = useCallback(
    (id: string | number | undefined) => setFilter('events', 'deckId', parseNumber(id)),
    [setFilter],
  );
  const onTypeChange = useCallback(
    (id: string | number | undefined) =>
      setFilter('events', 'type', !id || id === '' ? undefined : (id as EventType)),
    [setFilter],
  );
  const onRoundsChange = useCallback(
    (v: IntFilter | undefined) => setFilter('events', 'rounds', v),
    [setFilter],
  );
  const onEntryChange = useCallback(
    (v: IntFilter | undefined) => setFilter('events', 'entry', v),
    [setFilter],
  );
  const onWinningsChange = useCallback(
    (v: IntFilter | undefined) => setFilter('events', 'winnings', v),
    [setFilter],
  );
  const onDateChange = useCallback(
    (v: DateOrRangeValue) => setFilter('events', 'date', v),
    [setFilter],
  );
  const onTagIdsChange = useCallback(
    (v: number[]) => setFilter('events', 'tagIds', v),
    [setFilter],
  );
  const onDeckTagIdsChange = useCallback(
    (v: number[]) => setFilter('events', 'deckTagIds', v),
    [setFilter],
  );
  const onOrderByChange = useCallback(
    (v: OrderByInput<'Event'>) => setFilter('events', 'orderBy', v),
    [setFilter],
  );

  const onClear = useCallback(() => {
    setLocalEventName('');
    clearFilter('events');
    setSortDescriptor(defaultSortDescriptor);
  }, [clearFilter]);

  const onSortChange = useCallback(
    ({ column, direction }: SortDescriptor) => {
      console.log('Sort change: ', column, direction);
      setSortDescriptor({ column, direction });
      setFilter(
        'events',
        'orderBy',
        eventSorterOptions
          .find(o => o.field === column)
          ?.orderBy(transformTableSorterDirection(direction)),
      );
    },
    [setFilter],
  );

  const tagIdsFilter: GetEventsRequest['where'] = useMemo(() => {
    if (!tagIds || tagIds.length === 0) return {};
    return {
      AND: [
        ...tagIds.map(tid => ({
          EventTags: {
            some: {
              tagId: tid,
            },
          },
        })),
      ],
    };
  }, [tagIds]);

  const deckTagIdsFilter: GetEventsRequest['where'] = useMemo(() => {
    if (!deckTagIds || deckTagIds.length === 0) return {};
    return {
      AND: [
        ...deckTagIds.map(tid => ({
          deck: {
            DeckTags: {
              some: {
                tagId: tid,
              },
            },
          },
        })),
      ],
    };
  }, [deckTagIds]);

  const filters: GetEventsRequest = useMemo(
    () => ({
      where: {
        name: parseStringToContainsCondition(eventName),
        formatId,
        deckId,
        type,
        rounds,
        entry,
        winnings,
        date: parseDateOrRangeValueToCondition(date),
        ...tagIdsFilter,
        ...deckTagIdsFilter,
      },
      orderBy,
    }),
    [
      eventName,
      type,
      rounds,
      entry,
      winnings,
      date,
      tagIdsFilter,
      deckTagIdsFilter,
      orderBy,
      formatId,
      deckId,
    ],
  );

  console.log({ filters });

  return {
    filters,
    formatId,
    deckId,
    eventName: localEventName,
    type,
    rounds,
    entry,
    winnings,
    date,
    tagIds,
    deckTagIds,
    orderBy,
    onFormatIdChange,
    onDeckIdChange,
    onEventNameChange,
    onTypeChange,
    onRoundsChange,
    onEntryChange,
    onWinningsChange,
    onDateChange,
    onTagIdsChange,
    onDeckTagIdsChange,
    onOrderByChange,
    onClear,
    sortDescriptor,
    onSortChange,
  };
}
