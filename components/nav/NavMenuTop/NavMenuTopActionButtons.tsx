'use client';

import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { TbCards, TbTrophy } from 'react-icons/tb';
import { useSession } from 'next-auth/react';

const trophyIcon = <TbTrophy size={18} />;
const cardsIcon = <TbCards size={18} />;

export default function NavMenuTopActionButtons() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <NavbarItem>
        <Button startContent={trophyIcon} className="text-default-700">
          New event
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button startContent={cardsIcon} className="text-default-700">
          New deck
        </Button>
      </NavbarItem>
    </>
  );
}
