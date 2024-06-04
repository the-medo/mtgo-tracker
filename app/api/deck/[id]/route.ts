import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const record = await prisma.deck.findFirst({ where: { id } });
    if (record.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to update this deck');
    }

    const body = await req.json();
    body.deckArchetypeId = parseInt(body.deckArchetypeId);
    body.formatId = parseInt(body.formatId);
    body.formatVersionId = parseInt(body.formatVersionId);

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
    if (record.userId !== session.user.id && !session.user.isAdmin) {
      throw new Error('You have no rights to delete this deck');
    }

    const deletedRow = await prisma.format.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('Only admin can delete a format!');
  }
}
