'use client';

import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { TbCards, TbTrophy } from 'react-icons/tb';
import { useSession } from 'next-auth/react';
import DeckCreationModal from '@/app/(navbar)/(protected)/your/decks/[id]/DeckCreationModal';
import EventCreationModal from '@/app/(navbar)/(protected)/your/events/[id]/EventCreationModal';

const trophyIcon = <TbTrophy size={18} />;
const cardsIcon = <TbCards size={18} />;

const eventCreationTrigger = (
  <Button startContent={trophyIcon} className="text-default-700">
    New event
  </Button>
);

const deckCreationTrigger = (
  <Button startContent={cardsIcon} className="text-default-700">
    New deck
  </Button>
);

export default function NavMenuTopActionButtons() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <NavbarItem>
        <EventCreationModal trigger={eventCreationTrigger} />
      </NavbarItem>
      <NavbarItem>
        <DeckCreationModal trigger={deckCreationTrigger} />
      </NavbarItem>
    </>
  );
}
