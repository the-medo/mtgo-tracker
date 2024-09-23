import useStore from '@/store/store';
import Title from '@/components/typography/Title';
import MatchBox from '@/components/app/matches/MatchBox';
import Notice from '@/components/app/Notice';
import { TbInfoCircle } from 'react-icons/tb';

interface StatArchetypeMatchesProps {}

export default function StatArchetypeMatches({}: StatArchetypeMatchesProps) {
  const archetypeId = useStore(state => state.statSelectedArchetypeId);
  const { archetypeMap } = useStore(state => state.statData);

  const archetypeData = archetypeMap[archetypeId ?? 0];
  if (!archetypeData)
    return (
      <Notice variant="info">
        <span className="flex gap-2">
          <TbInfoCircle size={18} /> Click on bar chart to display matches of that archetype.
        </span>
      </Notice>
    );

  const archetypeName = archetypeData.name ?? '-';

  return (
    <>
      <Title title={archetypeName} />
      {archetypeData.matches.map(i => (
        <MatchBox key={i.id} matchId={i.id} eventId={null} showDeckName />
      ))}
    </>
  );
}
