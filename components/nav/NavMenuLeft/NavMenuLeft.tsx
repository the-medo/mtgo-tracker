import { getServerSession } from 'next-auth/next';
import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function NavMenuLeft() {
  const session = await getServerSession(authOptions);

  const isAuthenticated = !!session;
  const isAdmin = session?.user.isAdmin;

  return <NavMenuLeftClient isAuthenticated={isAuthenticated} isAdmin={isAdmin} />;
}
