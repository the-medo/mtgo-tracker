'use client';

import { FormatVersion } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import FormatVersionsForm from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsForm';
import TableField from '@/components/form/table-form/TableField';
import DeleteButton from '@/components/form/table-form/DeleteButton';
import { useQuery } from '@tanstack/react-query';
import { getFormatVersions } from '@/app/api/format-version/getFormatVersions';

import { QK } from '@/app/api/queryHelpers';

const TABLE_ID = 'FORMAT_VERSIONS';

const columns = [
  { name: 'Latest release', uid: 'latest-release', maxWidth: 180 },
  { name: 'Latest bans', uid: 'latest-bans', maxWidth: 180 },
  { name: 'Description', uid: 'description' },
  { name: 'Valid from', uid: 'valid-from', maxWidth: 180 },
  { name: 'Actions', uid: 'actions', maxWidth: 120 },
];

const renderCell = (data: FormatVersion, columnKey: Key) => {
  switch (columnKey) {
    case 'latest-release':
      return (
        <TableField
          tableId={TABLE_ID}
          qk={QK.FORMAT_VERSIONS}
          id={data.id}
          fieldName="latestRelease"
          label="Latest release"
          type="string"
          value={data.latestRelease ?? undefined}
          editable={true}
        />
      );
    case 'latest-bans':
      return (
        <TableField
          tableId={TABLE_ID}
          qk={QK.FORMAT_VERSIONS}
          id={data.id}
          fieldName="latestBans"
          label="Latest bans"
          type="string"
          value={data.latestBans ?? undefined}
          editable={true}
        />
      );
    case 'description':
      return (
        <TableField
          tableId={TABLE_ID}
          qk={QK.FORMAT_VERSIONS}
          id={data.id}
          fieldName="description"
          label="Description"
          type="string"
          value={data.description ?? undefined}
          editable={true}
        />
      );
    case 'valid-from':
      return (
        <TableField
          tableId={TABLE_ID}
          qk={QK.FORMAT_VERSIONS}
          id={data.id}
          fieldName="validFrom"
          label="Valid from"
          type="date"
          value={data.validFrom ?? undefined}
          editable={true}
        />
      );
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <DeleteButton id={data.id} qk={QK.FORMAT_VERSIONS} />
        </div>
      );
  }
};

interface Props {}

export default function FormatVersionsClient({}: Props) {
  const { data } = useQuery({
    queryKey: [QK.FORMAT_VERSIONS],
    queryFn: getFormatVersions,
  });

  return (
    <div className="flex flex-row gap-4">
      <Table<As<FormatVersion>> aria-label="Example table with custom cells">
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
      <FormatVersionsForm />
    </div>
  );
}
