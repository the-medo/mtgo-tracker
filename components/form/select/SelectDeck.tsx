import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Deck } from '@prisma/client';
import { QK } from '@/app/api/queryHelpers';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { parseNumber } from '@/app/api/parsers';
import { TbCards } from 'react-icons/tb';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import debounce from 'lodash.debounce';
import { GetDecksRequest, useInfiniteDecks } from '@/app/api/deck/getDecks';

export function textValueDeck(f: Deck | undefined): string {
  if (!f) return ` - no deck - `;
  return f.name ?? 'Unknown deck';
}

export type SelectDeckPropsOuter = {
  selectType: QK.DECK;
  formatId?: number;
  isFormatIdMandatory?: boolean;
  preselectedItem?: Deck;
};

type SelectDeckProps = BaseSelectProps & Omit<SelectDeckPropsOuter, 'selectType'>;

const getLabel = (chooseFormat: boolean) => (
  <div className="flex flex-row gap-2 items-center">
    <TbCards size={20} />
    Deck {chooseFormat ? ` (choose format)` : null}
  </div>
);

export default function SelectDeck({
  textOnly,
  isLoading,
  name,
  onChange,
  formatId,
  isFormatIdMandatory = false,
  preselectedItem,
}: SelectDeckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [items, setItems] = useState<Deck[]>([]);
  const [selectedValue, setSelectedValue] = useState(preselectedItem);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const request: GetDecksRequest = useMemo(
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

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteDecks(request);

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
    (x: Key | null) => {
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
    setSelectedValue(preselectedItem);
    setFilter(preselectedItem?.name ?? '');
  }, [preselectedItem]);

  const selectedKeys = selectedValue ? [selectedValue.id.toString()] : undefined;
  const isDisabled = isFormatIdMandatory && !formatId;

  if (textOnly) {
    // console.log('textOnly', preselectedItem, selectedValue);
    return textValueDeck(selectedValue);
  }

  return (
    <>
      <Autocomplete
        size="sm"
        label={getLabel(isDisabled)}
        className="max-w-xs"
        inputValue={filter}
        onInputChange={onInputChangeHandler}
        onSelectionChange={onSelectionChangeHandler}
        clearButtonProps={{
          onClick: () => {
            setFilter('');
            onSelectionChangeHandler(null);
          },
        }}
        name={name}
        scrollRef={scrollerRef}
        isLoading={isLoading || isFetching}
        isDisabled={isDisabled}
        // @ts-ignore
        selectedKeys={selectedKeys}
        defaultSelectedKeys={selectedKeys}
        items={items}
        onOpenChange={setIsOpen}
      >
        {item => <AutocompleteItem key={item.id}>{textValueDeck(item)}</AutocompleteItem>}
      </Autocomplete>
    </>
  );
}
