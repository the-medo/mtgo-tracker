'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';
import Title from '@/components/typography/Title';
import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import MatchContent from '@/components/app/events/MatchContent';

interface EventMatchSectionProps {
  eventId: number;
  eventRound?: number;
  matchId?: number;
}

export default function EventMatchSection({
  eventId,
  eventRound,
  matchId,
}: EventMatchSectionProps) {
  return (
    <div
      className={`${matchId ? 'bg-zinc-50' : 'bg-white border-2 border-dashed'} p-4 flex flex-col gap-2`}
    >
      {!matchId ? (
        <EventMatchCreationForm eventId={eventId} eventRound={eventRound} />
      ) : (
        <MatchContent matchId={matchId} eventId={eventId} />
      )}
    </div>
  );
}
