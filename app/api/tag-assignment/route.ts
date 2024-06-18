import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { TagType } from '@prisma/client';
import { parseNumber } from '@/app/api/parsers';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (!data.type) {
    return NextResponse.json({ error: 'type is mandatory' }, { status: 403 });
  }

  data.tagId = parseNumber(data.tagId);

  if (session) {
    if (!data.tagId) return NextResponse.json({ error: 'tagId not provided' }, { status: 403 });
    const tag = await prisma.tag.findFirst({
      where: {
        userId: session.user.id,
        id: data.tagId,
        type: data.type,
      },
    });

    if (!tag) return NextResponse.json({ error: 'Tag does not exist' }, { status: 403 });

    switch (data.type) {
      case TagType.DECK: {
        if (!data.deckId)
          return NextResponse.json({ error: 'deckId not provided' }, { status: 403 });
        data.deckId = parseNumber(data.deckId);
        const deck = await prisma.deck.findFirst({
          where: {
            userId: session.user.id,
            id: data.deckId,
          },
        });
        if (!deck) return NextResponse.json({ error: 'Deck does not exist' }, { status: 403 });

        const record = await prisma.deckTag.create({
          data: {
            tagId: data.tagId,
            deckId: data.deckId,
          },
        });

        return NextResponse.json(record);
      }
      case TagType.EVENT: {
        if (!data.eventId)
          return NextResponse.json({ error: 'eventId not provided' }, { status: 403 });
        data.eventId = parseNumber(data.eventId);
        const event = await prisma.event.findFirst({
          where: {
            userId: session.user.id,
            id: data.eventId,
          },
        });
        if (!event) return NextResponse.json({ error: 'Event does not exist' }, { status: 403 });

        const record = await prisma.eventTag.create({
          data: {
            tagId: data.tagId,
            eventId: data.eventId,
          },
        });

        return NextResponse.json(record);
      }
      case TagType.MATCH: {
        if (!data.matchId)
          return NextResponse.json({ error: 'matchId not provided' }, { status: 403 });
        data.matchId = parseNumber(data.matchId);
        const match = await prisma.match.findFirst({
          where: {
            userId: session.user.id,
            id: data.matchId,
          },
        });
        if (!match) return NextResponse.json({ error: 'Match does not exist' }, { status: 403 });

        const record = await prisma.matchTag.create({
          data: {
            tagId: data.tagId,
            matchId: data.matchId,
          },
        });

        return NextResponse.json(record);
      }
      case TagType.GAME: {
        if (!data.gameId)
          return NextResponse.json({ error: 'gameId not provided' }, { status: 403 });
        data.gameId = parseNumber(data.gameId);
        const game = await prisma.game.findFirst({
          where: {
            match: { userId: session.user.id },
            id: data.gameId,
          },
        });
        if (!game) return NextResponse.json({ error: 'game does not exist' }, { status: 403 });

        const record = await prisma.gameTag.create({
          data: {
            tagId: data.tagId,
            gameId: data.gameId,
          },
        });

        return NextResponse.json(record);
      }
      default: {
        return NextResponse.json({ error: `type ${data.type} not implemented` }, { status: 403 });
      }
    }
  } else {
    return NextResponse.json({ error: 'Only logged-in user can create tag!' }, { status: 403 });
  }
}
