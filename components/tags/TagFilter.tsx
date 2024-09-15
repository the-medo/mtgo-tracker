'use client';

import { useCallback } from 'react';
import { TagType } from '@prisma/client';
import { useTags } from '@/app/api/tag/getTags';
import { Chip } from '@nextui-org/chip';
import { Spinner } from '@nextui-org/spinner';

type TagFilterProps = {
  type: TagType;
  values: number[];
  setValues: (values: number[]) => void;
};

export default function TagFilter({ type, values, setValues }: TagFilterProps) {
  const { data, isFetching } = useTags(type);

  const selectTag = useCallback(
    (id: number) => {
      if (values.includes(id)) {
        setValues(values.filter(v => v !== id));
      } else {
        setValues([...values, id]);
      }
    },
    [values, setValues],
  );

  return (
    <div className="flex gap-2 flex-wrap">
      {isFetching ? <Spinner /> : null}
      {!isFetching && (data ?? []).length === 0 ? (
        <p className="text-xs italic">No tags to choose from</p>
      ) : null}
      {(data ?? []).map((tag, index) => {
        const isSelected = values.find(v => v === tag.id);
        return (
          <Chip
            key={tag.id}
            size="sm"
            variant={isSelected ? 'bordered' : 'flat'}
            onClick={() => selectTag(tag.id)}
            className={isSelected ? 'cursor-pointer' : 'border-2 border-transparent cursor-pointer'}
          >
            {tag.name}
          </Chip>
        );
      })}
    </div>
  );
}
