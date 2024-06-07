'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import DecksFilters from '@/app/(navbar)/(protected)/your/decks/DecksFilters';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';
import { TbFilter, TbPlus } from 'react-icons/tb';

export default function DecksLeftNav() {
  return (
    <div className="p-4 w-[300px] border-r-1 flex flex-col gap-4">
      <Accordion defaultSelectedKeys={['1']} disableIndicatorAnimation>
        <AccordionItem
          indicator={<TbFilter size={20} />}
          key="1"
          aria-label="Filters for decks"
          title="Filter and sort"
        >
          <DecksFilters />
        </AccordionItem>
        <AccordionItem
          indicator={<TbPlus size={20} />}
          key="2"
          aria-label="Create deck"
          title="Create"
        >
          <DecksForm />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
