'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import EventsTags from '@/app/(navbar)/(protected)/your/events/EventsTags';
import EventsForm from '@/app/(navbar)/(protected)/your/events/EventsForm';
import EventsFilters from '@/app/(navbar)/(protected)/your/events/EventsFilters';
import PageMenuWrapper from '@/components/app/PageMenuWrapper';

export default function EventsLeftNav() {
  return (
    <PageMenuWrapper>
      <Accordion
        defaultSelectedKeys={['3']}
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
          <EventsFilters />
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
    </PageMenuWrapper>
  );
}
