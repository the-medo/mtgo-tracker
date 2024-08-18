'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { Input } from '@nextui-org/input';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import useCreateMatch from '@/lib/hooks/useCreateMatch';
import Title from '@/components/typography/Title';
import EventMatchCreationForm from '@/components/app/events/EventMatchCreationForm';
import { useMatch } from '@/app/api/match/[id]/getMatch';
import { TbCards, TbEdit } from 'react-icons/tb';
import { Chip } from '@nextui-org/chip';
import { getChipColorBasedOnMatchResult } from '@/lib/helpers';
import { MatchResult } from '@prisma/client';
import { useGame } from '@/app/api/game/[id]/getGame';
import cn from 'classnames';

interface GameResultChipProps {
  gameId: number;
  onClick?: () => void;
  includeEditIcon?: boolean;
}

export default function GameResultChip({
  gameId,
  onClick,
  includeEditIcon = false,
}: GameResultChipProps) {
  const { data: game, isLoading } = useGame(gameId);

  const chipColor = useMemo(() => getChipColorBasedOnMatchResult(game?.result), [game?.result]);

  return (
    <Chip
      className={cn({
        'cursor-pointer': !!onClick,
        'cursor-default': !onClick,
      })}
      size="sm"
      variant="flat"
      color={chipColor}
      startContent={<TbCards size={24} />}
      endContent={includeEditIcon ? <TbEdit size={16} /> : undefined}
      onClick={onClick}
    >
      {game?.startingHand ?? '-'}v{game?.oppStartingHand ?? '-'}
      {game?.isOnPlay ? ' P' : ''}
      {game?.isOnPlay === false ? ' d' : ''}
    </Chip>
  );
}
