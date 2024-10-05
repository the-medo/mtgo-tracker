'use client';

import InfiniteScrollObserver from '@/components/app/InfiniteScrollObserver';
import { GetMatchesRequest, useInfiniteMatches } from '@/app/api/match/getMatches';
import MatchBox from '@/components/app/matches/MatchBox';

interface DeckMatchesProps {
  deckId: number;
}

export default function DeckMatches({ deckId }: DeckMatchesProps) {
  const filters: GetMatchesRequest = {
    where: {
      deckId,
    },
  };

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteMatches(filters);
  const items = data?.pages?.flat() ?? [];

  return (
    <div className="flex flex-col gap-4">
      {items.map(i => (
        <MatchBox key={i.id} matchId={i.id} eventId={null} compact whiteBackground smallMatchRow />
      ))}
      {!isFetching && hasNextPage && <InfiniteScrollObserver runOnObserve={fetchNextPage} />}
    </div>
  );
}
