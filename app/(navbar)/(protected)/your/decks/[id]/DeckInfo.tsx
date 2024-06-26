import { useDeck } from '@/app/api/deck/[id]/getDeck';
import { QK } from '@/app/api/queryHelpers';
import TableField from '@/components/form/table-form/TableField';
import { Spinner } from '@nextui-org/spinner';
import LabelledValue from '@/components/typography/LabelledValue';
import DateDisplay from '@/components/typography/DateDisplay';
import useStore from '@/store/store';
import { Button } from '@nextui-org/button';

interface DeckInfoProps {
  deckId: number;
}

export default function DeckInfo({ deckId }: DeckInfoProps) {
  const identificator = `DeckInfo`;
  const { data } = useDeck(deckId);
  const clearTableData = useStore(state => state.clearTableData);
  const isSelected = useStore(state => state.tables[identificator]?.selectedIds[deckId]);

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
        tableId={identificator}
        id={data.id}
        fieldName="name"
        label="Name"
        value={data.name ?? undefined}
        editable={true}
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
        tableId={identificator}
        id={data.id}
        fieldName="formatId"
        label="Format"
        value={data.formatId ?? undefined}
        editable={true}
        isLabelledView={true}
      />
      <TableField
        qk={QK.DECK}
        selectType={QK.FORMAT_VERSIONS}
        type="select"
        tableId={identificator}
        id={data.id}
        fieldName="formatVersionId"
        label="Format version"
        value={data.formatVersionId ?? undefined}
        editable={true}
        isLabelledView={true}
      />

      <TableField
        qk={QK.DECK}
        selectType={QK.DECK_ARCHETYPE}
        formatId={data.formatId}
        type="select"
        tableId={identificator}
        id={data.id}
        fieldName="deckArchetypeId"
        label="Archetype"
        preselectedItem={data.deckArchetype}
        editable={true}
        isLabelledView={true}
      />
      {isSelected && (
        <Button size="sm" onClick={() => clearTableData(identificator)}>
          Close editing
        </Button>
      )}
    </div>
  );
}
