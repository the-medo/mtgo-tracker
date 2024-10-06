import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { Spinner } from '@nextui-org/spinner';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';
import { useCallback, useEffect, useMemo } from 'react';
import { useEvent } from '@/app/api/event/[id]/getEvent';
import { TbTrash } from 'react-icons/tb';
import ConfirmationModal from '@/components/app/ConfirmationModal';
import useSimpleDelete from '@/app/api/useSimpleDelete';
import { useRouter } from 'next/navigation';

interface EventInfoProps {
  eventId: number;
  isAlwaysEditMode?: boolean;
  compact?: boolean;
}

export const eventInfoIdentificator = `EventInfo`;

export default function EventInfo({
  eventId,
  isAlwaysEditMode = false,
  compact = false,
}: EventInfoProps) {
  const router = useRouter();
  const { mutate: deleteEvent, isPending } = useSimpleDelete(QK.EVENT);
  const { data } = useEvent(eventId);
  const clearTableData = useStore(state => state.clearTableData);
  const isSelected = useStore(state => state.tables[eventInfoIdentificator]?.selectedIds[eventId]);
  const setSelectedId = useStore(state => state.setSelectedId);

  const setSelected = useCallback(() => {
    setSelectedId(eventInfoIdentificator, eventId);
  }, [setSelectedId, eventId]);

  useEffect(() => {
    if (isAlwaysEditMode && !isSelected) setSelected();
  }, [isAlwaysEditMode, isSelected, setSelected]);

  const onDeleteEvent = useCallback(() => {
    deleteEvent(
      { id: eventId },
      {
        onSuccess: () => {
          router.push('/your/events');
        },
      },
    );
  }, [deleteEvent, eventId, router]);

  const deleteButton = useMemo(
    () => (
      <Button size="sm" isIconOnly color="danger" isLoading={isPending}>
        <TbTrash />
      </Button>
    ),
    [isPending],
  );

  if (!data) {
    return (
      <div className="flex flex-col w-full">
        <Spinner color="default" label="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2 md:gap-4">
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
      {!compact ? (
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
      ) : null}
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
      {!compact ? (
        <>
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
              <div className="flex flex-row gap-2 w-full">
                <Button size="sm" onClick={setSelected} className="w-full">
                  Edit
                </Button>

                <ConfirmationModal
                  trigger={deleteButton}
                  title="Delete event"
                  content="All matches of this event will be unassigned."
                  onConfirm={onDeleteEvent}
                  confirmLoading={isPending}
                />
              </div>
            ))}
        </>
      ) : null}
    </div>
  );
}
