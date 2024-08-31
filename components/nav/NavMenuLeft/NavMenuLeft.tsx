'use client';

import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import { useSession } from 'next-auth/react';

export default function NavMenuLeft() {
  const { data: session } = useSession();

  const isAuthenticated = !!session;
  const isAdmin = session?.user.isAdmin;

  return <NavMenuLeftClient isAuthenticated={isAuthenticated} isAdmin={isAdmin} />;
}
