import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { Spinner } from '@nextui-org/spinner';
import LabelledValue from '@/components/typography/LabelledValue';
import DateDisplay from '@/components/typography/DateDisplay';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';
import { useCallback, useEffect } from 'react';
import { useEvent } from '@/app/api/event/[id]/getEvent';

interface DeckInfoProps {
  eventId: number;
  isAlwaysEditMode?: boolean;
}

export const eventInfoIdentificator = `EventInfo`;

export default function EventInfo({ eventId, isAlwaysEditMode = false }: DeckInfoProps) {
  const { data } = useEvent(eventId);
  const clearTableData = useStore(state => state.clearTableData);
  const isSelected = useStore(state => state.tables[eventInfoIdentificator]?.selectedIds[eventId]);
  const setSelectedId = useStore(state => state.setSelectedId);

  const setSelected = useCallback(() => {
    setSelectedId(eventInfoIdentificator, eventId);
  }, [setSelectedId, eventId]);

  useEffect(() => {
    if (isAlwaysEditMode && !isSelected) setSelected();
  }, [isAlwaysEditMode]);

  if (!data) {
    return (
      <div className="flex flex-col w-full">
        <Spinner color="default" label="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <TableField
        qk={QK.EVENT}
        type="string"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="name"
        label="Name"
        value={data.name ?? undefined}
        isMainTitle={true}
      />
      <TableField
        qk={QK.EVENT}
        selectType="EVENT_TYPE"
        type="select"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="eventTypeId"
        label="Event type"
        value={data.type ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        selectType={QK.FORMATS}
        type="select"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="formatId"
        label="Format"
        value={data.formatId ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        selectType={QK.FORMAT_VERSIONS}
        type="select"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="formatVersionId"
        label="Format version"
        value={data.formatVersionId ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        selectType={QK.DECK}
        type="select"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="deckId"
        label="Deck"
        value={data.deckId ?? undefined}
        formatId={data.formatId}
        isLabelledView={true}
        preselectedItem={data.deck ?? undefined}
      />
      <TableField
        qk={QK.EVENT}
        type="number"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="rounds"
        label="Rounds"
        value={data.rounds}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        type="number"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="entry"
        label="Entry"
        value={data.entry ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        type="number"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="winnings"
        label="Winnings"
        value={data.winnings ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.EVENT}
        type="tags"
        tableId={eventInfoIdentificator}
        id={data.id}
        fieldName="tags"
        label="Tags"
        displaySelect={false}
        // @ts-ignore
        values={data.EventTags}
      />
      {!isAlwaysEditMode &&
        (isSelected ? (
          <Button size="sm" onClick={() => clearTableData(eventInfoIdentificator)}>
            Close editing
          </Button>
        ) : (
          <Button size="sm" onClick={setSelected}>
            Edit
          </Button>
        ))}
    </div>
  );
}
