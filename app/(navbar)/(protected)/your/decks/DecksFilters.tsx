'use client';

import Title from '@/components/typography/Title';
import { Input } from '@nextui-org/input';
import SelectFormat from '@/components/form/select/SelectFormat';
import SelectDeckArchetype from '@/components/form/select/SelectDeckArchetype';
import { useCallback, useState } from 'react';
import { parseNumber } from '@/app/api/parsers';
import { DatePicker } from '@nextui-org/react';

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
      {formatId && <SelectDeckArchetype formatId={formatId} onChange={onDeckArchetypeChange} />}
      <DatePicker size="sm" label="Last changed" />
    </div>
  );
}
