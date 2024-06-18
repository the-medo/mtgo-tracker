import { Select, SelectItem } from '@nextui-org/select';
import { EventType } from '@prisma/client';
import { BaseSelectProps } from '@/components/form/table-form/TableFieldSelect';
import useSelect from '@/components/form/select/useSelect';
import { useMemo } from 'react';
import { TbTrophy } from 'react-icons/tb';

type EventTypeOption = { id: EventType; label: string };

const eventTypes: EventTypeOption[] = [
  { id: EventType.LEAGUE, label: 'League' },
  { id: EventType.FRIENDLY_LEAGUE, label: 'Friendly League' },
  { id: EventType.CHALLENGE32, label: 'Challenge 32' },
  { id: EventType.CHALLENGE64, label: 'Challenge 64' },
  { id: EventType.PRELIMINARY, label: 'Preliminary' },
  { id: EventType.TWO_PLAYER_QUEUE, label: 'Two Player Queue' },
  { id: EventType.OPEN_PLAY, label: 'Open Play' },
  { id: EventType.RL_SMALL, label: '[In person] Small' },
  { id: EventType.RL_MEDIUM, label: '[In person] Medium' },
  { id: EventType.RL_BIG, label: '[In person] Big' },
  { id: EventType.OTHER, label: 'Other' },
];

const label = (
  <div className="flex flex-row gap-2 items-center">
    <TbTrophy size={20} />
    Event type
  </div>
);

export function textValueEventType(f: EventTypeOption | undefined): string {
  if (!f) return ` - no event type - `;
  return f.label;
}

export type SelectEventTypePropsOuter = {
  selectType: 'EVENT_TYPE';
};

type SelectEventTypeProps = BaseSelectProps & Omit<SelectEventTypePropsOuter, 'selectType'>;

export default function SelectEventType({
  textOnly,
  value,
  isLoading,
  name,
  onChange,
}: SelectEventTypeProps) {
  const { localValue, onChangeHandler, getSelection } = useSelect<EventTypeOption>({
    value,
    onChange,
  });

  const { selectedItem, selectedKeys } = useMemo(
    () => getSelection(eventTypes, localValue),
    [getSelection, localValue],
  );

  if (textOnly) {
    return textValueEventType(selectedItem);
  }

  return (
    <Select
      size="sm"
      label={label}
      selectionMode="single"
      className="max-w-xs"
      onChange={onChangeHandler}
      name={name}
      isLoading={isLoading}
      // @ts-ignore
      defaultSelectedKeys={selectedKeys}
      selectedKeys={selectedKeys}
    >
      {eventTypes.map(et => (
        <SelectItem key={et.id}>{et.label}</SelectItem>
      ))}
    </Select>
  );
}
