import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { GameExtended, gameExtension } from '@/app/api/game/getGames';

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

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Game'>(
    req.url,
    session?.user?.id,
  );

  const data: GameExtended[] = await prisma.game.findMany({
    where,
    orderBy: orderBy ?? { gameNumber: 'asc' },
    skip,
    take,
    ...gameExtension,
  });

  return NextResponse.json(data);
}
