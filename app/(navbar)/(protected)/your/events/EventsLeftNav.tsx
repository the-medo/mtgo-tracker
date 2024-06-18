'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import DecksFilters from '@/app/(navbar)/(protected)/your/decks/DecksFilters';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import DecksTags from '@/app/(navbar)/(protected)/your/decks/DecksTags';
import EventsTags from '@/app/(navbar)/(protected)/your/events/EventsTags';
import EventsForm from '@/app/(navbar)/(protected)/your/events/EventsForm';

export default function EventsLeftNav() {
  return (
    <div className="p-4 w-[330px] border-r-1 flex flex-col gap-4">
      <Accordion
        defaultSelectedKeys={['1']}
        disableIndicatorAnimation
        keepContentMounted
        disallowEmptySelection
      >
        <AccordionItem
          indicator={<TbFilter size={20} />}
          key="1"
          aria-label="Filters for events"
          title="Filter and sort"
        >
          {/*<EventFilters />*/}
        </AccordionItem>
        <AccordionItem indicator={<TbTag size={20} />} key="2" aria-label="Tags" title="Event tags">
          <EventsTags />
        </AccordionItem>
        <AccordionItem
          indicator={<TbPlus size={20} />}
          key="3"
          aria-label="Create event"
          title="Create"
        >
          <EventsForm />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
