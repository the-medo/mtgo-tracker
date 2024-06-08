'use client';

import Title from '@/components/typography/Title';
import { Input } from '@nextui-org/input';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';
import { useCallback, useState } from 'react';
import { parseNumber } from '@/app/api/parsers';
import DateOrRangePicker from '@/components/form/DateOrRangePicker';

export default function DecksFilters() {
  const [formatId, setFormatId] = useState<number>();
  const [deckArchetypeId, setDeckArchetypeId] = useState<number>();

  const onFormatChange = useCallback((id: string | number) => setFormatId(parseNumber(id)), []);
  const onDeckArchetypeChange = useCallback(
    (id: string | number) => setDeckArchetypeId(parseNumber(id)),
    [],
  );

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Input size="sm" label="Search..." />
      <SelectFormat onChange={onFormatChange} />
      <SelectDeckArchetype formatId={formatId} onChange={onDeckArchetypeChange} />
      <DateOrRangePicker label="Last played" />
      <DateOrRangePicker label="Created" />
    </div>
  );
}
