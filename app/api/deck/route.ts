import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDeckLink, parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { Prisma } from '@prisma/client';

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

export const deckExtension = Prisma.validator<Prisma.DeckDefaultArgs>()({
  include: {
    deckArchetype: true,
    DeckTags: true,
  },
});

export const deckPatchExtension = Prisma.validator<Prisma.DeckDefaultArgs>()({
  include: {
    deckArchetype: true,
  },
});

export type DeckExtended = Prisma.DeckGetPayload<typeof deckExtension>;

export async function GET(req: Request) {
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Deck'>(req.url);

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
