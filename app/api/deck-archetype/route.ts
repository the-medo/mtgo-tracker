import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (!data.formatId || !data.archetypeGroupId) {
    return NextResponse.json(
      { error: 'formatId and archetypeGroupId are mandatory!' },
      { status: 403 },
    );
  }

  if (session?.user?.isAdmin) {
    const record = await prisma.deckArchetype.create({
      data: {
        name: parseString(data.name) ?? '',
        formatId: parseNumber(data.formatId)!,
        archetypeGroupId: parseNumber(data.archetypeGroupId)!,
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only admin can add new deck archetype!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'DeckArchetype'>(req.url);

  console.log('where', where, 'orderBy', orderBy);

  const data = await prisma.deckArchetype.findMany({
    where,
    orderBy: orderBy ?? { name: 'asc' },
    skip,
    take,
  });
  return NextResponse.json(data);
}
