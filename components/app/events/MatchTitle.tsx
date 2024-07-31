'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { deckInfoIdentificator } from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import { useEvent } from '@/app/api/event/[id]/getEvent';

interface MatchTitleProps {
  matchId: number;
  eventId: number;
}

export default function MatchTitle({ matchId, eventId }: MatchTitleProps) {
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);

  return (
    <div className="flex flex-row w-full gap-4 items-center">
      <Title title={`Round ${match?.round}`} />
      vs. <i>{match?.oppName}</i>
      <TableField
        qk={QK.MATCH}
        selectType={QK.DECK_ARCHETYPE}
        formatId={event?.formatId}
        type="select"
        tableId={deckInfoIdentificator}
        id={matchId}
        fieldName="oppArchetypeId"
        label="Opp. Archetype"
        customLabel="Opp. Archetype"
        preselectedItem={match?.oppArchetype ?? undefined}
        editable={true}
      />
    </div>
  );
}
