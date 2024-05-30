'use client';

import { Bebas_Neue } from 'next/font/google';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { TbArticle, TbCards, TbGraph, TbTrophy, TbUser, TbUsers } from 'react-icons/tb';

const displayFont = Bebas_Neue({
  weight: '400',
});

const dashboardIcon = <TbGraph size={24} />;
const matchIcon = <TbArticle size={24} />;
const eventIcon = <TbTrophy size={24} />;
const deckIcon = <TbCards size={24} />;
const userIcon = <TbUsers size={24} />;

export default function NavMenuLeft() {
  return (
    <div className="w-[280px] border-r-1 flex flex-col p-4 text-default-600">
      <Listbox variant="flat" aria-label="Side menu with sections">
        <ListboxSection title="YOUR STUFF">
          <ListboxItem key="your-dashboard" startContent={dashboardIcon} href="/your-dashboard">
            Your dashboard
          </ListboxItem>
          <ListboxItem key="your-matches" startContent={matchIcon} href="/your-matches">
            Your matches
          </ListboxItem>
          <ListboxItem key="your-events" startContent={eventIcon} href="/your-events">
            Your events
          </ListboxItem>
          <ListboxItem key="your-decks" startContent={deckIcon} href="/your-decks">
            Your decks
          </ListboxItem>
        </ListboxSection>
        <ListboxSection title="PUBLIC">
          <ListboxItem key="public-matches" startContent={matchIcon} href="/matches">
            Matches
          </ListboxItem>
          <ListboxItem key="public-decks" startContent={deckIcon} href="/decks">
            Decks
          </ListboxItem>
          <ListboxItem key="public-users" startContent={userIcon} href="/users">
            Users
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </div>
  );
}
