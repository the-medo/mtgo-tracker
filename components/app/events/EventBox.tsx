'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import EventBoxStart from '@/components/app/events/EventBoxStart';
import cn from 'classnames';
import TableField from '@/components/form/table-form/TableField';
import { QK } from '@/app/api/queryHelpers';
import { TbArrowDown, TbArrowRight, TbCards, TbEdit, TbTower, TbX } from 'react-icons/tb';
import useStore from '@/store/store';
import { eventTypes } from '@/components/form/select/SelectEventType';
import { Link } from '@nextui-org/link';
import MatchContent from '@/components/app/matches/MatchContent';

export const eventBoxIdentificator = `EventBox`;

interface EventBoxProps {
  eventId: number;
}

export default function EventBox({ eventId }: EventBoxProps) {
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const [eventEditMode, setEventEditMode] = useState(false);
  const [displayMatches, setDisplayMatches] = useState(false);

  const setSelectedId = useStore(state => state.setSelectedId);
  const unsetSelectedId = useStore(state => state.unsetSelectedId);

  const editModeHandler = useCallback(() => {
    setEventEditMode(p => {
      if (p) {
        unsetSelectedId(eventBoxIdentificator, eventId);
      } else {
        setSelectedId(eventBoxIdentificator, eventId);
      }
      return !p;
    });
  }, [eventId, setSelectedId, unsetSelectedId]);

  const displayMatchesToggle = useCallback(() => setDisplayMatches(p => !p), [setDisplayMatches]);

  return (
    <div className={`flex flex-row w-full`}>
      <EventBoxStart eventId={eventId} itemsCenter={true}>
        <Button radius="full" isIconOnly={true} onClick={displayMatchesToggle}>
          {displayMatches ? <TbArrowDown /> : <TbArrowRight />}
        </Button>
      </EventBoxStart>
      <div
        className={cn(`flex flex-col w-full gap-2 rounded-tr-md rounded-br-md `, {
          'bg-default-50 border-default-200 border-1': eventEditMode,
          'bg-default-100': !eventEditMode,
        })}
      >
        <div className={cn(`p-4 flex flex-row w-full gap-2 justify-between`)}>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-col gap-1 w-[300px]">
              <p className="text-md">
                <Link href={`/your/events/${eventId}`}>
                  {event?.name ?? '- empty event name -'}
                </Link>
              </p>
              <p className="text-sm flex flex-row gap-2">
                <TbCards size={16} />
                {event?.deck?.name}
              </p>
              <p className="text-xs text-default-500 flex flex-row gap-2">
                <TbTower size={16} />
                {event?.format?.name}
                {event?.type ? ' - ' + eventTypes.find(et => et.id === event.type)?.label : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center w-[400px]">
            <div className="flex flex-row items-center w-[200px]">
              <TableField
                qk={QK.EVENT}
                type="tags"
                tableId={eventBoxIdentificator}
                id={eventId}
                fieldName="tags"
                label="Tags"
                displaySelect={false}
                // @ts-ignore
                values={event?.EventTags ?? []}
                editable={false}
              />
            </div>
            <div className="flex flex-row items-center w-[150px]">
              <TableField
                qk={QK.EVENT}
                type="date"
                tableId={eventBoxIdentificator}
                id={eventId}
                fieldName="date"
                label="Date"
                // @ts-ignore
                value={event?.date ? new Date(event.date) : undefined}
                editable={false}
              />
            </div>
            {/*<DateDisplay date={event?.date} />*/}
            <Button size="sm" color="default" isIconOnly onPress={editModeHandler}>
              {eventEditMode ? <TbX /> : <TbEdit />}
            </Button>
          </div>
        </div>
        {displayMatches && (
          <div className={`flex flex-col gap-2 p-4`}>
            {event?.Matches.sort((m1, m2) => (m1.round ?? 0) - (m2.round ?? 0)).map(i => (
              <MatchContent
                key={i.id}
                matchId={i.id}
                eventId={eventId}
                compact={true}
                whiteBackground={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
