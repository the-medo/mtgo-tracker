import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prismaAdapter } from '@/lib/prisma';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(prismaAdapter);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return children;
}
