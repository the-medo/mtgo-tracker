import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDeckLink, parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { DeckExtended, deckExtension } from '@/app/api/deck/getDecks';

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
        format: {
          connect: {
            id: parseNumber(data.formatId)!,
          },
        },
        formatVersion: {
          connect: {
            id: parseNumber(data.formatVersionId)!,
          },
        },
        deckArchetype: {
          connect: {
            id: parseNumber(data.deckArchetypeId)!,
          },
        },
      },
      ...deckExtension,
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new deck!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Deck'>(
    req.url,
    session?.user?.id,
  );

  console.log('where', where, 'orderBy', orderBy);

  const data: DeckExtended[] = await prisma.deck.findMany({
    where,
    orderBy: orderBy ?? { createdAt: 'desc' },
    skip,
    take,
    ...deckExtension,
  });

  return NextResponse.json(data);
}
