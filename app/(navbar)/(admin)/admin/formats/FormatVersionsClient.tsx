'use client';

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { FormatVersion } from '@prisma/client';
import { As, DatePicker, Table } from '@nextui-org/react';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Key } from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { Input } from '@nextui-org/input';
import Title from '@/components/typography/Title';

const columns = [
  { name: 'Latest release', uid: 'latest-release' },
  { name: 'Latest bans', uid: 'latest-bans' },
  { name: 'Description', uid: 'description' },
  { name: 'Valid from', uid: 'valid-from' },
  { name: 'Actions', uid: 'actions' },
];

const renderCell = (data: FormatVersion, columnKey: Key) => {
  switch (columnKey) {
    case 'latest-release':
      return data.latestRelease ?? <p className="text-xs italic">- empty -</p>;
    case 'latest-bans':
      return data.latestBans ?? <p className="text-xs italic">- empty -</p>;
    case 'description':
      return <p className="italic">{data.description ?? '- empty -'}</p>;
    case 'valid-from':
      return data.validFrom?.getDate();
    // return <DatePicker className="max-w-[150px]" value={data.validFrom} />;
    case 'actions':
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Edit" placement="top">
            <Button isIconOnly size="sm">
              <TbEdit size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete" placement="top">
            <Button isIconOnly color="danger" size="sm">
              <TbTrash size={16} />
            </Button>
          </Tooltip>
        </div>
      );
  }
};

interface Props {
  data: FormatVersion[];
}

export default function FormatVersionsClient({ data }: Props) {
  return (
    <div className="flex flex-row gap-4">
      <Table<As<FormatVersion>>
        selectedKeys={[]}
        selectionMode="single"
        aria-label="Example table with custom cells"
      >
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
          {item => (
            <TableRow key={item.id}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Card className="w-[300px]">
        <CardHeader>
          <Title title="New Format Version" />
        </CardHeader>
        {/*<Divider />*/}
        <CardBody className="flex flex-col gap-2">
          <Input type="text" label="Latest release" size="sm" />
          <Input type="text" label="Latest bans" size="sm" />
          <Input type="text" label="Description" size="sm" />
          <DatePicker label="Valid from" size="sm" />
          <Button>Create</Button>
        </CardBody>
      </Card>
    </div>
  );
}
