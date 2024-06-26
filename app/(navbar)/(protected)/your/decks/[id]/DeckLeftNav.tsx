'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';

import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import { useDeck } from '@/app/api/deck/[id]/getDeck';

interface DeckLeftNavProps {
  deckId: number;
}

export default function DeckLeftNav({ deckId }: DeckLeftNavProps) {
  const { data } = useDeck(deckId);

  return (
    <div className="p-4 w-[330px] border-r-1 flex flex-col gap-4">
      {JSON.stringify(data)}
      <Accordion
        defaultSelectedKeys={['1']}
        disableIndicatorAnimation
        keepContentMounted
        disallowEmptySelection
      >
        <AccordionItem
          indicator={<TbFilter size={20} />}
          key="1"
          aria-label="Filters for decks"
          title="Filter and sort"
        ></AccordionItem>
      </Accordion>
    </div>
  );
}
