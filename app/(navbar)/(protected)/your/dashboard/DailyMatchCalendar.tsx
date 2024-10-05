'use client';

import cn from 'classnames';
import { DailyMatch, useDailyMatches } from '@/app/api/dashboard/daily/matches/useDailyMatches';
import { CalendarDatum, CalendarTooltipProps, ResponsiveTimeRange } from '@nivo/calendar';
import { useCallback, useMemo} from 'react';
import DailyMatchCalendarTooltip from '@/app/(navbar)/(protected)/your/dashboard/DailyMatchCalendarTooltip';
import Title from '@/components/typography/Title';
import { Chip } from '@nextui-org/chip';
import useStore from '@/store/store';
import { format, subMonths } from 'date-fns';
import { TimeRangeSvgProps } from '@nivo/calendar/dist/types/types';

export type DailyMatchCalendarData = CalendarDatum & DailyMatch;

interface DailyMatchCalendarProps {}

export default function DailyMatchCalendar({}: DailyMatchCalendarProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const { data: dailyMatches } = useDailyMatches();

  const { startDate, endDate, weekdayTicks, weekdayLegendOffset } = useMemo(() => {
    const isSmall = ['xs', 'sm'].includes(breakpoint);

    const today = new Date();
    const prevYear = format(subMonths(today, 6), 'yyyy-MM-dd');
    const prevThreeMonths = format(subMonths(today, 3), 'yyyy-MM-dd');
    const weekdayTicks: TimeRangeSvgProps['weekdayTicks'] = isSmall ? [] : [0, 2, 4, 6];

    return {
      startDate: isSmall ? prevThreeMonths : prevYear,
      endDate: today,
      weekdayTicks,
      weekdayLegendOffset: isSmall ? 0 : 75,
    };
  }, [breakpoint]);

  const data: DailyMatchCalendarData[] = useMemo(() => {
    const matches = dailyMatches ?? [];
    const computeValue = (d: DailyMatch) => d.matchDraws + d.matchWins - d.matchLosses;

    let maxValue = Infinity,
      minValue = Infinity;
    matches.forEach(d => {
      const value = computeValue(d);
      if (value > maxValue || maxValue === Infinity) maxValue = value;
      if (value < minValue) minValue = value;
    });

    const minusRatio = minValue >= 0 ? 1 : (maxValue / minValue) * -1;
    const diff = minValue >= 0 ? 0 : minValue * minusRatio * -1;

    return matches.map(d => ({
      ...d,
      value: (computeValue(d) < 0 ? computeValue(d) * minusRatio : computeValue(d)) + diff,
      day: d.matchDate.slice(0, 10),
    }));
  }, [dailyMatches]);

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

  const tooltip = useCallback((n: CalendarTooltipProps) => {
    return n ? (
      <DailyMatchCalendarTooltip data={n as CalendarTooltipProps & DailyMatchCalendarData} />
    ) : null;
  }, []);

  return (
    <>
      <div className={cn(`flex flex-col h-[200px] grow min-w-[330px] gap-2`)}>
        <div className="flex flex-row justify-between">
          <Title title="Matches - 2024" />
          {dailyMatches ? (
            <Chip variant="solid" color="default">
              Total: {total.wins}W {total.losses}L{total.draws > 0 ? ` ${total.draws}D` : ''}
            </Chip>
          ) : null}
        </div>
        <ResponsiveTimeRange
          from={startDate}
          to={endDate}
          data={data}
          emptyColor="#eeeeee"
          colors={['#f47560', '#f47560', '#e8c1a0', '#f4ec97', '#97e3d5', '#61cdbb']}
          margin={{ top: 20 }}
          dayBorderWidth={2}
          tooltip={tooltip}
          dayBorderColor="#ffffff"
          monthLegendOffset={10}
          firstWeekday="monday"
          weekdayTicks={weekdayTicks}
          weekdayLegendOffset={weekdayLegendOffset}
        />
      </div>
    </>
  );
}
