'use client';

import { Table } from '@nextui-org/react';
import { User as UserComponent } from '@nextui-org/user';
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { User } from '@prisma/client';
import { Key } from 'react';

const renderCell = (user: User, columnKey: Key) => {
  switch (columnKey) {
    case 'name':
      return (
        <UserComponent
          avatarProps={{ radius: 'md', src: user.image ?? undefined }}
          description={user.email}
          name={user.name}
        >
          {user.email}
        </UserComponent>
      );
    case 'matches':
      return JSON.stringify(user);
    case 'events':
    case 'decks':
      return 123;
  }
};

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Matches', uid: 'matches' },
  { name: 'Events', uid: 'events' },
  { name: 'Decks', uid: 'decks' },
];

type Props = {
  data: User[];
};

export default function UserTable({ data }: Props) {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {column => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
