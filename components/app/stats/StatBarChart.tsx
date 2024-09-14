import { useCallback, useMemo } from 'react';
import { BarDatum, ComputedDatum } from '@nivo/bar/dist/types/types';
import { MatchResult } from '@prisma/client';
import {
  openingHandSizeArray,
  startingPlayerKeyArray,
  StatBarChartData,
  statBaseKeys,
  StatGrouping,
  statKeyInfo,
} from '@/components/app/stats/statModalLib';
import { ResponsiveBar } from '@nivo/bar';
import useStore from '@/store/store';
import StatBarChartTooltip from '@/components/app/stats/StatBarChartTooltip';

interface StatBarChartProps {}

export default function StatBarChart({}: StatBarChartProps) {
  const statGrouping = useStore(state => state.statGrouping);
  const setStatSelectedArchetypeId = useStore(state => state.setStatSelectedArchetypeId);
  const isStatDiverging = useStore(state => state.isStatDiverging);
  const isByStartingPlayer = useStore(state => state.isStatByStartingPlayer);
  const isByOpeningHand = useStore(state => state.isStatByOpeningHand);
  const { archetypeList, archetypeMap, byArchetype } = useStore(state => state.statData);

  const chartData = useMemo(() => {
    const dvgMultiplicator = isStatDiverging ? -1 : 1;
    const result: StatBarChartData[] = [];

    archetypeList.forEach(a => {
      const arch = archetypeMap[a];
      const adist = byArchetype[a];
      if (arch && adist) {
        const x: StatBarChartData = {
          archetype: arch.id,
        };

        if (statGrouping === StatGrouping.MATCH) {
          const dist = adist.matchDistribution;
          if (isByStartingPlayer) {
            const wp = dist.onThePlay[MatchResult.WIN].length;
            const wd = dist.onTheDraw[MatchResult.WIN].length;
            const dp = dist.onThePlay[MatchResult.DRAW].length;
            const dd = dist.onTheDraw[MatchResult.DRAW].length;
            const lp = dist.onThePlay[MatchResult.LOSE].length;
            const ld = dist.onTheDraw[MatchResult.LOSE].length;
            if (wp) x.wp = wp;
            if (wd) x.wd = wd;
            if (dp) x.dp = dp;
            if (dd) x.dd = dd;
            if (lp) x.lp = lp * dvgMultiplicator;
            if (ld) x.ld = ld * dvgMultiplicator;
          } else {
            const w =
              dist.onThePlay[MatchResult.WIN].length + dist.onTheDraw[MatchResult.WIN].length;
            const d =
              dist.onThePlay[MatchResult.DRAW].length + dist.onTheDraw[MatchResult.DRAW].length;
            const l =
              dist.onThePlay[MatchResult.LOSE].length + dist.onTheDraw[MatchResult.LOSE].length;
            if (w) x.w = w;
            if (d) x.d = d;
            if (l) x.l = l * dvgMultiplicator;
          }
        } else if (statGrouping === StatGrouping.GAME) {
          const dist = adist.gameDistribution;

          if (isByOpeningHand) {
            openingHandSizeArray.forEach(o1 => {
              openingHandSizeArray.forEach(o2 => {
                const k = `${o1}v${o2}`;
                if (isByStartingPlayer) {
                  startingPlayerKeyArray.forEach(sp => {
                    statBaseKeys[sp].forEach(bk => {
                      const appliedMultiplicator =
                        statKeyInfo[bk].matchResult === MatchResult.LOSE ? dvgMultiplicator : 1;
                      const sum =
                        dist[sp][o1][o2][statKeyInfo[bk].matchResult].length * appliedMultiplicator;
                      if (sum !== 0) x[`${bk}_${k}`] = sum;
                    });
                  });
                } else {
                  statBaseKeys['none'].forEach(bk => {
                    const appliedMultiplicator =
                      statKeyInfo[bk].matchResult === MatchResult.LOSE ? dvgMultiplicator : 1;
                    const sum =
                      dist.onThePlay[o1][o2][statKeyInfo[bk].matchResult].length *
                        appliedMultiplicator +
                      dist.onTheDraw[o1][o2][statKeyInfo[bk].matchResult].length *
                        appliedMultiplicator;
                    if (sum !== 0) x[`${bk}_${k}`] = sum;
                  });
                }
              });
            });
          } else {
            if (isByStartingPlayer) {
              startingPlayerKeyArray.forEach(sp => {
                statBaseKeys[sp].forEach(bk => {
                  const appliedMultiplicator =
                    statKeyInfo[bk].matchResult === MatchResult.LOSE ? dvgMultiplicator : 1;
                  let sum = 0;
                  openingHandSizeArray.forEach(o1 => {
                    openingHandSizeArray.forEach(o2 => {
                      sum += dist[sp][o1][o2][statKeyInfo[bk].matchResult].length;
                    });
                  });
                  if (sum > 0) {
                    x[bk] = sum * appliedMultiplicator;
                  }
                });
              });
            } else {
              statBaseKeys['none'].forEach(bk => {
                const appliedMultiplicator =
                  statKeyInfo[bk].matchResult === MatchResult.LOSE ? dvgMultiplicator : 1;
                let sum = 0;
                openingHandSizeArray.forEach(o1 => {
                  openingHandSizeArray.forEach(o2 => {
                    sum +=
                      dist.onThePlay[o1][o2][statKeyInfo[bk].matchResult].length +
                      dist.onTheDraw[o1][o2][statKeyInfo[bk].matchResult].length;
                  });
                });
                if (sum > 0) {
                  x[bk] = sum * appliedMultiplicator;
                }
              });
            }
          }
        }

        result.push(x);
      }
    });

    return result;
  }, [
    isStatDiverging,
    archetypeList,
    archetypeMap,
    byArchetype,
    statGrouping,
    isByStartingPlayer,
    isByOpeningHand,
  ]);

  const { barKeys, barColors } = useMemo(() => {
    const keys = Object.keys(statKeyInfo);
    const colors = keys.map(k => statKeyInfo[k].color!);
    return {
      barKeys: keys,
      barColors: colors,
    };
  }, []);

  const tooltip = useCallback(
    (n: { data?: BarDatum }) => (n.data ? <StatBarChartTooltip data={n.data as BarDatum} /> : null),
    [],
  );

  const axisBottom = useMemo(
    () => ({
      tickSize: 0,
      tickPadding: 5,
      tickRotation: 60,
      truncateTickAt: 0,
      format: (x: number) => archetypeMap[x]?.name ?? '- unknown archetype -',
    }),
    [archetypeMap],
  );

  const onClickHandler = useCallback(
    (datum: ComputedDatum<StatBarChartData>) => {
      setStatSelectedArchetypeId(datum.data.archetype);
    },
    [setStatSelectedArchetypeId],
  );

  return (
    <ResponsiveBar<StatBarChartData>
      data={chartData}
      indexBy="archetype"
      colorBy="id"
      keys={barKeys}
      colors={barColors}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      margin={{ top: 50, bottom: 100, left: 50, right: 50 }}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={{
        tickSize: 1,
        tickPadding: 5,
        tickRotation: 0,
        truncateTickAt: 0,
      }}
      onClick={onClickHandler}
      tooltip={tooltip}
    />
  );
}
