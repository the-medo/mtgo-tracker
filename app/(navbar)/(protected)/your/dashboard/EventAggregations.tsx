'use client';

import { useEventAggregates } from '@/app/api/event/aggregate/useEventAggregates';
import cn from 'classnames';
import Title from '@/components/typography/Title';

interface EventAggregationsProps {}

export default function EventAggregations({}: EventAggregationsProps) {
  const { data: aggregates } = useEventAggregates();

  return (
    <div
      className={cn(`flex flex-col min-w-[300px] pt-4 md:pt-0 md:h-[200px] w-full md:w-1/4 gap-2`)}
    >
      <Title title="Event statistics" />
      <div className={cn(`flex flex-col p-2 md:p-4 w-full gap-2 rounded-md bg-default-100`)}>
        <div className="flex flex-row gap-2 md:gap-4">
          <div className="flex flex-col gap-2 w-[30%]">
            <span className="text-sm">Total events</span>
            <span className="text-lg">{aggregates?.totalEvents}</span>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <span className="text-sm">Total entry</span>
            <span className="text-lg">{aggregates?.totalEntry}</span>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <span className="text-sm">Total winnings</span>
            <span className="text-lg">{aggregates?.totalWinnings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
