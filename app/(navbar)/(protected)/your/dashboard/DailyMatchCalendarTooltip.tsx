import { DailyMatchCalendarData } from '@/app/(navbar)/(protected)/your/dashboard/DailyMatchCalendar';
import cn from 'classnames';
import { Chip, ChipProps } from '@nextui-org/chip';
import { useMemo } from 'react';
import Title from '@/components/typography/Title';

interface DailyMatchCalendarTooltipProps {
  data: DailyMatchCalendarData;
}

export default function DailyMatchCalendarTooltip({ data }: DailyMatchCalendarTooltipProps) {
  const chipColor: ChipProps['color'] = useMemo(() => {
    if (data.matchWins > data.matchLosses) return 'success';
    if (data.matchWins < data.matchLosses) return 'danger';
    return 'warning';
  }, [data.matchLosses, data.matchWins]);

  return (
    <div
      className={cn('p-2 rounded-md flex flex-col items-center justify-center gap-1 z-50', {
        'bg-success-300': data.matchWins > data.matchLosses,
        'bg-danger-300': data.matchWins < data.matchLosses,
        'bg-warning-200': data.matchWins === data.matchLosses,
      })}
    >
      <Title title={data.day} size="xs" />
      <Chip size="lg" radius="sm" variant="solid" color={chipColor}>
        {data.matchWins}-{data.matchLosses}
        {data.matchDraws > 0 ? `-${data.matchDraws}` : ''}
      </Chip>
    </div>
  );
}
