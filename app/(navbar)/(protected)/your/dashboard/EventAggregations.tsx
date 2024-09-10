'use client';

import { useEventAggregates } from '@/app/api/event/aggregate/useEventAggregates';
import cn from 'classnames';
import Title from '@/components/typography/Title';

interface EventAggregationsProps {}

export default function EventAggregations({}: EventAggregationsProps) {
  const { data: aggregates } = useEventAggregates();

  return (
    <div className={cn(`flex flex-col min-w-[300px] h-[200px] w-1/3 gap-2`)}>
      <Title title="Event statistics" />
      <div className={cn(`flex flex-col p-4 w-full gap-2 rounded-md bg-default-100`)}>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-1/4">
            <span className="text-sm">Total events</span>
            <span className="text-lg">{aggregates?.totalEvents}</span>
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <span className="text-sm">Total entry</span>
            <span className="text-lg">{aggregates?.totalEntry}</span>
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <span className="text-sm">Total winnings</span>
            <span className="text-lg">{aggregates?.totalWinnings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
