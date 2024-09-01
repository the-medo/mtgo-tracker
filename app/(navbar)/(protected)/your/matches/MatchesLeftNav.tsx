'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import MatchesFilters from '@/app/(navbar)/(protected)/your/matches/MatchesFilters';
import MatchesForm from '@/app/(navbar)/(protected)/your/matches/MatchesForm';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import MatchesTags from '@/app/(navbar)/(protected)/your/matches/MatchesTags';
import PageMenuWrapper from '@/components/app/PageMenuWrapper';

export default function MatchesLeftNav() {
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
          aria-label="Filters for matches"
          title="Filter and sort"
        >
          <MatchesFilters />
        </AccordionItem>
        <AccordionItem indicator={<TbTag size={20} />} key="2" aria-label="Tags" title="Match tags">
          <MatchesTags />
        </AccordionItem>
        <AccordionItem
          indicator={<TbPlus size={20} />}
          key="3"
          aria-label="Create match"
          title="Create"
        >
          <MatchesForm />
        </AccordionItem>
      </Accordion>
    </PageMenuWrapper>
  );
}
