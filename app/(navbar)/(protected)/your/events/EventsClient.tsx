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
import { EventExtended } from '@/app/api/event/route';
import EventInfoModal from '@/app/(navbar)/(protected)/your/events/[id]/EventInfoModal';
import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import EventBox from '@/components/app/events/EventBox';

const TABLE_ID = 'EVENTS';

const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Type', uid: 'type', sortable: true },
  { name: 'Format', uid: 'formatId', maxWidth: 150 },
  { name: 'Deck', uid: 'deckId' },
  { name: 'Tags', uid: 'tags', maxWidth: 100 },
  { name: 'Rounds', uid: 'rounds', maxWidth: 70, sortable: true },
  { name: 'Entry', uid: 'entry', maxWidth: 70, sortable: true },
  { name: 'Winnings', uid: 'winnings', maxWidth: 70, sortable: true },
  { name: 'Date', uid: 'date', maxWidth: 120, sortable: true },
  { name: 'Actions', uid: 'actions', maxWidth: 70 },
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
    case 'formatId':
      return (
        <TableField
          qk={QK.EVENT}
          selectType={QK.FORMATS}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="formatId"
          label="Format"
          value={data.formatId ?? undefined}
        />
      );
    case 'deckId':
      return (
        <TableField
          qk={QK.EVENT}
          type="select"
          selectType={QK.DECK}
          tableId={TABLE_ID}
          id={data.id}
          fieldName="deckId"
          label="Deck"
          formatId={data.formatId}
          value={data.deckId ?? undefined}
          preselectedItem={data.deck ?? undefined}
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
          <EventInfoModal eventId={data.id} />
          <DeleteButton id={data.id} qk={QK.EVENT} />
        </div>
      );
  }
};

interface Props {}

export default function EventsClient({}: Props) {
  const { filters, sortDescriptor, onSortChange } = useEventFilters();
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteEvents(filters);

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      {items.map(i => (
        <EventBox key={i.id} eventId={i.id} />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
    </div>
  );
}
