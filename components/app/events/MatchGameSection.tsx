'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';
import Title from '@/components/typography/Title';
import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchGameCreationForm from '@/components/app/events/MatchGameCreationForm';

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
        <>existing game</>
      )}
    </div>
  );
}
