'use client';

import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { QK } from '@/app/api/queryHelpers';
import { MatchExtended, useInfiniteMatches } from '@/app/api/match/getMatches';
import { Spinner } from '@nextui-org/spinner';
import useMatchFilters from '@/app/(navbar)/(protected)/your/matches/useMatchFilters';
import DateDisplay from '@/components/typography/DateDisplay';
import EditButton from '@/components/form/table-form/EditButton';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import MatchBox from '@/components/app/matches/MatchBox';
import { MatchResult } from '@prisma/client';
import StatModal from '@/components/app/stats/StatModal';
import Title from '@/components/typography/Title';

const TABLE_ID = 'MATCHES';

const columns = [
  { name: 'Round', uid: 'round', sortable: true },
  { name: 'Opponent', uid: 'oppName', sortable: true },
  { name: 'Type', uid: 'matchType', sortable: true },
  { name: 'Event', uid: 'eventId', maxWidth: 180 },
  { name: 'Deck', uid: 'deckId', maxWidth: 180 },
  { name: 'Win', uid: 'isWin', maxWidth: 80, sortable: true },
  { name: 'Start Time', uid: 'startTime', maxWidth: 120, sortable: true },
  { name: 'Public', uid: 'public', maxWidth: 80 },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: MatchExtended, columnKey: Key) => {
  switch (columnKey) {
    case 'round':
      return (
        <TableField
          qk={QK.MATCH}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="round"
          label="Round"
          value={data.round?.toString() ?? undefined}
        />
      );
    case 'oppName':
      return (
        <TableField
          qk={QK.MATCH}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="oppName"
          label="Opponent"
          value={data.oppName ?? undefined}
        />
      );
    case 'matchType':
      return (
        <TableField
          qk={QK.MATCH}
          type="select"
          selectType="MATCH_TYPE"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="matchType"
          label="Type"
          value={data.matchType.toString() ?? undefined}
        />
      );
    case 'eventId':
      return (
        <TableField
          qk={QK.MATCH}
          selectType={QK.EVENT}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="eventId"
          label="Event"
          value={data.eventId?.toString() ?? undefined}
        />
      );
    case 'deckId':
      return (
        <TableField
          qk={QK.MATCH}
          selectType={QK.DECK}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="deckId"
          label="Deck"
          value={data.deckId?.toString() ?? undefined}
        />
      );
    case 'isWin':
      return (
        <TableField
          qk={QK.MATCH}
          type="boolean"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="isWin"
          label="Win"
          value={data.result === MatchResult.WIN}
        />
      );
    case 'startTime':
      return <DateDisplay date={data.startTime} />;
    case 'public':
      return (
        <TableField
          qk={QK.MATCH}
          type="boolean"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="public"
          label="Public"
          value={data.public ?? undefined}
        />
      );
    case 'actions':
      return (
        <div className="relative flex flex-row items-center gap-2">
          <EditButton tableId={TABLE_ID} id={data.id} qk={QK.MATCH} />
          <DeleteButton id={data.id} qk={QK.MATCH} />
        </div>
      );
  }
};

interface Props {}

export default function MatchesClient({}: Props) {
  const { filters, sortDescriptor, onSortChange } = useMatchFilters();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteMatches(filters);

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {isFetching && <Spinner />}
      {!isFetching && items.length === 0 ? <Title title="No matches found" /> : null}
      {items.map(i => (
        <MatchBox key={i.id} matchId={i.id} eventId={i.eventId} showDeckName={true} />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
      <StatModal matchData={items} />
    </div>
  );
}
