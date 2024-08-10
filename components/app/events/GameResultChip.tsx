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

interface GameResultChipProps {
  result?: MatchResult | null;
  onClick?: () => void;
  startingHand?: number | null;
  oppStartingHand?: number | null;
  isOnPlay?: boolean | null;
}

export default function GameResultChip({
  result,
  onClick,
  startingHand,
  oppStartingHand,
  isOnPlay,
}: GameResultChipProps) {
  const chipColor = useMemo(() => getChipColorBasedOnMatchResult(result), [result]);

  return (
    <Chip
      className={onClick ? 'cursor-pointer' : 'cursor-default'}
      size="sm"
      variant="flat"
      color={chipColor}
      startContent={<TbCards size={24} />}
      onClick={onClick}
    >
      {startingHand ?? '-'}v{oppStartingHand ?? '-'}
      {isOnPlay ? ' (OTPlay)' : ''}
      {isOnPlay === false ? ' (OTDraw)' : ''}
    </Chip>
  );
}
