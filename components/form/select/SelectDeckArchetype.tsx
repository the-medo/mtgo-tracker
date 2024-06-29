import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { DeckArchetype } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import {
  GetDeckArchetypesRequest,
  useInfiniteDeckArchetypes,
} from '@/app/api/deck-archetype/getDeckArchetypes';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { parseNumber } from '@/app/api/parsers';
import { TbZeppelin } from 'react-icons/tb';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import debounce from 'lodash.debounce';

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

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbZeppelin size={20} />
    Deck archetype
  </div>
);

export default function SelectDeckArchetype({
  textOnly,
  isLoading,
  name,
  onChange,
  formatId,
  preselectedItem,
  value,
}: SelectDeckArchetypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [items, setItems] = useState<DeckArchetype[]>([]);
  const [selectedValue, setSelectedValue] = useState(preselectedItem);
  const debouncedSetFilter = useCallback(
    debounce(v => setDebouncedFilter(v), 250),
    [setDebouncedFilter],
  );

  const contains = useMemo(
    () =>
      selectedValue?.name === debouncedFilter || debouncedFilter === ''
        ? undefined
        : debouncedFilter,
    [debouncedFilter, selectedValue?.name],
  );

  const request: GetDeckArchetypesRequest = useMemo(
    () => ({
      where: {
        formatId: parseNumber(formatId),
        name:
          contains !== undefined
            ? {
                contains,
                mode: 'insensitive',
              }
            : undefined,
      },
    }),
    [formatId, contains],
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDeckArchetypes(
    request,
    formatId === undefined,
  );

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: fetchNextPage,
  });

  const onInputChangeHandler = useCallback(
    (filter: string) => {
      setFilter(filter);
      debouncedSetFilter(filter);
    },
    [debouncedSetFilter],
  );

  const onSelectionChangeHandler = useCallback(
    (x: Key | undefined) => {
      if (onChange) {
        let newValue = undefined;
        if (typeof x === 'string') newValue = parseInt(x);
        if (typeof x === 'number') newValue = x;
        onChange(newValue);
        const item = items.find(i => i.id === newValue);
        if (item) setSelectedValue(item);
      }
    },
    [onChange, items],
  );

  useEffect(() => {
    if (isFetching || isLoading) return;
    const baseItems = data?.pages?.flat() ?? [];
    if (!preselectedItem) return setItems(baseItems);
    if (baseItems.find(i => i.id === preselectedItem.id)) return setItems(baseItems);
    return setItems([preselectedItem, ...baseItems]);
  }, [data, isFetching, isLoading, preselectedItem]);

  useEffect(() => {
    const item = items.find(i => i.id === value);
    if (item) setSelectedValue(item);
  }, [value]);

  useEffect(() => {
    setSelectedValue(preselectedItem);
    setFilter(preselectedItem?.name ?? '');
  }, [preselectedItem]);

  const selectedKeys = selectedValue ? selectedValue.id.toString() : undefined;

  if (textOnly) {
    return textValueDeckArchetype(selectedValue);
  }

  return (
    <>
      <Autocomplete
        size="sm"
        label={label}
        className="max-w-xs"
        inputValue={filter}
        onInputChange={onInputChangeHandler}
        onSelectionChange={onSelectionChangeHandler}
        clearButtonProps={{
          onClick: () => {
            setFilter('');
            onSelectionChangeHandler(undefined);
          },
        }}
        name={name}
        scrollRef={scrollerRef}
        isLoading={isLoading || isFetching}
        // @ts-ignore
        selectedKeys={selectedKeys}
        defaultSelectedKeys={selectedKeys}
        items={items}
        onOpenChange={setIsOpen}
      >
        {item => <AutocompleteItem key={item.id}>{textValueDeckArchetype(item)}</AutocompleteItem>}
      </Autocomplete>
    </>
  );
}
