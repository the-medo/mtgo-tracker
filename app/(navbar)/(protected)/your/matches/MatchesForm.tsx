'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { ChangeEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import SelectFormatVersion from '@/components/form/select/SelectFormatVersion';
import useSimplePost from '@/app/api/useSimplePost';
import { QK } from '@/app/api/queryHelpers';
import SelectFormat from '@/components/form/select/SelectFormat';
import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/app/api/format/getFormats';
import SelectMatchType from '@/components/form/select/SelectMatchType';
import { matchTypeInfo } from '@/app/(navbar)/(protected)/your/matches/matchesLib';
import { Deck, MatchType } from '@prisma/client';
import { DatePicker } from '@nextui-org/date-picker';
import { fromDate } from '@internationalized/date';
import BooleanField from '@/components/form/table-form/BooleanField';
import SelectEvent from '@/components/form/select/SelectEvent';
import { EventExtended } from '@/app/api/event/route';
import SelectDeck from '@/components/form/select/SelectDeck';

export default function MatchesForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.MATCH);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<string>();
  const [eventId, setEventId] = useState<number>();
  const [formatId, setFormatId] = useState<number>();

  const [round, setRound] = useState<number>(0);
  const [oppName, setOppName] = useState<string>();
  const [oppUserId, setOppUserId] = useState<string>();
  const [deckId, setDeckId] = useState<number>();
  const [preselectedDeck, setPreselectedDeck] = useState<Deck>();
  const [isWin, setIsWin] = useState<boolean>(false);
  const [publicMatch, setPublicMatch] = useState<boolean>(true);

  const { isPending, data: formats } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const createMatch = useCallback(
    async (formData: FormData) => {
      const eventId = formData.get('eventId') as string | undefined;
      const formatId = formData.get('formatId') as string | undefined;
      const formatVersionId = formData.get('formatVersionId') as string | undefined;

      const data = {
        round: formData.get('round') ? parseInt(formData.get('round') as string) : undefined,
        oppName: formData.get('oppName'),
        deckId: formData.get('deckId') ? parseInt(formData.get('deckId') as string) : undefined,
        isWin: formData.get('isWin') === 'true',
        public: formData.get('public') === 'true',
        eventId: eventId ? parseInt(eventId) : undefined,
        formatId: formatId ? parseInt(formatId) : undefined,
        formatVersionId: formatVersionId ? parseInt(formatVersionId) : undefined,
      };

      setRound(0);
      setOppName('');
      setOppUserId('');
      setDeckId(0);
      setIsWin(false);
      setPublicMatch(true);
      setEventId(undefined);
      setFormatId(undefined);
      setSelectedFormatVersion(undefined);
      mutate(data);
    },
    [mutate],
  );

  const onEventChange = useCallback(
    (event: EventExtended | undefined) => {
      console.log('onEventChange', event);
      if (event) {
        setEventId(event.id);
        if (event?.deck) {
          setDeckId(event.deck.id);
          setPreselectedDeck(event.deck);
        }

        const newFormat = formats?.find(f => f.id === event.formatId);
        if (newFormat) {
          setFormatId(newFormat.id);
          setSelectedFormatVersion(newFormat.latestFormatVersionId?.toString());
        }
      } else {
        setEventId(undefined);
      }
    },
    [formats],
  );

  const onFormatChange = useCallback(
    (id: string | number | undefined) => {
      const newFormat = formats?.find(f => f.id.toString() === id);
      if (newFormat) {
        setFormatId(newFormat.id);
        setSelectedFormatVersion(newFormat.latestFormatVersionId?.toString());
      }
    },
    [formats],
  );

  const onMatchTypeChange = useCallback((matchType: string | number | undefined) => {
    const mt = matchType as MatchType;
    const matchInfo = matchTypeInfo[mt];
    if (matchInfo) {
    }
  }, []);

  const onRoundChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setRound(parseInt(e.target.value)),
    [],
  );

  const onOppNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setOppName(e.target.value),
    [],
  );

  const onDeckChange = useCallback((id: string | number | undefined) => {
    setDeckId(typeof id === 'string' ? parseInt(id) : id);
    setPreselectedDeck(undefined);
  }, []);

  const defaultDate = useMemo(() => fromDate(new Date(), 'GMT'), []);

  return (
    <form ref={ref} action={createMatch} className="flex flex-col gap-2">
      <SelectEvent name="eventId" value={eventId} onEventChange={onEventChange} />
      <SelectDeck
        name="deckId"
        value={deckId}
        onChange={onDeckChange}
        preselectedItem={preselectedDeck}
      />
      <SelectFormat name="formatId" value={formatId} onChange={onFormatChange} />
      <SelectFormatVersion
        name="formatVersionId"
        value={selectedFormatVersion}
        description='Automatically changes to "latest" after format change'
      />
      <SelectMatchType name="matchType" onChange={onMatchTypeChange} value={MatchType.BO3} />
      <Input
        type="number"
        label="Round in event"
        size="sm"
        name="round"
        value={round.toString()}
        onChange={onRoundChange}
      />
      <Input
        type="text"
        label="Opponent name"
        size="sm"
        name="oppName"
        value={oppName}
        onChange={onOppNameChange}
      />
      <BooleanField label="WIN" name="isWin" />
      <DatePicker
        label="Date"
        size="sm"
        name="startTime"
        defaultValue={defaultDate}
        granularity="day"
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
