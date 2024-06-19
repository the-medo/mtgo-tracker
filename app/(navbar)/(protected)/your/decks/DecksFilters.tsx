'use client';

import { Input } from '@nextui-org/input';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { parseNumber } from '@/app/api/parsers';
import DateOrRangePicker, { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { TbSearch } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import SelectSorter from '@/components/form/select/SelectSorter';
import useDeckFilters, {
  deckSorterOptions,
} from '@/app/(navbar)/(protected)/your/decks/useDeckFilters';
import TagFilter from '@/components/tags/TagFilter';
import { TagType } from '@prisma/client';

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Deck name...
  </div>
);

export default function DecksFilters() {
  const {
    deckName,
    onDeckNameChange,
    onFormatChange,
    onDeckArchetypeChange,
    onLastPlayedAtChange,
    onCreatedAtChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    formatId,
    lastPlayedAt,
    createdAt,
    deckArchetypeId,
    tagIds,
    orderBy,
  } = useDeckFilters();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <span className="pl-1 text-tiny text-foreground-500">FILTERS</span>
      <Input size="sm" label={label} value={deckName ?? ''} onChange={onDeckNameChange} />
      <SelectFormat value={formatId} onChange={onFormatChange} />
      <SelectDeckArchetype
        value={deckArchetypeId}
        formatId={formatId}
        onChange={onDeckArchetypeChange}
      />
      <DateOrRangePicker label="Last played" value={lastPlayedAt} onChange={onLastPlayedAtChange} />
      <DateOrRangePicker label="Created" value={createdAt} onChange={onCreatedAtChange} />
      <span className="pl-1 text-tiny text-foreground-500">TAGS</span>
      <TagFilter type={TagType.DECK} values={tagIds ?? []} setValues={onTagIdsChange} />
      <span className="pl-1 text-tiny text-foreground-500">SORT</span>
      <SelectSorter data={deckSorterOptions} value={orderBy} onChange={onOrderByChange} />
      <Button onClick={onClear} size="sm">
        Clear filters & sorting
      </Button>
    </div>
  );
}
