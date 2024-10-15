'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';
import { User } from '@nextui-org/user';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';

export function UserDropdown() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <>...</>;

  if (status === 'authenticated') {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            avatarProps={{ src: session?.user?.image ?? undefined, size: 'md' }}
            name={session?.user?.name ?? '-'}
            description={session?.user?.email ?? '-'}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          {/*<DropdownItem key="settings">
            <Link href={`/settings`}>My Settings</Link>
          </DropdownItem>*/}
          <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return <Button onClick={() => signIn()}>Sign In</Button>;
}
