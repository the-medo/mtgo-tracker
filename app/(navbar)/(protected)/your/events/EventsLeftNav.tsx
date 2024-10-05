'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import EventsTags from '@/app/(navbar)/(protected)/your/events/EventsTags';
import EventsForm from '@/app/(navbar)/(protected)/your/events/EventsForm';
import EventsFilters from '@/app/(navbar)/(protected)/your/events/EventsFilters';
import { LeftMenuType } from '@/store/appSlice';
import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import FloatingFilterButton from '@/components/app/FloatingFilterButton';
import useStore from '@/store/store';

export default function EventsLeftNav() {
  const toggleIsMenuOpen = useStore(state => state.toggleIsMenuOpen);

  return (
    <>
      <NavMenuLeftClient type={LeftMenuType.SUBMENU}>
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
          <AccordionItem
            indicator={<TbTag size={20} />}
            key="2"
            aria-label="Tags"
            title="Event tags"
          >
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
      </NavMenuLeftClient>
      <FloatingFilterButton onPress={() => toggleIsMenuOpen(LeftMenuType.SUBMENU)} />
    </>
  );
}
