import { getServerSession } from 'next-auth/next';
import { prismaAdapter } from '@/lib/prisma';

export default async function YourDashboard() {
  const sessionData = await getServerSession(prismaAdapter);

  return (
    <main>
      You are in your dashboard<div>{JSON.stringify(sessionData)}</div>
    </main>
  );
}
