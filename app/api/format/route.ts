import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseNumber, parseString } from '@/app/api/parsers';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (session?.user?.isAdmin) {
    const record = await prisma.format.create({
      data: {
        name: parseString(data.name) ?? '',
        latestFormatVersionId: parseNumber(data.latestFormatVersionId),
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only admin can add new format!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const data = await prisma.format.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(data);
}
