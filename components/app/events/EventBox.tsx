'use client';

import { useEvent } from '@/app/api/event/[id]/getEvent';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import EventBoxStart from '@/components/app/events/EventBoxStart';
import cn from 'classnames';
import TableField from '@/components/form/table-form/TableField';
import { QK } from '@/app/api/queryHelpers';
import { TbArrowDown, TbArrowRight, TbCards, TbEdit, TbTower, TbX } from 'react-icons/tb';
import useStore from '@/store/store';
import { eventTypes } from '@/components/form/select/SelectEventType';
import { Link } from '@nextui-org/link';
import MatchBox from '@/components/app/matches/MatchBox';

export const eventBoxIdentificator = `EventBox`;

interface EventBoxProps {
  eventId: number;
  openMatches?: boolean;
  compact?: boolean;
  whiteBackground?: boolean;
}

export default function EventBox({
  eventId,
  openMatches = false,
  compact = false,
  whiteBackground = false,
}: EventBoxProps) {
  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const [eventEditMode, setEventEditMode] = useState(false);
  const [displayMatches, setDisplayMatches] = useState(false);

  const setSelectedId = useStore(state => state.setSelectedId);
  const unsetSelectedId = useStore(state => state.unsetSelectedId);

  useEffect(() => {
    setDisplayMatches(openMatches);
  }, [openMatches]);

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
  const eventTags = useMemo(() => event?.EventTags ?? [], [event?.EventTags]);

  return (
    <div className={`flex flex-row w-full`}>
      <EventBoxStart eventId={eventId} itemsCenter={true}>
        <Button radius="full" isIconOnly={true} onClick={displayMatchesToggle}>
          {displayMatches ? <TbArrowDown /> : <TbArrowRight />}
        </Button>
      </EventBoxStart>
      <div
        className={cn(`flex flex-col w-full gap-2`, {
          'bg-default-50 border-default-200 border-1': eventEditMode,
          'bg-default-100': !eventEditMode && !whiteBackground,
          'bg-white': whiteBackground,
          'rounded-tr-md rounded-br-md': compact,
        })}
      >
        <div className={cn(`p-4 flex flex-row flex-wrap w-full gap-2 justify-between`)}>
          <div className="flex flex-row flex-wrap gap-2 items-center">
            {eventEditMode ? (
              <>
                <TableField
                  qk={QK.EVENT}
                  type="string"
                  tableId={eventBoxIdentificator}
                  id={eventId}
                  fieldName="name"
                  label="Event name"
                  // @ts-ignore
                  value={event?.name}
                />
                <TableField
                  qk={QK.EVENT}
                  type="select"
                  selectType="EVENT_TYPE"
                  tableId={eventBoxIdentificator}
                  id={eventId}
                  fieldName="type"
                  label="Event type"
                  // @ts-ignore
                  value={event?.type}
                />
                <TableField
                  qk={QK.EVENT}
                  type="select"
                  selectType={QK.FORMATS}
                  tableId={eventBoxIdentificator}
                  id={eventId}
                  fieldName="formatId"
                  label="Format"
                  // @ts-ignore
                  value={event?.formatId}
                />
                <TableField
                  qk={QK.EVENT}
                  type="select"
                  selectType={QK.DECK}
                  tableId={eventBoxIdentificator}
                  id={eventId}
                  fieldName="deckId"
                  label="Deck"
                  // @ts-ignore
                  value={event?.deckId}
                  formatId={event?.formatId}
                  preselectedItem={event?.deck ?? undefined}
                />
              </>
            ) : (
              <div className="flex flex-col gap-1 min-w-[calc(220px-theme(spacing.24))]">
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
            )}
          </div>

          <div className="flex flex-row flex-wrap gap-4 items-center">
            {eventTags.length > 0 || eventEditMode ? (
              <div className="flex flex-row items-center min-w-[150px]">
                <TableField
                  qk={QK.EVENT}
                  type="tags"
                  tableId={eventBoxIdentificator}
                  id={eventId}
                  fieldName="tags"
                  label="Tags"
                  displaySelect={false}
                  // @ts-ignore
                  values={eventTags}
                  editable={false}
                />
              </div>
            ) : null}
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
          </div>
        </div>
        {displayMatches && (
          <div className={`flex flex-col gap-2 p-4`}>
            {event?.Matches.sort((m1, m2) => (m1.round ?? 0) - (m2.round ?? 0)).map(i => (
              <MatchBox
                key={i.id}
                matchId={i.id}
                eventId={eventId}
                compact
                whiteBackground={!whiteBackground}
                insideAnotherBox
              />
            ))}
          </div>
        )}
      </div>
      {!compact && (
        <div
          className={cn(
            'p-2 rounded-tr-md rounded-br-md flex flex-col w-12 h-full bg-default-200 items-center grow-0 shrink-0',
          )}
        >
          <Button size="sm" color="default" isIconOnly onPress={editModeHandler}>
            {eventEditMode ? <TbX /> : <TbEdit />}
          </Button>
        </div>
      )}
    </div>
  );
}
