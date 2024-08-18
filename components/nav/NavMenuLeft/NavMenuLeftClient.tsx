'use client';

import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import {
  TbArticle,
  TbCards,
  TbGraph,
  TbTags,
  TbTower,
  TbTrophy,
  TbUsers,
  TbZeppelin,
} from 'react-icons/tb';
import { usePathname } from 'next/navigation';
import cn from 'classnames';

const dashboardIcon = <TbGraph size={24} />;
const matchIcon = <TbArticle size={24} />;
const eventIcon = <TbTrophy size={24} />;
const deckIcon = <TbCards size={24} />;
const userIcon = <TbUsers size={24} />;
const formatIcon = <TbTower size={24} />;
const archetypeIcon = <TbZeppelin size={24} />;
const tagIcon = <TbTags size={24} />;

interface Props {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function NavMenuLeftClient({ isAuthenticated, isAdmin }: Props) {
  const pathname = usePathname();

  const getActiveStyle = (href: string) => {
    return cn({
      'bg-primary-light text-primary-dark': pathname.startsWith(href),
      // 'bg-[#3b3b3b] text-[#ffff00]': pathname.startsWith(href),
    });
  };

  return (
    <div className="w-[200px] border-r-1 flex flex-col p-4 text-default-600">
      {isAuthenticated && (
        <Listbox variant="flat" aria-label="Side menu">
          <ListboxSection title="YOUR STUFF">
            <ListboxItem
              key="your-dashboard"
              startContent={dashboardIcon}
              href="/your/dashboard"
              className={getActiveStyle('/your/dashboard')}
            >
              Your dashboard
            </ListboxItem>
            <ListboxItem
              key="your-matches"
              startContent={matchIcon}
              href="/your/matches"
              className={getActiveStyle('/your/matches')}
            >
              Your matches
            </ListboxItem>
            <ListboxItem
              key="your-events"
              startContent={eventIcon}
              href="/your/events"
              className={getActiveStyle('/your/events')}
            >
              Your events
            </ListboxItem>
            <ListboxItem
              key="your-decks"
              startContent={deckIcon}
              href="/your/decks"
              className={getActiveStyle('/your/decks')}
            >
              Your decks
            </ListboxItem>
          </ListboxSection>
          <ListboxSection title="SETTINGS">
            <ListboxItem
              key="settings-tags"
              startContent={tagIcon}
              href="/settings/tags"
              className={getActiveStyle('/settings/tags')}
            >
              Tags
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
              className={getActiveStyle('/admin/archetypes')}
            >
              Archetypes
            </ListboxItem>
            <ListboxItem
              key="admin-formats"
              startContent={formatIcon}
              href="/admin/formats"
              className={getActiveStyle('/admin/formats')}
            >
              Formats
            </ListboxItem>
            <ListboxItem
              key="public-users"
              startContent={userIcon}
              href="/admin/users"
              className={getActiveStyle('/admin/users')}
            >
              Users
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      )}
    </div>
  );
}
