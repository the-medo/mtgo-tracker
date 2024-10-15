'use client';

import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import {
  TbArticle,
  TbCards,
  TbGraph,
  TbLogout,
  TbTags,
  TbTower,
  TbTrophy,
  TbUsers,
  TbZeppelin,
} from 'react-icons/tb';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import useStore from '@/store/store';
import { signOut } from 'next-auth/react';
import Links from '@/components/nav/Links';

const dashboardIcon = <TbGraph size={24} />;
const matchIcon = <TbArticle size={24} />;
const eventIcon = <TbTrophy size={24} />;
const deckIcon = <TbCards size={24} />;
const userIcon = <TbUsers size={24} />;
const formatIcon = <TbTower size={24} />;
const logoutIcon = <TbLogout size={24} />;
const archetypeIcon = <TbZeppelin size={24} />;
const tagIcon = <TbTags size={24} />;

interface NavMenuLeftContentProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function NavMenuLeftContent({ isAuthenticated, isAdmin }: NavMenuLeftContentProps) {
  const pathname = usePathname();
  const breakpoint = useStore(state => state.breakpoint);

  const getActiveStyle = (href: string) => {
    return cn({
      'bg-primary-light text-primary-dark': pathname.startsWith(href),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 justify-between h-full">
        <div className="flex flex-col gap-4">
          {isAuthenticated && (
            <Listbox variant="flat" aria-label="Side menu">
              <ListboxSection title="YOUR STUFF">
                <ListboxItem
                  key="your-dashboard"
                  startContent={dashboardIcon}
                  href="/your/dashboard"
                  className={getActiveStyle('/your/dashboard')}
                >
                  Dashboard
                </ListboxItem>
                <ListboxItem
                  key="your-decks"
                  startContent={deckIcon}
                  href="/your/decks"
                  className={getActiveStyle('/your/decks')}
                >
                  Decks
                </ListboxItem>
                <ListboxItem
                  key="your-events"
                  startContent={eventIcon}
                  href="/your/events"
                  className={getActiveStyle('/your/events')}
                >
                  Events
                </ListboxItem>
                <ListboxItem
                  key="your-matches"
                  startContent={matchIcon}
                  href="/your/matches"
                  className={getActiveStyle('/your/matches')}
                >
                  Matches
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
        {(breakpoint === 'xs' || breakpoint === 'sm') && (
          <Listbox variant="flat" aria-label="Logout">
            <ListboxItem
              key="logout"
              startContent={logoutIcon}
              color="danger"
              variant="solid"
              onPress={() => signOut()}
            >
              Logout
            </ListboxItem>
          </Listbox>
        )}
      </div>
      <Links variant="sm" />
    </>
  );
}
