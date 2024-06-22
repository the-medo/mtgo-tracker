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
import { MatchType } from '@prisma/client';
import { DatePicker } from '@nextui-org/date-picker';
import { fromDate } from '@internationalized/date';

export default function MatchesForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate } = useSimplePost(QK.MATCH);
  const [selectedFormatVersion, setSelectedFormatVersion] = useState<string>();
  const [formatId, setFormatId] = useState<number>();

  const [round, setRound] = useState<number>(0);
  const [oppName, setOppName] = useState<string>();
  const [oppUserId, setOppUserId] = useState<string>();
  const [deckId, setDeckId] = useState<number>(0);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [publicMatch, setPublicMatch] = useState<boolean>(true);

  const { isPending, data: formats } = useQuery({
    queryKey: [QK.FORMATS],
    queryFn: getFormats,
  });

  const createMatch = useCallback(
    async (formData: FormData) => {
      const formatId = formData.get('formatId') as string | undefined;
      const formatVersionId = formData.get('formatVersionId') as string | undefined;

      const data = {
        round: formData.get('round') ? parseInt(formData.get('round') as string) : undefined,
        oppName: formData.get('oppName'),
        oppUserId: formData.get('oppUserId'),
        deckId: formData.get('deckId') ? parseInt(formData.get('deckId') as string) : undefined,
        isWin: formData.get('isWin') === 'true',
        public: formData.get('public') === 'true',
        formatId: formatId ? parseInt(formatId) : undefined,
        formatVersionId: formatVersionId ? parseInt(formatVersionId) : undefined,
      };

      setRound(0);
      setOppName('');
      setOppUserId('');
      setDeckId(0);
      setIsWin(false);
      setPublicMatch(true);
      setFormatId(undefined);
      setSelectedFormatVersion(undefined);
      mutate(data);
    },
    [mutate],
  );

  const onFormatChange = useCallback(
    (id: string | number) => {
      const newFormat = formats?.find(f => f.id.toString() === id);
      if (newFormat) {
        setFormatId(newFormat.id);
        setSelectedFormatVersion(newFormat.latestFormatVersionId?.toString());
      }
    },
    [formats],
  );

  const onMatchTypeChange = useCallback((matchType: string | number) => {
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

  const onOppUserIdChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setOppUserId(e.target.value),
    [],
  );

  const onDeckIdChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setDeckId(parseInt(e.target.value)),
    [],
  );

  const onIsWinChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setIsWin(e.target.checked),
    [],
  );

  const onPublicChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => setPublicMatch(e.target.checked),
    [],
  );

  const defaultDate = useMemo(() => fromDate(new Date(), 'GMT'), []);

  return (
    <form ref={ref} action={createMatch} className="flex flex-col gap-2">
      <SelectMatchType name="matchType" onChange={onMatchTypeChange} />
      <SelectFormat name="formatId" onChange={onFormatChange} />
      <SelectFormatVersion
        name="formatVersionId"
        value={selectedFormatVersion}
        description='Automatically changes to "latest" after format change'
      />
      <Input
        type="number"
        label="Round"
        size="sm"
        name="round"
        value={round.toString()}
        onChange={onRoundChange}
      />
      <Input
        type="text"
        label="Opponent"
        size="sm"
        name="oppName"
        value={oppName}
        onChange={onOppNameChange}
      />
      <Input
        type="text"
        label="Opponent User ID"
        size="sm"
        name="oppUserId"
        value={oppUserId}
        onChange={onOppUserIdChange}
      />
      <Input
        type="number"
        label="Deck ID"
        size="sm"
        name="deckId"
        value={deckId.toString()}
        onChange={onDeckIdChange}
      />
      <Input
        type="checkbox"
        label="Win"
        size="sm"
        name="isWin"
        checked={isWin}
        onChange={onIsWinChange}
      />
      <Input
        type="checkbox"
        label="Public"
        size="sm"
        name="public"
        checked={publicMatch}
        onChange={onPublicChange}
      />
      <DatePicker
        label="Start Time"
        size="sm"
        name="startTime"
        defaultValue={defaultDate}
        granularity="minute"
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
