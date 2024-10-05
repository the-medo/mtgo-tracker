'use client';

import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import { useSession } from 'next-auth/react';
import NavMenuLeftContent from '@/components/nav/NavMenuLeft/NavMenuLeftContent';
import { LeftMenuType } from '@/store/appSlice';

export default function NavMenuLeft() {
  const { data: session } = useSession();

  const isAuthenticated = !!session;
  const isAdmin = session?.user.isAdmin;

  return (
    <NavMenuLeftClient type={LeftMenuType.NAVIGATION}>
      <NavMenuLeftContent isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
    </NavMenuLeftClient>
  );
}
