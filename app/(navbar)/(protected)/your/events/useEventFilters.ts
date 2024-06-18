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
import { EventType } from '@prisma/client';

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

  const type = useStore(state => state.events.type);
  const rounds = useStore(state => state.events.rounds);
  const entry = useStore(state => state.events.entry);
  const winnings = useStore(state => state.events.winnings);
  const date = useStore(state => state.events.date);
  const orderBy = useStore(state => state.events.orderBy);

  const setFilter = useStore(state => state.setFilter);
  const clearFilter = useStore(state => state.clearFilter);

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

  const onTypeChange = useCallback(
    (id: string) => setFilter('events', 'type', id as EventType),
    [setFilter],
  );
  const onRoundsChange = useCallback((v: number) => setFilter('events', 'rounds', v), [setFilter]);
  const onEntryChange = useCallback((v: number) => setFilter('events', 'entry', v), [setFilter]);
  const onWinningsChange = useCallback(
    (v: number) => setFilter('events', 'winnings', v),
    [setFilter],
  );
  const onDateChange = useCallback(
    (v: DateOrRangeValue) => setFilter('events', 'date', v),
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

  const onSortChange = useCallback(({ column, direction }: SortDescriptor) => {
    console.log('Sort change: ', column, direction);
    setSortDescriptor({ column, direction });
    setFilter(
      'events',
      'orderBy',
      eventSorterOptions
        .find(o => o.field === column)
        ?.orderBy(transformTableSorterDirection(direction)),
    );
  }, []);

  const filters = useMemo(
    () => ({
      where: {
        name: parseStringToContainsCondition(eventName),
        type,
        rounds,
        entry,
        winnings,
        date: parseDateOrRangeValueToCondition(date),
      },
      orderBy,
    }),
    [eventName, type, rounds, entry, winnings, date, orderBy],
  );

  return {
    filters,
    eventName: localEventName,
    type,
    rounds,
    entry,
    winnings,
    date,
    orderBy,
    onEventNameChange,
    onTypeChange,
    onRoundsChange,
    onEntryChange,
    onWinningsChange,
    onDateChange,
    onOrderByChange,
    onClear,
    sortDescriptor,
    onSortChange,
  };
}
