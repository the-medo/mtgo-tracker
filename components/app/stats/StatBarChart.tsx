import { useMemo } from 'react';
import { BarDatum } from '@nivo/bar/dist/types/types';
import { MatchResult } from '@prisma/client';
import { StatData } from '@/components/app/stats/statModalLib';
import { ResponsiveBar } from '@nivo/bar';
import useStore from '@/store/store';

interface StatBarChartProps {
  statData: StatData;
}

export default function StatBarChart({ statData }: StatBarChartProps) {
  const statGrouping = useStore(state => state.statGrouping);
  const isStatDiverging = useStore(state => state.isStatDiverging);
  const isByStartingPlayer = useStore(state => state.isStatByStartingPlayer);
  const isByOpeningHand = useStore(state => state.isStatByOpeningHand);

  const { archetypeList, archetypeMap, byArchetype } = statData;

  const chartData = useMemo(() => {
    const dvgMultiplicator = isStatDiverging ? -1 : 1;
    const result: BarDatum[] = [];

    archetypeList.forEach(a => {
      const arch = archetypeMap[a];
      const archDistributions = byArchetype[a];
      if (arch && archDistributions) {
        result.push({
          archetype: arch.name,
          wp: archDistributions.matchDistribution.onThePlay[MatchResult.WIN].length,
          wd: archDistributions.matchDistribution.onTheDraw[MatchResult.WIN].length,
          dp: archDistributions.matchDistribution.onThePlay[MatchResult.DRAW].length,
          dd: archDistributions.matchDistribution.onTheDraw[MatchResult.DRAW].length,
          lp:
            archDistributions.matchDistribution.onThePlay[MatchResult.LOSE].length *
            dvgMultiplicator,
          lpColor: 'hsl(208,61%,40%)',
          ld:
            archDistributions.matchDistribution.onTheDraw[MatchResult.LOSE].length *
            dvgMultiplicator,
        });
      }
    });

    return result;
  }, [isStatDiverging, archetypeList, archetypeMap, byArchetype]);

  return (
    <ResponsiveBar
      data={chartData}
      indexBy="archetype"
      colorBy="id"
      keys={['wp', 'wd', 'dp', 'dd', 'ld', 'lp']}
      colors={['#1aa122', '#75d178', '#dcad14', '#dcd214', '#dda3a0', '#cd746b']}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      margin={{ top: 50, bottom: 100, left: 50 }}
      // colors={{ scheme: 'nivo' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 1,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 0,
      }}
    />
  );
}
