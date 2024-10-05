'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import DecksFilters from '@/app/(navbar)/(protected)/your/decks/DecksFilters';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import DecksTags from '@/app/(navbar)/(protected)/your/decks/DecksTags';
import { LeftMenuType } from '@/store/appSlice';
import NavMenuLeftClient from '@/components/nav/NavMenuLeft/NavMenuLeftClient';
import FloatingFilterButton from '@/components/app/FloatingFilterButton';
import useStore from '@/store/store';

export default function DecksLeftNav() {
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
            aria-label="Filters for decks"
            title="Filter and sort"
          >
            <DecksFilters />
          </AccordionItem>
          <AccordionItem
            indicator={<TbTag size={20} />}
            key="2"
            aria-label="Tags"
            title="Deck tags"
          >
            <DecksTags />
          </AccordionItem>
          <AccordionItem
            indicator={<TbPlus size={20} />}
            key="3"
            aria-label="Create deck"
            title="Create"
          >
            <DecksForm />
          </AccordionItem>
        </Accordion>
      </NavMenuLeftClient>
      <FloatingFilterButton onPress={() => toggleIsMenuOpen(LeftMenuType.SUBMENU)} />
    </>
  );
}
