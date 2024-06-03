'use client';

import { ArchetypeGroup, Format } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { useQuery } from '@tanstack/react-query';

import { QK } from '@/app/api/queryHelpers';
import { getArchetypeGroups } from '@/app/api/archetype-group/getArchetypeGroups';
import ArchetypeGroupsForm from '@/app/(navbar)/(admin)/admin/archetypes/ArchetypeGroupsForm';

const TABLE_ID = 'ARCHETYPE_GROUPS';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: ArchetypeGroup, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <TableField
          qk={QK.ARCHETYPE_GROUPS}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="name"
          label="Name"
          value={data.name ?? undefined}
          editable={true}
        />
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <DeleteButton id={data.id} qk={QK.ARCHETYPE_GROUPS} />
        </div>
      );
  }
};

interface Props {}

export default function ArchetypeGroupsClient({}: Props) {
  const { data } = useQuery({
    queryKey: [QK.ARCHETYPE_GROUPS],
    queryFn: getArchetypeGroups,
  });

  return (
    <div className="flex flex-row gap-4">
      <Table<As<ArchetypeGroup>> aria-label="Table of archetype groups">
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
      <ArchetypeGroupsForm />
    </div>
  );
}
