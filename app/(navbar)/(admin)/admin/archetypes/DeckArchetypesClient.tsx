'use client';

import { DeckArchetype, Format } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { QK } from '@/app/api/queryHelpers';
import { useInfiniteDeckArchetypes } from '@/app/api/deck-archetype/getDeckArchetypes';
import DeckArchetypesForm from '@/app/(navbar)/(admin)/admin/archetypes/DeckArchetypesForm';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { Spinner } from '@nextui-org/spinner';

const TABLE_ID = 'DECK_ARCHETYPES';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Format', uid: 'formatId', maxWidth: 180 },
  { name: 'Type', uid: 'archetypeGroupId', maxWidth: 180 },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: DeckArchetype, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <TableField
          qk={QK.DECK_ARCHETYPE}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="name"
          label="Name"
          value={data.name ?? undefined}
          editable={true}
        />
      );
    case 'formatId':
      return (
        <TableField
          qk={QK.DECK_ARCHETYPE}
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
    case 'archetypeGroupId':
      return (
        <TableField
          qk={QK.DECK_ARCHETYPE}
          selectType={QK.ARCHETYPE_GROUPS}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="archetypeGroupId"
          label="Archetype group"
          value={data.archetypeGroupId ?? undefined}
          editable={true}
        />
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <DeleteButton id={data.id} qk={QK.DECK_ARCHETYPE} />
        </div>
      );
  }
};

interface Props {}

export default function DeckArchetypesClient({}: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDeckArchetypes();

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
  });

  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-row gap-4">
      <Table<As<DeckArchetype>>
        isHeaderSticky
        aria-label="Table of Deck archetypes"
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
          // table: 'min-h-[400px]',
        }}
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn key={column.uid} width={column.maxWidth}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No deck archetypes to display."
          isLoading={isFetching}
          items={items}
        >
          {item => (
            <TableRow key={item.id} className="hover:bg-default-50">
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeckArchetypesForm />
    </div>
  );
}
