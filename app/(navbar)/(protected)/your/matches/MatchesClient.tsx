'use client';

import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';

import { QK } from '@/app/api/queryHelpers';
import { useInfiniteMatches } from '@/app/api/match/getMatches';
import { Spinner } from '@nextui-org/spinner';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import useMatchFilters from '@/app/(navbar)/(protected)/your/matches/useMatchFilters';
import DateDisplay from '@/components/typography/DateDisplay';
import EditButton from '@/components/form/table-form/EditButton';
import { MatchExtended } from '@/app/api/match/route';

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
          value={data.isWin ?? undefined}
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
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteMatches(filters);

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Table<As<MatchExtended>>
        isHeaderSticky
        aria-label="Table of matches"
        baseRef={scrollerRef}
        bottomContent={
          hasNextPage ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} />
            </div>
          ) : null
        }
        classNames={{
          base: 'max-h-[520px]',
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn key={column.uid} width={column.maxWidth} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No matches to display."
          isLoading={isLoading}
          loadingContent={<Spinner color="default" label="Loading..." />}
          items={items}
        >
          {item => (
            <TableRow
              key={item.id}
              className={`hover:bg-zinc-50 ${item.id === -1 ? 'opacity-50' : ''}`}
            >
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
