import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { Spinner } from '@nextui-org/spinner';
import LabelledValue from '@/components/typography/LabelledValue';
import DateDisplay from '@/components/typography/DateDisplay';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';
import { useCallback, useEffect, useMemo } from 'react';
import useSimpleDelete from '@/app/api/useSimpleDelete';
import { TbTrash } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/app/ConfirmationModal';

interface DeckInfoProps {
  deckId: number;
  isAlwaysEditMode?: boolean;
}

export const deckInfoIdentificator = `DeckInfo`;

export default function DeckInfo({ deckId, isAlwaysEditMode = false }: DeckInfoProps) {
  const router = useRouter();
  const { data } = useDeck(deckId);
  const { mutate: deleteDeck, isPending } = useSimpleDelete(QK.DECK);
  const clearTableData = useStore(state => state.clearTableData);
  const isSelected = useStore(state => state.tables[deckInfoIdentificator]?.selectedIds[deckId]);
  const setSelectedId = useStore(state => state.setSelectedId);

  const setSelected = useCallback(() => {
    setSelectedId(deckInfoIdentificator, deckId);
  }, [setSelectedId, deckId]);

  useEffect(() => {
    if (isAlwaysEditMode && !isSelected) setSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlwaysEditMode]);

  const onDeleteDeck = useCallback(() => {
    deleteDeck(
      { id: deckId },
      {
        onSuccess: () => {
          router.push('/your/decks');
        },
      },
    );
  }, [deleteDeck, deckId, router]);

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
    <div className="flex flex-col w-full gap-4">
      <TableField
        qk={QK.DECK}
        type="string"
        tableId={deckInfoIdentificator}
        id={data.id}
        fieldName="name"
        label="Name"
        value={data.name ?? undefined}
        isMainTitle={true}
      />
      <LabelledValue
        direction="horizontal"
        label="Created"
        value={<DateDisplay date={data.createdAt} />}
      />
      <LabelledValue
        direction="horizontal"
        label="Last played"
        value={<DateDisplay date={data.lastPlayedAt} />}
      />
      <TableField
        qk={QK.DECK}
        selectType={QK.FORMATS}
        type="select"
        tableId={deckInfoIdentificator}
        id={data.id}
        fieldName="formatId"
        label="Format"
        value={data.formatId ?? undefined}
        isLabelledView={true}
      />
      <TableField
        qk={QK.DECK}
        selectType={QK.FORMAT_VERSIONS}
        type="select"
        tableId={deckInfoIdentificator}
        id={data.id}
        fieldName="formatVersionId"
        label="Format version"
        value={data.formatVersionId ?? undefined}
        isLabelledView={true}
      />

      <TableField
        qk={QK.DECK}
        selectType={QK.DECK_ARCHETYPE}
        formatId={data.formatId}
        type="select"
        tableId={deckInfoIdentificator}
        id={data.id}
        fieldName="deckArchetypeId"
        label="Archetype"
        preselectedItem={data.deckArchetype}
        isLabelledView={true}
      />
      <TableField
        qk={QK.DECK}
        type="tags"
        tableId={deckInfoIdentificator}
        id={data.id}
        fieldName="tags"
        label="Tags"
        displaySelect={false}
        // @ts-ignore
        values={data.DeckTags}
      />
      {!isAlwaysEditMode &&
        (isSelected ? (
          <Button size="sm" onClick={() => clearTableData(deckInfoIdentificator)}>
            Close editing
          </Button>
        ) : (
          <div className="flex flex-row gap-2 w-full">
            <Button size="sm" onClick={setSelected}>
              Edit
            </Button>

            <ConfirmationModal
              trigger={deleteButton}
              title="Delete deck"
              content="All matches of this event will be deleted and deck will be unassigned from events."
              onConfirm={onDeleteDeck}
              confirmLoading={isPending}
            />
          </div>
        ))}
    </div>
  );
}
