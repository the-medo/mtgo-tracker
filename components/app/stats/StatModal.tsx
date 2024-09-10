import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { TbChartBar } from 'react-icons/tb';
import { MatchExtended } from '@/app/api/match/route';
import { useMemo } from 'react';
import { DeckArchetype, MatchResult } from '@prisma/client';
import { ResponsiveBar } from '@nivo/bar';
import { BarDatum } from '@nivo/bar/dist/types/types';
import { GameExtended } from '@/app/api/game/route';
import {
  ArchetypeMap,
  getEmptyMatchDistribution,
  MatchDistribution,
} from '@/components/app/stats/statModalLib';

interface StatModalProps {
  data: MatchExtended[];
}

export default function StatModal({ data }: StatModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { archetypeMap, archetypeList } = useMemo(() => {
    const amap: ArchetypeMap = {};
    const alist: number[] = [];

    data.forEach(m => {
      if (m.oppArchetype) {
        const oaid = m.oppArchetype.id;

        if (!amap[oaid]) {
          amap[oaid] = { ...m.oppArchetype, totalGames: 0, totalMatches: 0, matches: [] };
          alist.push(oaid);
        }

        amap[oaid].matches.push(m);
        amap[oaid].totalMatches++;
        amap[oaid].totalGames += m.Games.filter(g => g.result).length;
      }
    });

    return { archetypeMap: amap, archetypeList: alist };
  }, [data]);

  const chartData = useMemo(() => {
    const result: BarDatum[] = [];

    const sortedArchetypes = archetypeList.toSorted(
      (a1, a2) => (archetypeMap[a2]?.totalMatches ?? 0) - (archetypeMap[a1]?.totalMatches ?? 0),
    );

    sortedArchetypes.forEach(a => {
      const arch = archetypeMap[a];
      if (arch) {
        const matchDistribution: MatchDistribution = getEmptyMatchDistribution();
        const matchesOnTheDraw = [];

        arch.matches.forEach(m => {
          if (!m.result) return;
          matchDistribution.matchMap[m.id] = m;
          const firstGame = m.Games.find(g => g.gameNumber === 1);
          if (firstGame) {
            if (firstGame.isOnPlay) {
              matchDistribution.onThePlay.matchList.push(m.id);
              matchDistribution.onThePlay[m.result].push(m.id);
            } else {
              matchDistribution.onTheDraw.matchList.push(m.id);
              matchDistribution.onTheDraw[m.result].push(m.id);
            }
          }
        });

        result.push({
          archetype: arch.name,
          'Win [on the play]': matchDistribution.onThePlay[MatchResult.WIN].length,
          'Win [on the draw]': matchDistribution.onTheDraw[MatchResult.WIN].length,
          'Draw [on the play]': matchDistribution.onThePlay[MatchResult.DRAW].length,
          'Draw [on the draw]': matchDistribution.onTheDraw[MatchResult.DRAW].length,
          'Lose [on the play]': matchDistribution.onThePlay[MatchResult.LOSE].length,
          'Lose [on the draw]': matchDistribution.onTheDraw[MatchResult.LOSE].length,
        });
      }
    });

    return result;
  }, [archetypeList, archetypeMap]);

  console.log({ chartData });

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        isIconOnly
        radius="full"
        onPress={onOpen}
        className="absolute right-4 bottom-4 z-20"
      >
        <TbChartBar size={28} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent className="p-2 pt-6">
          {onClose => (
            <>
              <ModalBody>
                <div className="h-[400px] w-full">
                  <ResponsiveBar
                    data={chartData}
                    indexBy="archetype"
                    keys={[
                      'Win [on the play]',
                      'Win [on the draw]',
                      'Draw [on the play]',
                      'Draw [on the draw]',
                      'Lose [on the play]',
                      'Lose [on the draw]',
                    ]}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    margin={{ top: 50, bottom: 100, left: 50 }}
                    colors={{ scheme: 'nivo' }}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
