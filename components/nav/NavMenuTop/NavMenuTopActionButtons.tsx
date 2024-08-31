'use client';

import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { TbPlus } from 'react-icons/tb';
import { useSession } from 'next-auth/react';

const plusIcon = <TbPlus size={18} />;

export default function NavMenuTopActionButtons() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          match
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          event
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button startContent={plusIcon} className="text-default-700">
          deck
        </Button>
      </NavbarItem>
    </>
  );
}
