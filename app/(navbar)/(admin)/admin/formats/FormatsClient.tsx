'use client';

import { Format } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import FormatsForm from '@/app/(navbar)/(admin)/admin/formats/FormatsForm';
import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';

import { QK } from '@/app/api/queryHelpers';

const TABLE_ID = 'FORMATS';
const PATH = 'format';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Latest version', uid: 'latestFormatVersionId', maxWidth: 180 },
  { name: 'Actions', uid: 'actions', maxWidth: 80 },
];

const renderCell = (data: Format, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <TableField
          qk={QK.FORMATS}
          type="string"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="name"
          label="Name"
          value={data.name ?? undefined}
          editable={true}
        />
      );
    case 'latestFormatVersionId':
      return (
        <TableField
          qk={QK.FORMATS}
          type="select"
          tableId={TABLE_ID}
          id={data.id}
          fieldName="latestFormatVersionId"
          label="Latest format version"
          value={data.latestFormatVersionId ?? undefined}
          editable={true}
        />
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <DeleteButton id={data.id} path={PATH} />
        </div>
      );
  }
};

interface Props {}

export default function FormatsClient({}: Props) {
  const { data } = useQuery({
    queryKey: ['formats'],
    queryFn: getFormats,
  });

  return (
    <div className="flex flex-row gap-4">
      <Table<As<Format>> aria-label="Table of Formats">
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
      <FormatsForm />
    </div>
  );
}
