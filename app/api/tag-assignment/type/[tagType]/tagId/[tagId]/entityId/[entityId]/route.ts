import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { TagType } from '@prisma/client';

export async function DELETE(
  req: Request,
  { params }: { params: { tagType: TagType; tagId: string; entityId: string } },
) {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const tagType = params.tagType;
    const tagId = parseInt(params.tagId as string);
    const entityId = parseInt(params.entityId as string);

    if (!tagId || tagId === 0)
      return NextResponse.json({ error: 'tagId cannot be empty' }, { status: 403 });
    if (!entityId || entityId === 0)
      return NextResponse.json({ error: 'entityId cannot be empty' }, { status: 403 });

    const userCondition = session.user.isAdmin ? {} : { userId: session.user.id };

    switch (tagType) {
      case TagType.DECK: {
        const deletedRow = await prisma.deckTag.delete({
          where: {
            tagId_deckId: {
              tagId,
              deckId: entityId,
            },
            deck: userCondition,
          },
        });
        return NextResponse.json(deletedRow);
      }
      case TagType.EVENT: {
        const deletedRow = await prisma.eventTag.delete({
          where: {
            tagId_eventId: {
              tagId,
              eventId: entityId,
            },
            event: userCondition,
          },
        });
        return NextResponse.json(deletedRow);
      }
      case TagType.MATCH: {
        const deletedRow = await prisma.matchTag.delete({
          where: {
            tagId_matchId: {
              tagId,
              matchId: entityId,
            },
            match: userCondition,
          },
        });
        return NextResponse.json(deletedRow);
      }
      case TagType.GAME: {
        const deletedRow = await prisma.gameTag.delete({
          where: {
            tagId_gameId: {
              tagId,
              gameId: entityId,
            },
            game: {
              match: userCondition,
            },
          },
        });
        return NextResponse.json(deletedRow);
      }
      default: {
        return NextResponse.json({ error: `tagType ${tagType} not implemented` }, { status: 403 });
      }
    }
  } else {
    throw new Error('Not logged in!');
  }
}
