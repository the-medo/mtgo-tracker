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
import { MatchResult, MatchType } from '@prisma/client';
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
  const deckName = useStore(state => state.matches.deckName);
  const [localOppName, setLocalOppName] = useState(oppName ?? '');
  const [localDeckName, setLocalDeckName] = useState(deckName ?? '');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(defaultSortDescriptor);

  const matchType = useStore(state => state.matches.matchType);
  const deckId = useStore(state => state.matches.deckId);
  const result = useStore(state => state.matches.result);
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

  const onDeckNameChangeDebounced: ChangeEventHandler<HTMLInputElement> = useCallback(
    debounce(e => setFilter('matches', 'deckName', e.target.value), 1000),
    [setFilter],
  );

  const onDeckNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setLocalDeckName(e.target.value);
      onDeckNameChangeDebounced(e);
    },
    [onDeckNameChangeDebounced],
  );

  const onMatchTypeChange = useCallback(
    (id: string | number | undefined) =>
      setFilter('matches', 'matchType', id === '' ? undefined : (id as MatchType)),
    [setFilter],
  );
  const onDeckIdChange = useCallback(
    (v: number | undefined) => setFilter('matches', 'deckId', v),
    [setFilter],
  );
  const onResultChange = useCallback(
    (v: MatchResult | undefined | null) => setFilter('matches', 'result', v),
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
    setLocalDeckName('');
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
        deck: deckName ? { name: parseStringToContainsCondition(deckName) } : undefined,
        matchType,
        deckId,
        result,
        startTime: parseDateOrRangeValueToCondition(startTime),
        ...tagIdsFilter,
      },
      orderBy,
    }),
    [oppName, deckName, matchType, deckId, result, startTime, tagIdsFilter, orderBy],
  );

  return {
    filters,
    oppName: localOppName,
    matchType,
    deckId,
    deckName: localDeckName,
    result,
    startTime,
    tagIds,
    orderBy,
    onOppNameChange,
    onMatchTypeChange,
    onDeckIdChange,
    onDeckNameChange,
    onResultChange,
    onStartTimeChange,
    onPublicChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    sortDescriptor,
    onSortChange,
  };
}
