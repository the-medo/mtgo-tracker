import useStore from '@/store/store';
import Title from '@/components/typography/Title';
import MatchBox from '@/components/app/matches/MatchBox';

interface StatArchetypeMatchesProps {}

export default function StatArchetypeMatches({}: StatArchetypeMatchesProps) {
  const archetypeId = useStore(state => state.statSelectedArchetypeId);
  const { archetypeMap } = useStore(state => state.statData);

  const archetypeData = archetypeMap[archetypeId ?? 0];

  if (!archetypeData) return null;

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
