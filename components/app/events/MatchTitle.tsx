'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { deckInfoIdentificator } from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import useSimplePatch from '@/app/api/useSimplePatch';
import { useCallback } from 'react';
import { MatchResult } from '@prisma/client';
import ResultSelector from '@/components/form/ResultSelector';

interface MatchTitleProps {
  matchId: number;
  eventId: number;
}

export default function MatchTitle({ matchId, eventId }: MatchTitleProps) {
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);

  const { mutate: patchMatch, isPending } = useSimplePatch(QK.MATCH);

  const matchResult = match?.result ?? undefined;

  const valueChangeHandler = useCallback(
    (value: MatchResult | undefined) => {
      console.log('HM!', value, matchId);
      patchMatch({
        id: matchId,
        field: 'result',
        value: value ? value.toString() : null,
      });
    },
    [patchMatch, matchId],
  );

  return (
    <div className="flex flex-row w-full gap-4 items-center justify-between">
      <div className="flex flex-row gap-4 items-center">
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

      <div className="flex flex-row gap-4 items-center">
        <span>Result:</span>
        <ResultSelector
          value={matchResult}
          onValueChange={valueChangeHandler}
          isLoading={isPending || isLoading}
        />
      </div>
    </div>
  );
}
