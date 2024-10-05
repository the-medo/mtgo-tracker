'use client';

import cn from 'classnames';

export default function ContentWFull({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={cn('w-full flex flex-col overflow-y-auto p-2 md:p-4')}>{children}</div>;
}
