'use client';

import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import {
  TbArticle,
  TbCards,
  TbGraph,
  TbTower,
  TbTrophy,
  TbUsers,
  TbZeppelin,
} from 'react-icons/tb';

const dashboardIcon = <TbGraph size={24} />;
const matchIcon = <TbArticle size={24} />;
const eventIcon = <TbTrophy size={24} />;
const deckIcon = <TbCards size={24} />;
const userIcon = <TbUsers size={24} />;
const formatIcon = <TbTower size={24} />;
const archetypeIcon = <TbZeppelin size={24} />;

interface ListboxItem {
  key: string;
  label: string;
  icon: JSX.Element;
}

interface Props {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function NavMenuLeftClient({ isAuthenticated, isAdmin }: Props) {
  return (
    <div className="w-[200px] border-r-1 flex flex-col p-4 text-default-600">
      {isAuthenticated && (
        <Listbox variant="flat" aria-label="Side menu">
          <ListboxSection title="YOUR STUFF">
            <ListboxItem key="your-dashboard" startContent={dashboardIcon} href="/your/dashboard">
              Your dashboard
            </ListboxItem>
            <ListboxItem key="your-matches" startContent={matchIcon} href="/your/matches">
              Your matches
            </ListboxItem>
            <ListboxItem key="your-events" startContent={eventIcon} href="/your/events">
              Your events
            </ListboxItem>
            <ListboxItem key="your-decks" startContent={deckIcon} href="/your/decks">
              Your decks
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      )}

      {isAdmin && (
        <Listbox variant="flat" aria-label="Side menu">
          <ListboxSection title="ADMIN">
            <ListboxItem
              key="admin-archetypes"
              startContent={archetypeIcon}
              href="/admin/archetypes"
            >
              Archetypes
            </ListboxItem>
            <ListboxItem key="admin-formats" startContent={formatIcon} href="/admin/formats">
              Formats
            </ListboxItem>
            <ListboxItem key="public-users" startContent={userIcon} href="/users">
              Users
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      )}
    </div>
  );
}
