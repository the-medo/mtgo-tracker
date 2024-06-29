'use client';

import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';

import { QK } from '@/app/api/queryHelpers';
import { useInfiniteDecks } from '@/app/api/deck/getDecks';
import { Spinner } from '@nextui-org/spinner';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import useDeckFilters from '@/app/(navbar)/(protected)/your/decks/useDeckFilters';
import DateDisplay from '@/components/typography/DateDisplay';
import EditButton from '@/components/form/table-form/EditButton';
import { DeckExtended } from '@/app/api/deck/route';
import { useRouter } from 'next/navigation';
import DeckInfoModal from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfoModal';

const TABLE_ID = 'DECKS';

const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Tags', uid: 'tags', maxWidth: 180 },
  { name: 'Format', uid: 'formatId', maxWidth: 180 },
  { name: 'Archetype', uid: 'deckArchetypeId', maxWidth: 180, sortable: true },
  { name: 'Last played at', uid: 'lastPlayedAt', maxWidth: 120, sortable: true },
  { name: 'Created at', uid: 'createdAt', maxWidth: 120, sortable: true },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: DeckExtended, columnKey: Key) => {
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
          />
        </div>
      );
    case 'tags':
      return (
        <TableField
          qk={QK.DECK}
          type="tags"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="tags"
          label="Tags"
          // @ts-ignore
          values={data.DeckTags}
        />
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
          preselectedItem={data.deckArchetype}
          value={data.deckArchetypeId}
        />
      );
    case 'lastPlayedAt':
      return <DateDisplay date={data.lastPlayedAt} />;
    case 'createdAt':
      return <DateDisplay date={data.createdAt} />;
    case 'actions':
      return (
        <div className="relative flex flex-row items-center gap-2">
          <DeckInfoModal deckId={data.id} />
          <DeleteButton id={data.id} qk={QK.DECK} />
        </div>
      );
  }
};

interface Props {}

export default function DecksClient({}: Props) {
  const router = useRouter();
  const { filters, sortDescriptor, onSortChange } = useDeckFilters();
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteDecks(filters);

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Table<As<DeckExtended>>
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
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              width={column.maxWidth}
              maxWidth={column.maxWidth}
              allowsSorting={column.sortable}
              className={`max-w-[${column.maxWidth}px]`}
            >
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
              className={`hover:bg-zinc-50 cursor-pointer ${item.id === -1 ? 'opacity-50' : ''}`}
              href={`/your/decks/${item.id}`}
            >
              {columnKey => (
                <TableCell onClick={e => e.stopPropagation()}>
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
