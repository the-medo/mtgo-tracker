'use client';

import { FormatVersion } from '@prisma/client';
import { As, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key, useCallback, useState } from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { TbEdit, TbTrash } from 'react-icons/tb';
import FormatVersionsForm from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsForm';

const columns = [
  { name: 'Latest release', uid: 'latest-release' },
  { name: 'Latest bans', uid: 'latest-bans' },
  { name: 'Description', uid: 'description' },
  { name: 'Valid from', uid: 'valid-from' },
  { name: 'Actions', uid: 'actions' },
];

const renderCell = (
  data: FormatVersion,
  columnKey: Key,
  selected: boolean,
  onChange: () => void,
  onDelete: () => void,
) => {
  switch (columnKey) {
    case 'latest-release':
      return data.latestRelease ?? <p className="text-xs italic">- empty -</p>;
    case 'latest-bans':
      return data.latestBans ?? <p className="text-xs italic">- empty -</p>;
    case 'description':
      return <p className="italic">{data.description ?? '- empty -'}</p>;
    case 'valid-from':
      return data.validFrom?.toDateString();
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <Button isIconOnly color="danger" size="sm" onClick={onDelete}>
            <TbTrash size={16} />
          </Button>
        </div>
      );
  }
};

interface Props {
  data: FormatVersion[];
}

export default function FormatVersionsClient({ data }: Props) {
  const [selectedKey, setSelectedKey] = useState<Key>();

  const onSelectionChange = (keys: Set<Key> | string) => {
    if (typeof keys !== 'string') {
      const arr = Array.from(keys);
      setSelectedKey(arr.length > 0 ? arr[0] : undefined);
    }
  };

  const onChange = useCallback(() => {}, []);
  const onDelete = useCallback(() => {}, []);

  return (
    <div className="flex flex-row gap-4">
      <Table<As<FormatVersion>>
        onSelectionChange={onSelectionChange}
        selectionMode="single"
        aria-label="Example table with custom cells"
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
          {item => (
            <TableRow key={item.id}>
              {columnKey => (
                <TableCell>
                  {renderCell(item, columnKey, item.id === selectedKey, onChange, onDelete)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FormatVersionsForm />
    </div>
  );
}
