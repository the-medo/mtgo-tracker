'use client';

import { Deck } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { useQuery } from '@tanstack/react-query';

import { QK } from '@/app/api/queryHelpers';
import { getDecks, useInfiniteDecks } from '@/app/api/deck/getDecks';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';
import { Spinner } from '@nextui-org/spinner';
import { useInfiniteDeckArchetypes } from '@/app/api/deck-archetype/getDeckArchetypes';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';

const TABLE_ID = 'DECKS';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Format', uid: 'formatId', maxWidth: 180 },
  { name: 'Archetype', uid: 'deckArchetypeId', maxWidth: 180 },
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
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDecks();

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-row gap-4">
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
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn key={column.uid} width={column.maxWidth}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No decks to display." isLoading={isFetching} items={items}>
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
