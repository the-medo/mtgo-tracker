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
import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { Tooltip } from '@nextui-org/tooltip';
import { Chip } from '@nextui-org/chip';
import { MatchResult } from '@prisma/client';
import { computeDeckResults } from '@/components/app/decks/deckLib';

export const deckBoxIdentificator = `DeckBox`;

interface DeckBoxProps {
  deckId: number;
}

export default function DeckBox({ deckId }: DeckBoxProps) {
  const { data: deck, isLoading: isLoadingEvent } = useDeck(deckId);
  const [deckEditMode, setDeckEditMode] = useState(false);
  const [displayEvents, setDisplayEvents] = useState(false);

  const setSelectedId = useStore(state => state.setSelectedId);
  const unsetSelectedId = useStore(state => state.unsetSelectedId);

  const editModeHandler = useCallback(() => {
    setDeckEditMode(p => {
      if (p) {
        unsetSelectedId(deckBoxIdentificator, deckId);
      } else {
        setSelectedId(deckBoxIdentificator, deckId);
      }
      return !p;
    });
  }, [deckId, setSelectedId, unsetSelectedId]);

  const displayEventsToggle = useCallback(() => setDisplayEvents(p => !p), [setDisplayEvents]);
  const deckTags = useMemo(() => deck?.DeckTags ?? [], [deck?.DeckTags]);

  const deckResults = useMemo(() => computeDeckResults(deck?.Matches), [deck?.Matches]);

  return (
    <div className={`flex flex-row w-full`}>
      <div
        className={cn(`flex flex-col w-full gap-2  rounded-tl-md rounded-bl-md`, {
          'bg-default-50 border-default-200 border-1': deckEditMode,
          'bg-default-100': !deckEditMode,
        })}
      >
        <div className={cn(`p-4 flex flex-row flex-wrap w-full gap-2 justify-between`)}>
          <div className="flex flex-row flex-wrap gap-2 items-center">
            {deckEditMode ? (
              <>
                <TableField
                  qk={QK.DECK}
                  type="string"
                  tableId={deckBoxIdentificator}
                  id={deckId}
                  fieldName="name"
                  label="Deck name"
                  // @ts-ignore
                  value={deck?.name}
                />
                <TableField
                  qk={QK.DECK}
                  type="select"
                  selectType={QK.FORMATS}
                  tableId={deckBoxIdentificator}
                  id={deckId}
                  fieldName="formatId"
                  label="Format"
                  value={deck?.formatId}
                />
                <TableField
                  qk={QK.DECK}
                  type="select"
                  selectType={QK.FORMAT_VERSIONS}
                  tableId={deckBoxIdentificator}
                  id={deckId}
                  fieldName="formatVersionId"
                  label="Format version"
                  value={deck?.formatVersionId}
                />
                <TableField
                  qk={QK.DECK}
                  type="select"
                  selectType={QK.DECK_ARCHETYPE}
                  tableId={deckBoxIdentificator}
                  id={deckId}
                  fieldName="deckArchetypeId"
                  label="Archetype"
                  // @ts-ignore
                  value={deck?.deckArchetypeId}
                />
              </>
            ) : (
              <div className="flex flex-col gap-1 min-w-[calc(300px-theme(spacing.24))]">
                <p className="text-md">
                  <Link href={`/your/decks/${deckId}`}>{deck?.name ?? '- empty deck name -'}</Link>
                </p>
                <div className="flex flex-row flex-wrap gap-2 items-center">
                  <p className="text-sm flex flex-row gap-2">
                    <TbCards size={16} />
                    {deck?.deckArchetype?.name}
                  </p>
                  <Tooltip
                    content={`${
                      deck?.formatVersion?.latestRelease ? deck.formatVersion.latestRelease : ''
                    }
                    ${deck?.formatVersion?.latestBans ? ' - ' + deck.formatVersion.latestBans : ''}`}
                  >
                    <p className="text-xs text-default-500 flex flex-row gap-2">
                      <TbTower size={16} />
                      {deck?.format?.name}
                    </p>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-row flex-wrap gap-4 items-center">
            {deckTags.length > 0 || deckEditMode ? (
              <div className="flex flex-row items-center w-[200px]">
                <TableField
                  qk={QK.DECK}
                  type="tags"
                  tableId={deckBoxIdentificator}
                  id={deckId}
                  fieldName="tags"
                  label="Tags"
                  displaySelect={false}
                  // @ts-ignore
                  values={deckTags}
                  editable={false}
                />
              </div>
            ) : null}
          </div>
          <div className={`flex flex-row flex-wrap gap-2`}>
            <div className="flex flex-col justify-between items-center text-sm rounded-md gap-1 px-2">
              <span>Events</span>
              <Chip size="sm" radius="sm" variant="solid" color="default">
                {deck?._count.Events}
              </Chip>
            </div>
            <div className="flex flex-col justify-between items-center text-sm rounded-md gap-1 px-2">
              <span>Matches</span>
              <Chip size="sm" radius="sm" variant="solid" color="default">
                {deckResults.matches[MatchResult.WIN]}-{deckResults.matches[MatchResult.LOSE]}
                {deckResults.matches[MatchResult.DRAW]
                  ? `-${deckResults.matches[MatchResult.DRAW]}`
                  : ''}
              </Chip>
            </div>
            <div className="flex flex-col justify-between items-center text-sm rounded-md gap-1 px-2">
              <span>Games</span>
              <Chip size="sm" radius="sm" variant="solid" color="default">
                {deckResults.games[MatchResult.WIN]}-{deckResults.games[MatchResult.LOSE]}
                {deckResults.games[MatchResult.DRAW]
                  ? `-${deckResults.games[MatchResult.DRAW]}`
                  : ''}
              </Chip>
            </div>
          </div>
        </div>
        {displayEvents && (
          <div className={`flex flex-col gap-2 p-4`}>
            {/*{event?.Matches.sort((m1, m2) => (m1.round ?? 0) - (m2.round ?? 0)).map(i => (
              <MatchBox
                key={i.id}
                matchId={i.id}
                eventId={deckId}
                compact
                whiteBackground
                insideAnotherBox
              />
            ))}*/}
          </div>
        )}
      </div>
      <div
        className={cn(
          'p-2 rounded-tr-md rounded-br-md flex flex-col w-12 h-full bg-default-200 items-center grow-0 shrink-0',
        )}
      >
        <Button size="sm" color="default" isIconOnly onPress={editModeHandler}>
          {deckEditMode ? <TbX /> : <TbEdit />}
        </Button>
      </div>
    </div>
  );
}
