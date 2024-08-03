'use client';

import { useMatch } from '@/app/api/match/[id]/getMatch';
import Title from '@/components/typography/Title';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { deckInfoIdentificator } from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import ResultSelector from '@/components/form/ResultSelector';
import useSimplePatch from '@/app/api/useSimplePatch';
import { useCallback } from 'react';
import { MatchResult } from '@prisma/client';

interface MatchFooterProps {
  matchId: number;
  eventId: number;
}

export default function MatchFooter({ matchId, eventId }: MatchFooterProps) {
  const { data: match, isLoading } = useMatch(matchId);
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const { mutate: patchMatch, isPending } = useSimplePatch(QK.MATCH);

  const matchResult = match?.result ?? undefined;

  const valueChangeHandler = useCallback(
    (value: MatchResult | undefined) => {
      patchMatch({
        id: matchId,
        field: 'result',
        value: value ? value.toString() : null,
      });
    },
    [patchMatch, matchId],
  );

  return (
    <div className="flex flex-row w-full gap-4 items-center">
      <ResultSelector
        value={matchResult}
        onValueChange={valueChangeHandler}
        isLoading={isPending || isLoading || isLoadingEvent}
      />
    </div>
  );
}
