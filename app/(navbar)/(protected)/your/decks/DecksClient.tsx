'use client';

import { Deck, Format } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { useQuery } from '@tanstack/react-query';

import { QK } from '@/app/api/queryHelpers';
import { getDecks } from '@/app/api/deck/getDecks';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';

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
        <TableField
          qk={QK.DECK}
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
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="deckArchetypeId"
          label="Archetype"
          value={data.formatId ?? undefined}
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
  const { data } = useQuery({
    queryKey: [QK.DECK],
    queryFn: getDecks,
  });

  return (
    <div className="flex flex-row gap-4">
      <Table<As<Deck>> aria-label="Table of decks">
        <TableHeader columns={columns}>
          {column => (
            <TableColumn key={column.uid} width={column.maxWidth}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data ?? []}>
          {item => (
            <TableRow key={item.id} className="hover:bg-zinc-50">
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DecksForm />
    </div>
  );
}
