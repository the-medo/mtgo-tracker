import { useCallback, useMemo, useState } from 'react';
import { CalendarDate, DatePicker, DateRangePicker, RangeValue } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { parseDate, today } from '@internationalized/date';
import { TbX } from 'react-icons/tb';
import { Divider } from '@nextui-org/divider';

type DateOrRangeValue =
  | {
      type: 'date';
      value: string;
    }
  | {
      type: 'range';
      valueFrom: string;
      valueTo: string;
    };

type DateOrRangePickerProps = {
  label: string;
  value?: DateOrRangeValue;
};

const parseDateOrRangeValueToDateFrom = (s: DateOrRangeValue | undefined): CalendarDate | null => {
  if (!s) return null;
  switch (s.type) {
    case 'date':
      return parseDate(s.value);
    case 'range':
      return parseDate(s.valueFrom);
  }
};

const parseDateOrRangeValueToDateTo = (s: DateOrRangeValue | undefined): CalendarDate | null => {
  if (!s) return null;
  switch (s.type) {
    case 'date':
      return today('GMT');
    case 'range':
      return parseDate(s.valueTo);
  }
};

export default function DateOrRangePicker({ label, value }: DateOrRangePickerProps) {
  const [type, setType] = useState<DateOrRangeValue['type']>(value?.type || 'date');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [dateFrom, setDateFrom] = useState(parseDateOrRangeValueToDateFrom(value));
  const [dateTo, setDateTo] = useState(parseDateOrRangeValueToDateTo(value));

  const onDateChange = useCallback((e: CalendarDate) => {
    console.log('onDateChange', e);
    setDateFrom(e);
    setIsOpen(false);
  }, []);

  const onDateRangeChange = useCallback((e: RangeValue<CalendarDate>) => {
    console.log('onDateRangeChange', e);
    setDateFrom(e.start);
    setDateTo(e.end);
    setIsOpen(false);
  }, []);

  const onClear = useCallback(() => {
    setDateFrom(null);
    setDateTo(null);
    setIsOpen(false);
  }, []);

  const toggleType = useCallback(() => {
    setType(p => (p === 'date' ? 'range' : 'date'));
  }, []);

  const rangeValue: RangeValue<CalendarDate> | null =
    dateFrom && dateTo
      ? {
          start: dateFrom,
          end: dateTo,
        }
      : null;

  const onOpenChange = useCallback((e: boolean) => {
    console.log('onOpenChange', e);
    setIsOpen(e);
  }, []);

  const calendarBottomContent = useMemo(() => {
    return (
      <div className="flex flex-col w-[500px] p-4 gap-2 items-center">
        <Divider />
        <span className="text-xs">
          "Date from" always take time period from selected date till today.
        </span>
        <span className="text-xs">
          If you wish to change this behaviour, switch to "Date range" instead.
        </span>
        <div className="flex flex-row gap-4">
          <Button color="primary" size="sm" className="italic text-xs" onClick={toggleType}>
            {type === 'date' ? 'Switch to "Date range"' : 'Switch to "Date from"'}
          </Button>
          <Button size="sm" className="border-1 italic text-xs" onClick={onClear}>
            Clear
            <TbX size={12} />
          </Button>
        </div>
      </div>
    );
  }, [toggleType, type, onClear]);

  switch (type) {
    case 'date':
      return (
        <DatePicker<CalendarDate>
          key="DateOrRangePicker"
          size="sm"
          label={label}
          value={dateFrom}
          onChange={onDateChange}
          isOpen={isOpen}
          onOpenChange={onOpenChange} //looks like this doesn't work, hence the "selectorButtonProps.onClick" workaround for now
          selectorButtonProps={{
            onClick: () => {
              setIsOpen(true);
            },
          }}
          CalendarBottomContent={calendarBottomContent}
          visibleMonths={2}
        />
      );
    case 'range':
      return (
        <DateRangePicker
          key="DateOrRangePicker"
          label={label}
          onChange={onDateRangeChange}
          value={rangeValue}
          visibleMonths={2}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          CalendarBottomContent={calendarBottomContent}
        />
      );
  }
}
