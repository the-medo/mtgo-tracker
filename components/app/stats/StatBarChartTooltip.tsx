import cn from 'classnames';
import Title from '@/components/typography/Title';
import useStore from '@/store/store';
import { statKeyInfo } from '@/components/app/stats/statModalLib';
import { useMemo } from 'react';
import { MatchResult } from '@prisma/client';

interface StatBarChartTooltipProps {
  data: any;
}

export default function StatBarChartTooltip({ data }: StatBarChartTooltipProps) {
  const { archetypeMap } = useStore(state => state.statData);
  const isStatDiverging = useStore(state => state.isStatDiverging);

  const archetypeName = archetypeMap[data.archetype]?.name ?? '-';
  const sectionData = useMemo(
    () =>
      Object.keys(data)
        .filter(k => statKeyInfo[k])
        .map(k => ({
          ...statKeyInfo[k],
          k,
          count:
            data[k] * (isStatDiverging && statKeyInfo[k].matchResult === MatchResult.LOSE ? -1 : 1),
        }))
        .sort((a, b) => b.label.localeCompare(a.label)),
    [data, isStatDiverging],
  );

  return (
    <div
      className={cn(
        'p-2 rounded-md flex flex-col items-center justify-center gap-2 z-50 bg-zinc-100',
      )}
    >
      <Title title={archetypeName} size="xl" />
      <div className={cn('p-2 flex flex-col gap-1')}>
        {sectionData.map(d => {
          return (
            <div key={d.label} className="flex flex-row items-center gap-4">
              <div className="w-4 h-4" style={{ backgroundColor: d.color }}></div>
              <div className="w-8">{d.count}</div>
              <span>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
