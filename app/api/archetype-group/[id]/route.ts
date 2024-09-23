import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id);
    const body = await req.json();

    const record = await prisma.archetypeGroup.update({
      data: { ...body },
      where: {
        id: id,
      },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('Only admin can patch an archetype group!');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(params.id as string);

    const deletedRow = await prisma.archetypeGroup.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('Only admin can delete an archetype group!');
  }
}
