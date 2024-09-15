'use client';

import { Input } from '@nextui-org/input';
import DateOrRangePicker from '@/components/form/DateOrRangePicker';
import { TbCards, TbSearch } from 'react-icons/tb';
import { Button } from '@nextui-org/button';
import SelectSorter from '@/components/form/select/SelectSorter';
import useMatchFilters, {
  matchSorterOptions,
} from '@/app/(navbar)/(protected)/your/matches/useMatchFilters';
import SelectMatchType from '@/components/form/select/SelectMatchType';
import TagFilter from '@/components/tags/TagFilter';
import { TagType } from '@prisma/client';
import SelectDeck from '@/components/form/select/SelectDeck';
import { parseNumber } from '@/app/api/parsers';
import ResultSelector from '@/components/form/ResultSelector';

const labelOppName = (
  <div className="flex flex-row gap-2 items-center">
    <TbSearch size={20} />
    Opponent name...
  </div>
);
const labelDeckName = (
  <div className="flex flex-row gap-2 items-center">
    <TbCards size={20} />
    Deck name...
  </div>
);

export default function MatchesFilters() {
  const {
    oppName,
    onOppNameChange,
    onMatchTypeChange,
    onDeckIdChange,
    onDeckNameChange,
    onResultChange,
    onStartTimeChange,
    onTagIdsChange,
    onOrderByChange,
    onClear,
    matchType,
    deckId,
    deckName,
    result,
    startTime,
    tagIds,
    orderBy,
  } = useMatchFilters();

  return (
    <div className="flex flex-col gap-4 pb-4">
      <span className="pl-1 text-tiny text-foreground-500">FILTERS</span>
      <Input size="sm" label={labelOppName} value={oppName ?? ''} onChange={onOppNameChange} />
      <Input size="sm" label={labelDeckName} value={deckName ?? ''} onChange={onDeckNameChange} />

      <SelectDeck
        value={deckId}
        onChange={e => (typeof e === 'number' ? onDeckIdChange(e) : onDeckIdChange(parseNumber(e)))}
      />
      <DateOrRangePicker label="Start Time" value={startTime} onChange={onStartTimeChange} />
      <ResultSelector onValueChange={onResultChange} includeClearOption value={result} />
      <SelectMatchType value={matchType} onChange={onMatchTypeChange} />
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
