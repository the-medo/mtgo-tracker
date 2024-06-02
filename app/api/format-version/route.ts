import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseDate, parseString } from '@/app/api/parsers';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user?.isAdmin) {
    const record = await prisma.formatVersion.create({
      data: {
        latestRelease: parseString(data.latestRelease),
        latestBans: parseString(data.latestBans),
        description: parseString(data.description),
        validFrom: parseDate(data.validFrom),
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only admin can add new format version!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const data = await prisma.formatVersion.findMany();
  return NextResponse.json(data);
}
