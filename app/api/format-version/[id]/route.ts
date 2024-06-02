import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { FormatVersion } from '@prisma/client';
import { NextApiRequest } from 'next';

export async function PATCH(req: NextApiRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(req.query.id as string);
    const { latestRelease, latestBans, description, validFrom } = req.body as FormatVersion;

    const record = await prisma.formatVersion.update({
      data: {
        latestRelease,
        latestBans,
        description,
        validFrom,
      },
      where: {
        id: id,
      },
    });

    return NextResponse.json(record);
  } else {
    throw new Error('Only admin can add new format version!');
  }
}

export async function DELETE(req: NextApiRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.isAdmin) {
    const id = parseInt(req.query.id as string);

    const deletedRow = await prisma.formatVersion.delete({ where: { id: id } });

    return NextResponse.json(deletedRow);
  } else {
    throw new Error('Only admin can add new format version!');
  }
}
