'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import MatchesFilters from '@/app/(navbar)/(protected)/your/matches/MatchesFilters';
import MatchesForm from '@/app/(navbar)/(protected)/your/matches/MatchesForm';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import MatchesTags from '@/app/(navbar)/(protected)/your/matches/MatchesTags';

export default function MatchesLeftNav() {
  return (
    <div className="p-4 w-[330px] border-r-1 flex flex-col gap-4">
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
    </div>
  );
}
