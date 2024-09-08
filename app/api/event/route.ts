import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDatePickerToIso, parseNumber, parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';
import { Prisma } from '@prisma/client';
import { matchExtension } from '@/app/api/match/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user) {
    const record = await prisma.event.create({
      data: {
        mtgoId: '',
        name: parseString(data.name) ?? '',
        type: data.type,
        date: parseDatePickerToIso(data.date),
        rounds: parseNumber(data.rounds) ?? 0,
        entry: parseNumber(data.entry) ?? 0,
        winnings: parseNumber(data.winnings) ?? 0,
        user: {
          connect: {
            id: session.user.id!,
          },
        },
        deck: {
          connect: {
            id: parseNumber(data.deckId)!,
          },
        },
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
      },
      ...eventExtension,
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged user can add new event!' }, { status: 403 });
  }
}

export const eventExtension = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    deck: true,
    EventTags: true,
    format: true,
    Matches: {
      ...matchExtension,
    },
  },
});

export const eventPatchExtension = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    deck: true,
    format: true,
  },
});

export type EventExtended = Prisma.EventGetPayload<typeof eventExtension>;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Event'>(
    req.url,
    session?.user?.id,
  );

  console.log('where', where, 'orderBy', orderBy);

  const data: EventExtended[] = await prisma.event.findMany({
    where,
    orderBy: orderBy ?? { date: 'desc' },
    skip,
    take,
    ...eventExtension,
  });

  return NextResponse.json(data);
}
