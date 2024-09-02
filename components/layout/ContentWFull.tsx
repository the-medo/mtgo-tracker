'use client';

import useStore from '@/store/store';
import cn from 'classnames';

export default function ContentWFull({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const breakpoint = useStore(state => state.breakpoint);

  return (
    <div
      className={cn('w-full flex flex-col overflow-y-auto', {
        'p-2': breakpoint === 'xs' || breakpoint === 'sm',
        'p-4': breakpoint !== 'xs' && breakpoint !== 'sm',
      })}
    >
      {children}
    </div>
  );
}
