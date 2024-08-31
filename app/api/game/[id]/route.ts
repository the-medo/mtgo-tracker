import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber, parseString } from '@/app/api/parsers';
import { GameExtended, gameExtension, gamePatchExtension } from '@/app/api/game/route';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const existingRecord = await prisma.game.findFirst({ where: { id }, include: { match: true } });

    if (existingRecord?.match.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to update this game');
    }

    const body = await req.json();
    body.gameNumber = parseNumber(body.gameNumber);
    body.matchId = parseNumber(body.matchId);
    body.mtgoGameId = parseString(body.mtgoGameId);
    // body.isWin = parseBoolean(body.isWin);
    // body.isOnPlay = parseBoolean(body.isOnPlay);
    body.turns = parseNumber(body.turns);
    body.startingHand = parseNumber(body.startingHand);
    body.oppStartingHand = parseNumber(body.oppStartingHand);
    body.notes = parseString(body.notes);

    const record = await prisma.game.update({
      data: { ...body },
      where: { id },
      ...gamePatchExtension,
    });

    return NextResponse.json(record);
  } else {
    throw new Error('You have no rights to update this game');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const record = await prisma.game.findFirst({ where: { id }, include: { match: true } });
    if (record?.match.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to delete this game');
    }

    const deletedRow = await prisma.game.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('You have no rights to delete this game');
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id || params.id.length === 0) {
    return NextResponse.json({ error: 'Failed to load the game' }, { status: 403 });
  }

  const data: GameExtended | null = await prisma.game.findFirst({
    where: {
      id: parseInt(params.id),
    },
    ...gameExtension,
  });

  if (!data) {
    return NextResponse.json({ error: 'Failed to load the game' }, { status: 403 });
  }

  return NextResponse.json(data);
}
