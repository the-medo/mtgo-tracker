import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber } from '@/app/api/parsers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);
    const body = await req.json();

    body.formatId = parseNumber(body.formatId);
    body.archetypeGroupId = parseNumber(body.archetypeGroupId);

    const record = await prisma.deckArchetype.update({
      data: { ...body },
      where: {
        id: id,
      },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('Only admin can patch a deck archetype!');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const deletedRow = await prisma.deckArchetype.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('Only admin can delete a deck archetype!');
  }
}
