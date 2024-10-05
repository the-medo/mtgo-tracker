'use client';

import cn from 'classnames';
import { DailyMatch, useDailyMatches } from '@/app/api/dashboard/daily/matches/useDailyMatches';
import { CalendarDatum, CalendarTooltipProps, ResponsiveCalendar } from '@nivo/calendar';
import { useCallback, useMemo, useState } from 'react';
import DailyMatchCalendarTooltip from '@/app/(navbar)/(protected)/your/dashboard/DailyMatchCalendarTooltip';
import Title from '@/components/typography/Title';
import { Chip } from '@nextui-org/chip';

export type DailyMatchCalendarData = CalendarDatum & DailyMatch;

interface DailyMatchCalendarProps {}

export default function DailyMatchCalendar({}: DailyMatchCalendarProps) {
  const { data: dailyMatches } = useDailyMatches();
  const today = new Date();
  const [startDate, setStartDate] = useState<string>(`${today.getFullYear()}-01-01`);

  const data: DailyMatchCalendarData[] = useMemo(
    () =>
      (dailyMatches ?? []).map(d => ({
        ...d,
        value: d.matchDraws + d.matchWins - d.matchLosses,
        day: d.matchDate.slice(0, 10),
      })),
    [dailyMatches],
  );

  const total = useMemo(
    () =>
      (dailyMatches ?? []).reduce(
        (pv, cv) => ({
          wins: pv.wins + cv.matchWins,
          losses: pv.losses + cv.matchLosses,
          draws: pv.draws + cv.matchDraws,
        }),
        { wins: 0, losses: 0, draws: 0 },
      ),
    [dailyMatches],
  );

  const tooltip = useCallback(
    (n: CalendarTooltipProps & { data?: DailyMatchCalendarData }) =>
      n.data ? <DailyMatchCalendarTooltip data={n.data as DailyMatchCalendarData} /> : null,
    [],
  );

  return (
    <>
      <div className={cn(`flex flex-col h-[200px] w-1/2 min-w-[330px] gap-2`)}>
        <div className="flex flex-row justify-between">
          <Title title="Matches - 2024" />
          {dailyMatches ? (
            <Chip variant="solid" color="default">
              Total: {total.wins}W {total.losses}L{total.draws > 0 ? ` ${total.draws}D` : ''}
            </Chip>
          ) : null}
        </div>
        <ResponsiveCalendar
          from={startDate}
          to={today}
          data={data}
          emptyColor="#eeeeee"
          colors={['#f47560', '#e8c1a0', '#97e3d5', '#61cdbb']}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          tooltip={tooltip}
          dayBorderColor="#ffffff"
        />
      </div>
    </>
  );
}
