import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDate, parseNumber, parseString } from '@/app/api/parsers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const existingRecord = await prisma.match.findFirst({ where: { id } });
    if (existingRecord?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to update this match');
    }

    const body = await req.json();

    body.round = parseNumber(body.round);
    body.mtgoId = parseString(body.mtgoId);
    body.oppName = parseString(body.oppName);
    body.eventId = parseNumber(body.eventId);
    body.deckId = parseNumber(body.deckId);
    body.oppArchetypeId = parseNumber(body.oppArchetypeId);
    body.oppArchetypeNote = parseString(body.oppArchetypeNote);
    body.oppUserId = parseString(body.oppUserId);
    body.oppMatchId = parseString(body.oppMatchId);
    // body.matchType = body.matchType; //in case of MatchType parser
    // body.isWin = body.isWin; //in case of bool parser
    body.startTime = parseDate(body.startTime);
    // body.public = body.public; //in case of bool parser

    const record = await prisma.match.update({
      data: { ...body },
      where: { id },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('You have no rights to update this match');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const record = await prisma.match.findFirst({ where: { id } });
    if (record?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to delete this match');
    }

    const deletedRow = await prisma.match.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('You have no rights to delete this match');
  }
}
