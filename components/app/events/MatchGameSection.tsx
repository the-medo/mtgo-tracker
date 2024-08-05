'use client';

import MatchGameCreationForm from '@/components/app/events/MatchGameCreationForm';
import GameContent from '@/components/app/events/GameContent';

interface MatchGameSectionProps {
  matchId: number;
  gameNumber?: number;
  gameId?: number;
}

export default function MatchGameSection({ matchId, gameNumber, gameId }: MatchGameSectionProps) {
  return (
    <div
      className={`${gameId ? 'bg-zinc-100' : 'bg-white border-2 border-dashed'} p-4 flex flex-col gap-2`}
      style={{ width: '400px' }}
    >
      {!gameId ? (
        <MatchGameCreationForm matchId={matchId} gameNumber={gameNumber} />
      ) : (
        <GameContent matchId={matchId} gameId={gameId} />
      )}
    </div>
  );
}
