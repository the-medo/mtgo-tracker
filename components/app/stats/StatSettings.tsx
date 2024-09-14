import { Tab, Tabs } from '@nextui-org/tabs';
import { StatGrouping } from '@/components/app/stats/statModalLib';
import Title from '@/components/typography/Title';
import useStore from '@/store/store';
import { Key, useCallback, useMemo } from 'react';

export default function StatSettings() {
  const statGrouping = useStore(state => state.statGrouping);
  const isStatDiverging = useStore(state => state.isStatDiverging);
  const isByStartingPlayer = useStore(state => state.isStatByStartingPlayer);
  const isByOpeningHand = useStore(state => state.isStatByOpeningHand);

  const setGrouping = useStore(state => state.setStatGrouping);
  const toggleIsStatDiverging = useStore(state => state.toggleIsStatDiverging);
  const toggleIsByStartingPlayer = useStore(state => state.toggleIsStatByStartingPlayer);
  const toggleIsByOpeningHand = useStore(state => state.toggleIsStatByOpeningHand);

  const handleGroupingChange = useCallback(
    (k: Key) => setGrouping(k as StatGrouping),
    [setGrouping],
  );

  const openingHandDisabledKeys = useMemo(
    () => (statGrouping === StatGrouping.MATCH ? ['true', 'false'] : undefined),
    [statGrouping],
  );

  return (
    <>
      <div className="flex flex-row gap-4 items-center flex-wrap">
        <div className="flex flex-row gap-2 items-center">
          <Title title="Grouping:" />
          <Tabs
            aria-label="Options"
            selectedKey={statGrouping}
            onSelectionChange={handleGroupingChange}
          >
            <Tab key={StatGrouping.MATCH} title="Matches" />
            <Tab key={StatGrouping.GAME} title="Games" />
          </Tabs>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Tabs
            aria-label="Options"
            selectedKey={isStatDiverging ? 'true' : 'false'}
            onSelectionChange={toggleIsStatDiverging}
          >
            <Tab key="true" title="Diverging" />
            <Tab key="false" title="No" />
          </Tabs>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Tabs
            aria-label="Options"
            selectedKey={isByStartingPlayer ? 'true' : 'false'}
            onSelectionChange={toggleIsByStartingPlayer}
          >
            <Tab key="true" title="Starting player" />
            <Tab key="false" title="No" />
          </Tabs>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Tabs
            aria-label="Options"
            selectedKey={isByOpeningHand ? 'true' : 'false'}
            onSelectionChange={toggleIsByOpeningHand}
            disabledKeys={openingHandDisabledKeys}
          >
            <Tab key="true" title="Opening hand size" />
            <Tab key="false" title="No" />
          </Tabs>
        </div>
      </div>
    </>
  );
}
