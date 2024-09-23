import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseString } from '@/app/api/parsers';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user?.isAdmin) {
    const record = await prisma.archetypeGroup.create({
      data: {
        name: parseString(data.name) ?? '',
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only admin can add new archetype group!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const data = await prisma.archetypeGroup.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(data);
}
