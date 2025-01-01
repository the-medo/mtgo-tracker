import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { DailyMatch } from '@/app/api/dashboard/daily/matches/useDailyMatches';
import { subMonths } from 'date-fns';

export async function GET(req: Request, { params }: { params: {} }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startDate = subMonths(new Date(), 6);

  const data = await prisma.$queryRaw`
    SELECT 
      DATE("public"."Match"."startTime") as "matchDate", 
      SUM(CASE WHEN "public"."Match"."result" = 'WIN' THEN 1 ELSE 0 END) as "matchWins",
      SUM(CASE WHEN "public"."Match"."result" = 'LOSE' THEN 1 ELSE 0 END) as "matchLosses",
      SUM(CASE WHEN "public"."Match"."result" = 'DRAW' THEN 1 ELSE 0 END) as "matchDraws"
    FROM "public"."Match"
    WHERE 
        "public"."Match"."userId" = ${session?.user?.id}
        AND "public"."Match"."startTime" >= ${startDate}
    GROUP BY "matchDate"
  `;

  const processedData = (data as DailyMatch[]).map(row => ({
    matchDate: row.matchDate,
    matchWins: Number(row.matchWins),
    matchLosses: Number(row.matchLosses),
    matchDraws: Number(row.matchDraws),
  }));

  if (!data) {
    return NextResponse.json({ error: 'Failed to aggregate data' }, { status: 403 });
  }

  return NextResponse.json(processedData);
}
