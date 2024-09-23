import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDate, DatePicker, DateRangePicker, RangeValue } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { parseDate, today } from '@internationalized/date';
import { TbX } from 'react-icons/tb';
import { Divider } from '@nextui-org/divider';

export type DateOrRangeValue =
  | {
      type: 'date';
      value?: string;
    }
  | {
      type: 'range';
      valueFrom?: string;
      valueTo?: string;
    };

type DateOrRangePickerProps = {
  label: string;
  value?: DateOrRangeValue;
  onChange?: (v: DateOrRangeValue) => void;
};

const parseDateOrRangeValueToDateFrom = (s: DateOrRangeValue | undefined): CalendarDate | null => {
  if (!s) return null;
  switch (s.type) {
    case 'date':
      return s.value ? parseDate(s.value) : null;
    case 'range':
      return s.valueFrom ? parseDate(s.valueFrom) : null;
  }
};

const parseDateOrRangeValueToDateTo = (s: DateOrRangeValue | undefined): CalendarDate | null => {
  if (!s) return null;
  switch (s.type) {
    case 'date':
      return today('GMT');
    case 'range':
      return s.valueTo ? parseDate(s.valueTo) : null;
  }
};

export default function DateOrRangePicker({ label, value, onChange }: DateOrRangePickerProps) {
  const [type, setType] = useState<DateOrRangeValue['type']>(value?.type || 'date');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [dateFrom, setDateFrom] = useState(parseDateOrRangeValueToDateFrom(value));
  const [dateTo, setDateTo] = useState(parseDateOrRangeValueToDateTo(value));

  useEffect(() => {
    setType(value?.type || 'date');
    setDateFrom(parseDateOrRangeValueToDateFrom(value));
    setDateTo(parseDateOrRangeValueToDateTo(value));
  }, [value]);

  const onDateChange = useCallback(
    (e: CalendarDate) => {
      console.log('onDateChange', e, e.toString());
      setDateFrom(e);
      setIsOpen(false);
      if (onChange) {
        onChange({
          type: 'date',
          value: e.toString(),
        });
      }
    },
    [onChange],
  );

  const onDateRangeChange = useCallback(
    (e: RangeValue<CalendarDate>) => {
      console.log('onDateRangeChange', e, 'start', e.start.toString(), 'end', e.end.toString());
      setDateFrom(e.start);
      setDateTo(e.end);
      setIsOpen(false);

      if (onChange) {
        onChange({
          type: 'range',
          valueFrom: e.start.toString(),
          valueTo: e.end.toString(),
        });
      }
    },
    [onChange],
  );

  const onClear = useCallback(() => {
    setDateFrom(null);
    setDateTo(null);
    setIsOpen(false);

    if (onChange) {
      switch (type) {
        case 'date':
          onChange({
            type: 'date',
            value: undefined,
          });
          break;
        case 'range':
          onChange({
            type: 'range',
            valueFrom: undefined,
            valueTo: undefined,
          });
          break;
      }
    }
  }, [onChange, type]);

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
      <div className="flex flex-col max-w-[500px] p-4 gap-2 items-center">
        <Divider />
        <span className="text-xs">
          &quot;Date from&quot; always take time period from selected date till today.
        </span>
        <span className="text-xs">
          If you wish to change this behaviour, switch to &quot;Date range&quot; instead.
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
          label={`${label} (from)`}
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
          label={`${label} (range)`}
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
