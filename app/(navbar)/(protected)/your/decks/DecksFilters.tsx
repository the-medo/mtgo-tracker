'use client';

import { Input } from '@nextui-org/input';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';
import { ChangeEventHandler, useCallback } from 'react';
import { parseNumber } from '@/app/api/parsers';
import DateOrRangePicker, { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { TbSearch } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import useStore from '@/store/store';

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Deck name...
  </div>
);

export default function DecksFilters() {
  const deckName = useStore(state => state.decks.deckName);
  const formatId = useStore(state => state.decks.formatId);
  const deckArchetypeId = useStore(state => state.decks.deckArchetypeId);
  const lastPlayedAt = useStore(state => state.decks.lastPlayedAt);
  const createdAt = useStore(state => state.decks.createdAt);

  const clearFilter = useStore(state => state.clearFilter);
  const setFilter = useStore(state => state.setFilter);

  const onDeckNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setFilter('decks', 'deckName', e.target.value),
    [setFilter],
  );
  const onFormatChange = useCallback(
    (id: string | number) => setFilter('decks', 'formatId', parseNumber(id)),
    [setFilter],
  );
  const onDeckArchetypeChange = useCallback(
    (id: string | number) => setFilter('decks', 'deckArchetypeId', parseNumber(id)),
    [setFilter],
  );
  const onLastPlayedAtChange = useCallback(
    (v: DateOrRangeValue) => setFilter('decks', 'lastPlayedAt', v),
    [setFilter],
  );
  const onCreatedAtChange = useCallback(
    (v: DateOrRangeValue) => setFilter('decks', 'createdAt', v),
    [setFilter],
  );

  const onClear = useCallback(() => clearFilter('decks'), [clearFilter]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Input size="sm" label={label} value={deckName ?? ''} onChange={onDeckNameChange} />
      <SelectFormat value={formatId} onChange={onFormatChange} />
      <SelectDeckArchetype
        value={deckArchetypeId}
        formatId={formatId}
        onChange={onDeckArchetypeChange}
      />
      <DateOrRangePicker label="Last played" value={lastPlayedAt} onChange={onLastPlayedAtChange} />
      <DateOrRangePicker label="Created" value={createdAt} onChange={onCreatedAtChange} />
      <Button onClick={onClear} size="sm">
        Clear filters
      </Button>
    </div>
  );
}
