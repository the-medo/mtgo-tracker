import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDate, parseNumber, parseString } from '@/app/api/parsers';
import { EventExtended, eventExtension, eventPatchExtension } from '@/app/api/event/getEvents';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const existingRecord = await prisma.event.findFirst({ where: { id } });
    if (existingRecord?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to update this event');
    }

    const body = await req.json();
    body.mtgoId = parseString(body.mtgoId, true);
    body.name = parseString(body.name);
    body.date = parseDate(body.date);
    body.rounds = parseNumber(body.rounds);
    body.entry = parseNumber(body.entry);
    body.winnings = parseNumber(body.winnings);
    body.formatId = parseNumber(body.formatId);
    body.formatVersionId = parseNumber(body.formatVersionId);

    const record = await prisma.event.update({
      data: { ...body },
      where: { id },
      ...eventPatchExtension,
    });

    return NextResponse.json(record);
  } else {
    throw new Error('You have no rights to update this event');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const record = await prisma.event.findFirst({ where: { id } });
    if (record?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to delete this event');
    }

    const deletedRow = await prisma.event.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('You have no rights to delete this event');
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id || params.id.length === 0) {
    return NextResponse.json({ error: 'Failed to load the event' }, { status: 403 });
  }

  const data: EventExtended | null = await prisma.event.findFirst({
    where: {
      id: parseInt(params.id),
    },
    ...eventExtension,
  });

  if (!data) {
    return NextResponse.json({ error: 'Failed to load the event' }, { status: 403 });
  }

  return NextResponse.json(data);
}
