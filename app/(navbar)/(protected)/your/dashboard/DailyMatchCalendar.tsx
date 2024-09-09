'use client';

import cn from 'classnames';
import { useDailyMatches } from '@/app/api/dashboard/daily/matches/useDailyMatches';
import { ResponsiveCalendar } from '@nivo/calendar';
import { useMemo, useState } from 'react';

interface DailyMatchCalendarProps {}

export default function DailyMatchCalendar({}: DailyMatchCalendarProps) {
  const { data: dailyMatches } = useDailyMatches();
  const today = new Date();
  const [startDate, setStartDate] = useState<string>(`${today.getFullYear()}-01-01`);

  const data = useMemo(
    () =>
      (dailyMatches ?? []).map(d => ({
        ...d,
        value: d.matchDraws + d.matchWins - d.matchLoses,
        day: d.matchDate.slice(0, 10),
      })),
    [dailyMatches],
  );

  console.log({ data });

  return (
    <>
      <div className={cn(`flex flex-col h-[200px] p-4 w-1/2 min-w-[400px] gap-2`)}>
        <ResponsiveCalendar
          from={startDate}
          to={today}
          data={data}
          emptyColor="#eeeeee"
          colors={['#f47560', '#e8c1a0', '#97e3d5', '#61cdbb']}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          tooltip={n => JSON.stringify(n)}
          dayBorderColor="#ffffff"
        />
      </div>
    </>
  );
}
