import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDeckLink, parseNumber, parseString } from '@/app/api/parsers';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user) {
    const parsedLink = parseDeckLink(data.link);
    if (!parsedLink) {
      return NextResponse.json({ error: 'Incorrect link to the deck' }, { status: 403 });
    }

    const record = await prisma.deck.create({
      data: {
        userId: session.user?.id,
        link: parsedLink.link,
        service: parsedLink.service,
        serviceDeckId: parsedLink.serviceDeckId,
        name: parseString(data.name) ?? '',
        formatId: parseNumber(data.formatId),
        formatVersionId: parseNumber(data.formatVersionId),
        deckArchetypeId: parseNumber(data.deckArchetypeId),
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new deck!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const data = await prisma.deck.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(data);
}
