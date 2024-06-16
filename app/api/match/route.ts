import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDate, parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user) {
    if (!data.deckId) return NextResponse.json({ error: 'deckId is mandatory!' }, { status: 403 });
    const record = await prisma.match.create({
      data: {
        userId: session.user?.id,
        round: parseNumber(data.round),
        mtgoId: parseString(data.mtgoId, true) ?? '',
        oppName: parseString(data.oppName) ?? '',
        eventId: parseNumber(data.eventId),
        deckId: parseNumber(data.deckId)!,
        oppArchetypeId: parseNumber(data.oppArchetypeId),
        oppArchetypeNote: parseString(data.oppArchetypeNote) ?? '',
        oppUserId: '',
        oppMatchId: undefined,
        matchType: data.matchType,
        isWin: false,
        startTime: parseDate(data.startTime) ?? new Date(),
        public: false,
      },
      include: {
        MatchTags: true,
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new match!' }, { status: 403 });
  }
}

const matchExtension = Prisma.validator<Prisma.MatchDefaultArgs>()({
  include: {
    MatchTags: true,
  },
});

export type MatchExtended = Prisma.MatchGetPayload<typeof matchExtension>;

export async function GET(req: Request) {
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Match'>(req.url);

  console.log('where', where, 'orderBy', orderBy);

  const data: MatchExtended[] = await prisma.match.findMany({
    where,
    orderBy: orderBy ?? { startTime: 'desc' },
    skip,
    take,
    ...matchExtension,
  });

  return NextResponse.json(data);
}
