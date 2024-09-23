import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: {} }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await prisma.event.aggregate({
    where: {
      userId,
    },
    _sum: {
      entry: true,
      winnings: true,
    },
    _count: true,
  });

  if (!data) {
    return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 403 });
  }

  return NextResponse.json({
    totalEntry: data._sum.entry,
    totalWinnings: data._sum.winnings,
    totalEvents: data._count,
  });
}
