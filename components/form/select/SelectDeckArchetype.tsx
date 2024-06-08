import { Select, SelectItem } from '@nextui-org/select';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { DeckArchetype, Format } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import { useInfiniteDeckArchetypes } from '@/app/api/deck-archetype/getDeckArchetypes';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { parseNumber } from '@/app/api/parsers';

export function textValueDeckArchetype(f: DeckArchetype | undefined): string {
  if (!f) return ` - no deck archetype - `;
  return f.name;
}

export type SelectDeckArchetypePropsOuter = {
  selectType: QK.DECK_ARCHETYPE;
  formatId?: number;
  preselectedItem?: DeckArchetype;
};

type SelectDeckArchetypeProps = BaseSelectProps & Omit<SelectDeckArchetypePropsOuter, 'selectType'>;

export default function SelectDeckArchetype({
  textOnly,
  isLoading,
  name,
  onChange,
  formatId,
  preselectedItem,
}: SelectDeckArchetypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(preselectedItem);
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDeckArchetypes(
    {
      where: { formatId: parseNumber(formatId) },
    },
    formatId === undefined,
  );

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: fetchNextPage,
  });

  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      console.log('onChangeHandler', e);
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange],
  );

  const items = useMemo(() => {
    const baseItems = data?.pages?.flat() ?? [];
    if (!preselectedItem) return baseItems;
    if (baseItems.find(i => i.id === preselectedItem.id)) return baseItems;
    return [preselectedItem, ...baseItems];
  }, [preselectedItem, data?.pages]);

  useEffect(() => {
    setSelectedValue(preselectedItem);
  }, [preselectedItem]);

  const selectedKeys = selectedValue ? [selectedValue.id.toString()] : undefined;

  if (textOnly) {
    console.log('textOnly', preselectedItem, selectedValue);
    return textValueDeckArchetype(selectedValue);
  }

  return (
    <>
      <Select
        size="sm"
        label="Deck archetype"
        selectionMode="single"
        className="max-w-xs"
        onChange={onChangeHandler}
        name={name}
        scrollRef={scrollerRef}
        isLoading={isLoading || isFetching}
        isDisabled={!data}
        // @ts-ignore
        selectedKeys={selectedKeys}
        defaultSelectedKeys={selectedKeys}
        items={items}
        onOpenChange={setIsOpen}
      >
        {item => <SelectItem key={item.id}>{textValueDeckArchetype(item)}</SelectItem>}
      </Select>
    </>
  );
}
