'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';
import Title from '@/components/typography/Title';
import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { TbCards } from 'react-icons/tb';
import { Chip } from '@nextui-org/chip';
import { getChipColorBasedOnMatchResult } from '@/lib/helpers';
import { MatchResult } from '@prisma/client';
import { useGame } from '@/app/api/game/[id]/getGame';

interface GameResultChipProps {
  gameId: number;
  onClick?: () => void;
}

export default function GameResultChip({ gameId, onClick }: GameResultChipProps) {
  const { data: game, isLoading } = useGame(gameId);

  const chipColor = useMemo(() => getChipColorBasedOnMatchResult(game?.result), [game?.result]);

  return (
    <Chip
      className={onClick ? 'cursor-pointer' : 'cursor-default'}
      size="sm"
      variant="flat"
      color={chipColor}
      startContent={<TbCards size={24} />}
      onClick={onClick}
    >
      {game?.startingHand ?? '-'}v{game?.oppStartingHand ?? '-'}
      {game?.isOnPlay ? ' P' : ''}
      {game?.isOnPlay === false ? ' d' : ''}
    </Chip>
  );
}
