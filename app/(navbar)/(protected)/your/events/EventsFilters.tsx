'use client';

import { Input } from '@nextui-org/input';
import { parseNumber } from '@/app/api/parsers';
import DateOrRangePicker from '@/components/form/DateOrRangePicker';
import { TbSearch } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import SelectSorter from '@/components/form/select/SelectSorter';
import useEventFilters, {
  eventSorterOptions,
} from '@/app/(navbar)/(protected)/your/events/useEventFilters';
import SelectEventType from '@/components/form/select/SelectEventType';
import TagFilter from '@/components/tags/TagFilter';
import { TagType } from '@prisma/client';
import SelectDeck from '@/components/form/select/SelectDeck';
import SelectFormat from '@/components/form/select/SelectFormat';
import NumberFilterInput from '@/components/form/table-form/NumberFilterInput';

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Event name...
  </div>
);

export default function EventsFilters() {
  const {
    eventName,
    onFormatIdChange,
    onDeckIdChange,
    onEventNameChange,
    onTypeChange,
    onRoundsChange,
    onEntryChange,
    onWinningsChange,
    onDateChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    formatId,
    deckId,
    type,
    rounds,
    entry,
    winnings,
    date,
    tagIds,
    orderBy,
  } = useEventFilters();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <span className="pl-1 text-tiny text-foreground-500">FILTERS</span>
      <Input size="sm" label={label} value={eventName ?? ''} onChange={onEventNameChange} />
      <SelectEventType value={type} onChange={onTypeChange} />
      <SelectFormat value={formatId} onChange={onFormatIdChange} />
      <SelectDeck value={deckId} onChange={onDeckIdChange} formatId={formatId} />
      <NumberFilterInput
        type="number"
        size="sm"
        label="Rounds"
        filterValue={rounds}
        onChangeFilter={onRoundsChange}
      />
      <NumberFilterInput
        type="number"
        size="sm"
        label="Entry"
        filterValue={entry}
        onChangeFilter={onEntryChange}
      />
      <NumberFilterInput
        type="number"
        size="sm"
        label="Winnings"
        filterValue={winnings}
        onChangeFilter={onWinningsChange}
      />
      <DateOrRangePicker label="Date" value={date} onChange={onDateChange} />
      <span className="pl-1 text-tiny text-foreground-500">TAGS</span>
      <TagFilter type={TagType.EVENT} values={tagIds ?? []} setValues={onTagIdsChange} />
      <span className="pl-1 text-tiny text-foreground-500">SORT</span>
      <SelectSorter data={eventSorterOptions} value={orderBy} onChange={onOrderByChange} />
      <Button onClick={onClear} size="sm">
        Clear filters & sorting
      </Button>
    </div>
  );
}
