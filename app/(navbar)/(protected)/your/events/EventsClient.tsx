'use client';

import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';

import { QK } from '@/app/api/queryHelpers';
import { useInfiniteEvents } from '@/app/api/event/getEvents';
import { Spinner } from '@nextui-org/spinner';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import useEventFilters from '@/app/(navbar)/(protected)/your/events/useEventFilters';
import DateDisplay from '@/components/typography/DateDisplay';
import EditButton from '@/components/form/table-form/EditButton';
import { EventExtended } from '@/app/api/event/route';

const TABLE_ID = 'EVENTS';

const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Type', uid: 'type', sortable: true },
  { name: 'Tags', uid: 'tags', maxWidth: 180 },
  { name: 'Rounds', uid: 'rounds', maxWidth: 80, sortable: true },
  { name: 'Entry', uid: 'entry', maxWidth: 80, sortable: true },
  { name: 'Winnings', uid: 'winnings', maxWidth: 80, sortable: true },
  { name: 'Date', uid: 'date', maxWidth: 120, sortable: true },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: EventExtended, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <div className="flex flex-row gap-1">
          {data.id === -1 && <Spinner color="default" size="sm" />}
          <TableField
            qk={QK.EVENT}
            type="string"
            tableId={TABLE_ID}
            id={data.id}
            fieldName="name"
            label="Name"
            value={data.name ?? undefined}
          />
        </div>
      );
    case 'type':
      return (
        <TableField
          qk={QK.EVENT}
          type="select"
          selectType="EVENT_TYPE"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="type"
          label="Type"
          value={data.type.toString() ?? undefined}
        />
      );
    case 'tags':
      return (
        <TableField
          qk={QK.EVENT}
          type="tags"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="tags"
          label="Tags"
          // @ts-ignore
          values={data.EventTags}
        />
      );
    case 'rounds':
      return (
        <TableField
          qk={QK.EVENT}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="rounds"
          label="Rounds"
          value={data.rounds.toString() ?? undefined}
        />
      );
    case 'entry':
      return (
        <TableField
          qk={QK.EVENT}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="entry"
          label="Entry"
          value={data.entry?.toString() ?? undefined}
        />
      );
    case 'winnings':
      return (
        <TableField
          qk={QK.EVENT}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="winnings"
          label="Winnings"
          value={data.winnings?.toString() ?? undefined}
        />
      );
    case 'date':
      return <DateDisplay date={data.date} />;
    case 'actions':
      return (
        <div className="relative flex flex-row items-center gap-2">
          <EditButton tableId={TABLE_ID} id={data.id} qk={QK.EVENT} />
          <DeleteButton id={data.id} qk={QK.EVENT} />
        </div>
      );
  }
};

interface Props {}

export default function EventsClient({}: Props) {
  const { filters, sortDescriptor, onSortChange } = useEventFilters();
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteEvents(filters);

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Table<As<EventExtended>>
        isHeaderSticky
        aria-label="Table of events"
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
          emptyContent="No events to display."
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
