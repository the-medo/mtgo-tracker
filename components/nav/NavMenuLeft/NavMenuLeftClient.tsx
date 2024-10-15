'use client';

import cn from 'classnames';
import useStore from '@/store/store';
import { PropsWithChildren } from 'react';
import { LeftMenuType } from '@/store/appSlice';

interface NavMenuLeftClientProps extends PropsWithChildren {
  type: LeftMenuType;
  size?: 'md' | 'lg';
}

export default function NavMenuLeftClient({ type, children, size = 'md' }: NavMenuLeftClientProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const isMenuOpen = useStore(state => state.isMenuOpen);

  if (['xs', 'sm'].includes(breakpoint)) {
    return (
      <>
        <div
          className={cn(
            'z-30 fixed bottom-0 top-16 left-0 bg-background transition-transform duration-300 ease-in-out right-0',
            isMenuOpen === type ? 'translate-y-0' : '-translate-y-full',
          )}
        >
          <div
            className={cn('flex flex-row w-full h-full', {
              // 'w-[250px]': breakpoint === 'sm',
              // 'w-full': breakpoint === 'xs',
            })}
          >
            <div
              className={cn(
                'flex-shrink-0 h-full border-r-1 flex flex-col p-4 text-default-600 overflow-y-auto w-full',
                {
                  // 'w-[250px]': breakpoint === 'sm',
                  // 'w-[200px]': breakpoint === 'xs',
                },
              )}
            >
              {children}
            </div>
            {/*<div className="flex-grow min-w-0 overflow-y-auto" id="left-menu-portal-target"></div>*/}
          </div>
        </div>
      </>
    );
  }

  if (type === LeftMenuType.NAVIGATION) {
    return (
      <div className="w-[200px] border-r-1 flex flex-col p-4 text-default-600 overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn('p-4  border-r-1 flex flex-col gap-4 overflow-y-auto', {
        'w-[250px] min-w-[250px]': size === 'md',
        'w-[300px] min-w-[300px]': size === 'lg',
      })}
    >
      {children}
    </div>
  );
}
