import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber } from '@/app/api/parsers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const existingRecord = await prisma.deck.findFirst({ where: { id } });
    if (existingRecord?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to update this deck');
    }

    const body = await req.json();
    body.deckArchetypeId = parseNumber(body.deckArchetypeId);
    body.formatId = parseNumber(body.formatId);
    body.formatVersionId = parseNumber(body.formatVersionId);

    const record = await prisma.deck.update({
      data: { ...body },
      where: { id },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('You have no rights to update this deck');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const record = await prisma.deck.findFirst({ where: { id } });
    if (record?.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to delete this deck');
    }

    const deletedRow = await prisma.format.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('You have no rights to delete this deck');
  }
}
