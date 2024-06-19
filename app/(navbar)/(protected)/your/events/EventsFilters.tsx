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

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Event name...
  </div>
);

export default function EventsFilters() {
  const {
    eventName,
    onEventNameChange,
    onTypeChange,
    onRoundsChange,
    onEntryChange,
    onWinningsChange,
    onDateChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
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
      <Input
        type="number"
        size="sm"
        label="Rounds"
        value={rounds?.toString() ?? ''}
        onChange={e => onRoundsChange(parseNumber(e.target.value))}
      />
      <Input
        type="number"
        size="sm"
        label="Entry"
        value={entry?.toString() ?? ''}
        onChange={e => onEntryChange(parseNumber(e.target.value))}
      />
      <Input
        type="number"
        size="sm"
        label="Winnings"
        value={winnings?.toString() ?? ''}
        onChange={e => onWinningsChange(parseNumber(e.target.value))}
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
