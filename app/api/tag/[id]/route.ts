import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);
    const body = await req.json();

    if (body.name?.length === 0) {
      return NextResponse.json({ error: 'name cannot be empty string' }, { status: 403 });
    }

    const record = await prisma.tag.update({
      data: { ...body },
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('Not logged in!');
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const id = parseInt(params.id as string);

    const deletedRow = await prisma.tag.delete({ where: { id: id, userId: session.user.id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('Not logged in!');
  }
}
