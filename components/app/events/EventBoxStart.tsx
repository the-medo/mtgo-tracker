'use client';

import { getBgColorBasedOnMatchResult } from '@/lib/helpers';
import cn from 'classnames';
import EventResultChip from '@/components/app/events/EventResultChip';
import { PropsWithChildren } from 'react';

interface EventBoxStartProps extends PropsWithChildren {
  eventId: number;
  itemsCenter?: boolean;
}

const baseClassNames =
  'p-4 pt-2 rounded-tl-md rounded-bl-md flex flex-col w-24 h-full gap-2 grow-0 shrink-0';

export default function EventBoxStart({ eventId, itemsCenter, children }: EventBoxStartProps) {
  const color = getBgColorBasedOnMatchResult(undefined);

  return (
    <div
      className={cn(baseClassNames, color, {
        'items-center': itemsCenter,
      })}
    >
      <EventResultChip eventId={eventId} />
      {children}
    </div>
  );
}
