import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseString } from '@/app/api/parsers';
import { parseQueryApiParamsForPrisma } from '@/types/api-params';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const data = await req.json();

  if (!data.type) {
    return NextResponse.json({ error: 'type is mandatory' }, { status: 403 });
  }
  const name = parseString(data.name) ?? '';
  if (!name || name.length === 0) {
    return NextResponse.json({ error: 'name is missing' }, { status: 403 });
  }

  if (session) {
    const record = await prisma.tag.create({
      data: {
        userId: session.user.id,
        name,
        type: data.type,
      },
    });

    return NextResponse.json(record);
  } else {
    return NextResponse.json({ error: 'Only logged-in user can create tag!' }, { status: 403 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { where, orderBy, skip, take } = parseQueryApiParamsForPrisma<'Tag'>(req.url);

  if (!session) {
    return NextResponse.json({ error: 'Only logged-in user can get tags!' }, { status: 403 });
  }

  const data = await prisma.tag.findMany({
    where: {
      ...where,
      userId: session?.user.id,
    },
    orderBy: orderBy ?? { name: 'asc' },
    skip,
    take,
  });
  return NextResponse.json(data);
}
