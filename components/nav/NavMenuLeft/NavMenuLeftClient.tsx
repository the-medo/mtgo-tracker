'use client';

import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import {
  TbArticle,
  TbCards,
  TbGraph,
  TbMenu2,
  TbTags,
  TbTower,
  TbTrophy,
  TbUsers,
  TbZeppelin,
} from 'react-icons/tb';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import useStore from '@/store/store';
import { UserDropdown } from '@/components/auth/UserDropdown';
import { useState } from 'react';

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
  const breakpoint = useStore(state => state.breakpoint);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getActiveStyle = (href: string) => {
    return cn({
      'bg-primary-light text-primary-dark': pathname.startsWith(href),
      // 'bg-[#3b3b3b] text-[#ffff00]': pathname.startsWith(href),
    });
  };

  if (breakpoint === 'xs') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-red shadow-lg">
        <div className="flex justify-between items-center p-4">
          asd
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            <TbMenu2 className="w-6 h-6" />
          </button>
        </div>
        <div
          className={cn(
            'absolute bottom-full left-0 right-0 bg-white shadow-lg transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[200px] border-r-1 flex flex-col p-4 text-default-600">
      {breakpoint}
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
