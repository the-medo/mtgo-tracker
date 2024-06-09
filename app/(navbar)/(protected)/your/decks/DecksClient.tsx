'use client';

import { Deck } from '@prisma/client';
import { As, SortDescriptor, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key, useCallback } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';

import { QK } from '@/app/api/queryHelpers';
import { useInfiniteDecks } from '@/app/api/deck/getDecks';
import { Spinner } from '@nextui-org/spinner';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import useDeckFilters from '@/app/(navbar)/(protected)/your/decks/useDeckFilters';
import DateDisplay from '@/components/typography/DateDisplay';

const TABLE_ID = 'DECKS';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Format', uid: 'formatId', maxWidth: 180 },
  { name: 'Archetype', uid: 'deckArchetypeId', maxWidth: 180 },
  { name: 'Last played at', uid: 'lastPlayedAt', maxWidth: 120 },
  { name: 'Created at', uid: 'createdAt', maxWidth: 120 },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: Deck, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <div className="flex flex-row gap-1">
          {data.id === -1 && <Spinner color="default" size="sm" />}
          <TableField
            qk={QK.DECK}
            type="string"
            tableId={TABLE_ID}
            id={data.id}
            fieldName="name"
            label="Name"
            value={data.name ?? undefined}
            editable={false}
          />
        </div>
      );
    case 'formatId':
      return (
        <TableField
          qk={QK.DECK}
          selectType={QK.FORMATS}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="formatId"
          label="Format"
          value={data.formatId ?? undefined}
          editable={true}
        />
      );
    case 'deckArchetypeId':
      return (
        <TableField
          qk={QK.DECK}
          selectType={QK.DECK_ARCHETYPE}
          formatId={data.formatId}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="deckArchetypeId"
          label="Archetype"
          // @ts-ignore
          preselectedItem={data.deckArchetype}
          editable={true}
        />
      );
    case 'lastPlayedAt':
      return <DateDisplay date={data.lastPlayedAt} />;
    case 'createdAt':
      return <DateDisplay date={data.createdAt} />;
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <DeleteButton id={data.id} qk={QK.DECK} />
        </div>
      );
  }
};

interface Props {}

export default function DecksClient({}: Props) {
  const filter = useDeckFilters();
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteDecks(filter);

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  const onSortChange = useCallback((descriptor: SortDescriptor) => {
    console.log('onSortChange', descriptor);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Table<As<Deck>>
        isHeaderSticky
        aria-label="Table of decks"
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
        onSortChange={onSortChange}
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn key={column.uid} width={column.maxWidth} allowsSorting>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No decks to display."
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
