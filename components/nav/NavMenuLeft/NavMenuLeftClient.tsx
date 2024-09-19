'use client';

import { TbMenu2 } from 'react-icons/tb';
import cn from 'classnames';
import useStore from '@/store/store';
import { useState } from 'react';
import NavMenuLeftContent from '@/components/nav/NavMenuLeft/NavMenuLeftContent';

interface Props {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function NavMenuLeftClient({ isAuthenticated, isAdmin }: Props) {
  const breakpoint = useStore(state => state.breakpoint);
  const isMenuOpen = useStore(state => state.isMenuOpen);

  if (['xs', 'sm'].includes(breakpoint)) {
    return (
      <>
        <div
          className={cn(
            'z-30 fixed bottom-0 top-16 left-0 bg-white transition-transform duration-300 ease-in-out',
            isMenuOpen ? 'translate-y-0' : '-translate-y-full',
            {
              'right-0': breakpoint === 'xs',
              'w-[250px]': breakpoint === 'sm',
            },
          )}
        >
          <div
            className={cn('flex flex-row w-full h-full', {
              'w-[250px]': breakpoint === 'sm',
              'w-full': breakpoint === 'xs',
            })}
          >
            <div
              className={cn(
                'flex-shrink-0 h-full border-r-1 flex flex-col p-4 text-default-600 overflow-y-auto',
                {
                  'w-[250px]': breakpoint === 'sm',
                  'w-[200px]': breakpoint === 'xs',
                },
              )}
            >
              <NavMenuLeftContent isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
            </div>
            {breakpoint === 'xs' && (
              <div className="flex-grow min-w-0 overflow-y-auto" id="left-menu-portal-target"></div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-[200px] border-r-1 flex flex-col p-4 text-default-600 overflow-y-auto">
      <NavMenuLeftContent isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
    </div>
  );
}
