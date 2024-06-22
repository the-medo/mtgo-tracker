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
import { MatchType } from '@prisma/client';
import { GetMatchesRequest } from '@/app/api/match/getMatches';

export const matchSorterOptions: SorterOption<'Match'>[] = [
  {
    field: 'round',
    label: 'Round',
    orderBy: m => ({
      round: m,
    }),
  },
  {
    field: 'oppName',
    label: 'Opponent name',
    orderBy: m => ({
      oppName: m,
    }),
  },
  {
    field: 'matchType',
    label: 'Match type',
    orderBy: m => ({
      matchType: m,
    }),
  },
  {
    field: 'eventId',
    label: 'Event ID',
    orderBy: m => ({
      eventId: m,
    }),
  },
  {
    field: 'deckId',
    label: 'Deck ID',
    orderBy: m => ({
      deckId: m,
    }),
  },
  {
    field: 'isWin',
    label: 'Win',
    orderBy: m => ({
      isWin: m,
    }),
  },
  {
    field: 'startTime',
    label: 'Start time',
    orderBy: m => ({
      startTime: m,
    }),
  },
];

const defaultSortDescriptor: SortDescriptor = {
  column: 'startTime',
  direction: 'descending',
};

export default function useMatchFilters() {
  const oppName = useStore(state => state.matches.oppName);
  const [localOppName, setLocalOppName] = useState(oppName ?? '');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSortDescriptor);

  const type = useStore(state => state.matches.type);
  const round = useStore(state => state.matches.round);
  const eventId = useStore(state => state.matches.eventId);
  const deckId = useStore(state => state.matches.deckId);
  const isWin = useStore(state => state.matches.isWin);
  const startTime = useStore(state => state.matches.startTime);
  const tagIds = useStore(state => state.matches.tagIds);
  const orderBy = useStore(state => state.matches.orderBy);

  const setFilter = useStore(state => state.setFilter);
  const clearFilter = useStore(state => state.clearFilter);

  const onOppNameChangeDebounced: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(e => setFilter('matches', 'oppName', e.target.value), 1000),
    [setFilter],
  );

  const onOppNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setLocalOppName(e.target.value);
      onOppNameChangeDebounced(e);
    },
    [onOppNameChangeDebounced],
  );

  const onTypeChange = useCallback(
    (id: string | number) =>
      setFilter('matches', 'type', id === '' ? undefined : (id as MatchType)),
    [setFilter],
  );
  const onRoundChange = useCallback(
    (v: number | undefined) => setFilter('matches', 'round', v),
    [setFilter],
  );
  const onEventChange = useCallback(
    (v: number | undefined) => setFilter('matches', 'eventId', v),
    [setFilter],
  );
  const onDeckChange = useCallback(
    (v: number | undefined) => setFilter('matches', 'deckId', v),
    [setFilter],
  );
  const onWinChange = useCallback(
    (v: boolean | undefined) => setFilter('matches', 'isWin', v),
    [setFilter],
  );
  const onStartTimeChange = useCallback(
    (v: DateOrRangeValue) => setFilter('matches', 'startTime', v),
    [setFilter],
  );
  const onPublicChange = useCallback(
    (v: boolean | undefined) => setFilter('matches', 'public', v),
    [setFilter],
  );
  const onTagIdsChange = useCallback(
    (v: number[]) => setFilter('matches', 'tagIds', v),
    [setFilter],
  );
  const onOrderByChange = useCallback(
    (v: OrderByInput<'Match'>) => setFilter('matches', 'orderBy', v),
    [setFilter],
  );

  const onClear = useCallback(() => {
    setLocalOppName('');
    clearFilter('matches');
    setSortDescriptor(defaultSortDescriptor);
  }, [clearFilter]);

  const onSortChange = useCallback(({ column, direction }: SortDescriptor) => {
    console.log('Sort change: ', column, direction);
    setSortDescriptor({ column, direction });
    setFilter(
      'matches',
      'orderBy',
      matchSorterOptions
        .find(o => o.field === column)
        ?.orderBy(transformTableSorterDirection(direction)),
    );
  }, []);

  const tagIdsFilter: GetMatchesRequest['where'] = useMemo(() => {
    if (!tagIds || tagIds.length === 0) return {};
    return {
      AND: [
        ...tagIds.map(tid => ({
          MatchTags: {
            some: {
              tagId: tid,
            },
          },
        })),
      ],
    };
  }, [tagIds]);

  const filters: GetMatchesRequest = useMemo(
    () => ({
      where: {
        oppName: parseStringToContainsCondition(oppName),
        type,
        round,
        eventId,
        deckId,
        isWin,
        startTime: parseDateOrRangeValueToCondition(startTime),
        ...tagIdsFilter,
      },
      orderBy,
    }),
    [oppName, type, round, eventId, deckId, isWin, startTime, tagIdsFilter, orderBy],
  );

  return {
    filters,
    oppName: localOppName,
    type,
    round,
    eventId,
    deckId,
    isWin,
    startTime,
    tagIds,
    orderBy,
    onOppNameChange,
    onTypeChange,
    onRoundChange,
    onEventChange,
    onDeckChange,
    onWinChange,
    onStartTimeChange,
    onPublicChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    sortDescriptor,
    onSortChange,
  };
}
