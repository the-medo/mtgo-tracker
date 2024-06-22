'use client';

import { Input } from '@nextui-org/input';
import { parseNumber } from '@/app/api/parsers';
import DateOrRangePicker from '@/components/form/DateOrRangePicker';
import { TbSearch } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import SelectSorter from '@/components/form/select/SelectSorter';
import useMatchFilters, {
  matchSorterOptions,
} from '@/app/(navbar)/(protected)/your/matches/useMatchFilters';
import SelectMatchType from '@/components/form/select/SelectMatchType';
import TagFilter from '@/components/tags/TagFilter';
import { TagType } from '@prisma/client';

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Opponent name...
  </div>
);

export default function MatchesFilters() {
  const {
    oppName,
    onOppNameChange,
    onTypeChange,
    onRoundChange,
    onEventChange,
    onDeckChange,
    onWinChange,
    onStartTimeChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    type,
    round,
    eventId,
    deckId,
    isWin,
    startTime,
    tagIds,
    orderBy,
  } = useMatchFilters();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <span className="pl-1 text-tiny text-foreground-500">FILTERS</span>
      <Input size="sm" label={label} value={oppName ?? ''} onChange={onOppNameChange} />
      <SelectMatchType value={type} onChange={onTypeChange} />
      <Input
        type="number"
        size="sm"
        label="Round"
        value={round?.toString() ?? ''}
        onChange={e => onRoundChange(parseNumber(e.target.value))}
      />
      <Input
        type="number"
        size="sm"
        label="Event"
        value={eventId?.toString() ?? ''}
        onChange={e => onEventChange(parseNumber(e.target.value))}
      />
      <Input
        type="number"
        size="sm"
        label="Deck"
        value={deckId?.toString() ?? ''}
        onChange={e => onDeckChange(parseNumber(e.target.value))}
      />
      <Input
        type="checkbox"
        size="sm"
        label="Win"
        checked={isWin ?? false}
        onChange={e => onWinChange(e.target.checked)}
      />
      <DateOrRangePicker label="Start Time" value={startTime} onChange={onStartTimeChange} />
      <span className="pl-1 text-tiny text-foreground-500">TAGS</span>
      <TagFilter type={TagType.MATCH} values={tagIds ?? []} setValues={onTagIdsChange} />
      <span className="pl-1 text-tiny text-foreground-500">SORT</span>
      <SelectSorter data={matchSorterOptions} value={orderBy} onChange={onOrderByChange} />
      <Button onClick={onClear} size="sm">
        Clear filters & sorting
      </Button>
    </div>
  );
}
