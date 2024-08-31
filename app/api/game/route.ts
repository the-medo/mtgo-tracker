import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user) {
    const record = await prisma.game.create({
      data: {
        gameNumber: parseNumber(data.gameNumber)!,
        matchId: parseNumber(data.matchId)!,
        mtgoGameId: parseString(data.mtgoGameId),
        isOnPlay: data.isOnPlay,
        turns: parseNumber(data.turns),
        startingHand: parseNumber(data.startingHand),
        oppStartingHand: parseNumber(data.oppStartingHand),
        notes: parseString(data.notes),
      },
      ...gameExtension,
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new game!' }, { status: 403 });
  }
}

export const gameExtension = Prisma.validator<Prisma.GameDefaultArgs>()({
  include: {
    GameTags: true,
    match: true,
  },
});

export const gamePatchExtension = Prisma.validator<Prisma.GameDefaultArgs>()({});

export type GameExtended = Prisma.GameGetPayload<typeof gameExtension>;

export async function GET(req: Request) {
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Game'>(req.url);

  const data: GameExtended[] = await prisma.game.findMany({
    where,
    orderBy: orderBy ?? { gameNumber: 'asc' },
    skip,
    take,
    ...gameExtension,
  });

  return NextResponse.json(data);
}
