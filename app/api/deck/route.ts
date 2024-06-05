import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDeckLink, parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user) {
    let linkObject = {};
    const parsedLink = parseDeckLink(data.link);
    if (parsedLink) {
      linkObject = {
        link: parsedLink.link,
        service: parsedLink.service,
        serviceDeckId: parsedLink.serviceDeckId,
      };
    }

    const record = await prisma.deck.create({
      data: {
        ...linkObject,
        userId: session.user?.id,
        name: parseString(data.name) ?? '',
        formatId: parseNumber(data.formatId)!,
        formatVersionId: parseNumber(data.formatVersionId)!,
        deckArchetypeId: parseNumber(data.deckArchetypeId)!,
      },
      include: {
        deckArchetype: true,
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new deck!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Deck'>(req.url);

  console.log('where', where, 'orderBy', orderBy);

  const data = await prisma.deck.findMany({
    where,
    orderBy: orderBy ?? { name: 'asc' },
    skip,
    take,
    include: { deckArchetype: true },
  });

  return NextResponse.json(data);
}
