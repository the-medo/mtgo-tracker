'use client';

import MatchGameCreationForm from '@/components/app/matches/MatchGameCreationForm';
import GameContent from '@/components/app/games/GameContent';
import cn from 'classnames';
import useStore from '@/store/store';

interface MatchGameSectionProps {
  matchId: number;
  gameNumber?: number;
  gameId?: number;
}

export default function MatchGameSection({ matchId, gameNumber, gameId }: MatchGameSectionProps) {
  return (
    <div
      className={cn(
        gameId ? 'bg-zinc-100' : 'bg-white border-2 border-dashed',
        ` p-2 md:p-4 flex flex-col gap-2 w-full md:w-[280px]`,
      )}
    >
      {!gameId ? (
        <MatchGameCreationForm matchId={matchId} gameNumber={gameNumber} />
      ) : (
        <GameContent matchId={matchId} gameId={gameId} />
      )}
    </div>
  );
}
