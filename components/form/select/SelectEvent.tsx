import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { QK } from '@/app/api/queryHelpers';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { parseNumber } from '@/app/api/parsers';
import { TbCards } from 'react-icons/tb';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import debounce from 'lodash.debounce';
import { EventExtended } from '@/app/api/event/route';
import { GetEventsRequest, useInfiniteEvents } from '@/app/api/event/getEvents';

export function textValueEvent(f: EventExtended | undefined): string {
  if (!f) return ` - no event - `;
  return f.name ?? 'Unknown event';
}

export type SelectEventPropsOuter = {
  selectType: QK.EVENT;
  formatId?: number;
  isFormatIdMandatory?: boolean;
  preselectedItem?: EventExtended;
  onEventChange?: (e: EventExtended | undefined) => void;
};

type SelectEventProps = BaseSelectProps & Omit<SelectEventPropsOuter, 'selectType'>;

const getLabel = (chooseFormat: boolean) => (
  <div className="flex flex-row gap-2 items-center">
    <TbCards size={20} />
    Event {chooseFormat ? ` (choose format)` : null}
  </div>
);

export default function SelectEvent({
  textOnly,
  isLoading,
  name,
  onChange,
  formatId,
  isFormatIdMandatory = false,
  preselectedItem,
  onEventChange,
}: SelectEventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [items, setItems] = useState<EventExtended[]>([]);
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

  const request: GetEventsRequest = useMemo(
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

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteEvents(request);

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
      if (onChange || onEventChange) {
        let newValue = undefined;
        if (typeof x === 'string') newValue = parseInt(x);
        if (typeof x === 'number') newValue = x;
        const item = items.find(i => i.id === newValue);
        if (item) setSelectedValue(item);
        if (onChange) onChange(newValue);
        if (onEventChange) onEventChange(item);
      }
    },
    [onChange, onEventChange, items],
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
    return textValueEvent(selectedValue);
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
            onSelectionChangeHandler(undefined);
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
        {item => <AutocompleteItem key={item.id}>{textValueEvent(item)}</AutocompleteItem>}
      </Autocomplete>
    </>
  );
}
