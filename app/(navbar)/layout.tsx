'use client';

import NavMenuTop from '@/components/nav/NavMenuTop/NavMenuTop';
import NavMenuLeft from '@/components/nav/NavMenuLeft/NavMenuLeft';
import cn from 'classnames';

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn('flex flex-col h-full')}>
      <NavMenuTop />
      <div className={cn('flex flex-row grow h-[calc(100%-theme(spacing.16)-1px)]')}>
        <NavMenuLeft />
        {children}
      </div>
    </div>
  );
}
