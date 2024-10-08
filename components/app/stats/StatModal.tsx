import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { TbChartBar } from 'react-icons/tb';
import { useEffect } from 'react';
import {
  addMatchToDistributions,
  ArchetypeMap,
  GameDistribution,
  getEmptyGameDistribution,
  getEmptyMatchDistribution,
  getEmptyStatData,
  MatchDistribution,
  StatData,
} from '@/components/app/stats/statModalLib';
import StatBarChart from '@/components/app/stats/StatBarChart';
import StatSettings from '@/components/app/stats/StatSettings';
import useStore from '@/store/store';
import StatArchetypeMatches from '@/components/app/stats/StatArchetypeMatches';
import cn from 'classnames';
import { MatchExtended } from '@/app/api/match/getMatches';

interface StatModalProps {
  matchData: MatchExtended[];
}

export default function StatModal({ matchData }: StatModalProps) {
  const breakpoint = useStore(state => state.breakpoint);
  const setStatData = useStore(state => state.setStatData);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const r: StatData = getEmptyStatData();
    const amap: ArchetypeMap = {};
    const alist: number[] = [];

    matchData.forEach(m => {
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

    const sortedArchetypes = alist.toSorted(
      (a1, a2) => (amap[a2]?.totalMatches ?? 0) - (amap[a1]?.totalMatches ?? 0),
    );

    r.archetypeMap = amap;
    r.archetypeList = sortedArchetypes;

    const matchDistribution: MatchDistribution = getEmptyMatchDistribution();
    const gameDistribution: GameDistribution = getEmptyGameDistribution();

    r.archetypeList.forEach(a => {
      const arch = r.archetypeMap[a];
      if (arch) {
        if (!r.byArchetype[a]) {
          r.byArchetype[a] = {
            matchDistribution: getEmptyMatchDistribution(),
            gameDistribution: getEmptyGameDistribution(),
          };
        }

        arch.matches.forEach(m => {
          addMatchToDistributions(matchDistribution, gameDistribution, m);
          addMatchToDistributions(
            r.byArchetype[a]!.matchDistribution,
            r.byArchetype[a]!.gameDistribution,
            m,
          );
        });
      }
    });

    r.matchDistribution = matchDistribution;
    r.gameDistribution = gameDistribution;

    setStatData(r);
  }, [matchData, setStatData]);

  const smallScreen = ['xs', 'sm'].includes(breakpoint);

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        isIconOnly
        radius="full"
        onPress={onOpen}
        className="absolute right-4 bottom-16 z-20"
      >
        <TbChartBar size={28} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent className="p-2 md:p-4 pt-6 overflow-x-hidden overflow-y-auto">
          {onClose => (
            <>
              <ModalBody className="px-0">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row flex-wrap gap-4">
                    <div
                      className={cn('flex flex-col gap-4', {
                        'w-1/2': breakpoint !== 'sm' && breakpoint !== 'xs',
                        'w-full': breakpoint === 'sm' || breakpoint === 'xs',
                      })}
                    >
                      <StatSettings smallScreen={smallScreen} />
                      <StatBarChart smallScreen={smallScreen} />
                    </div>
                    <div
                      className={cn('flex flex-row grow min-w-[300px] md:h-[calc(100vh-130px)]', {
                        'w-1/3': breakpoint !== 'sm' && breakpoint !== 'xs',
                        'w-full': breakpoint === 'sm' || breakpoint === 'xs',
                      })}
                    >
                      <div className="flex flex-col w-full gap-2 md:overflow-y-auto">
                        <StatArchetypeMatches />
                      </div>
                    </div>
                  </div>
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
