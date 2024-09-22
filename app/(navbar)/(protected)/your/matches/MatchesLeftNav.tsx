'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import MatchesFilters from '@/app/(navbar)/(protected)/your/matches/MatchesFilters';
import MatchesForm from '@/app/(navbar)/(protected)/your/matches/MatchesForm';
import { TbFilter, TbPlus, TbTag } from 'react-icons/tb';
import MatchesTags from '@/app/(navbar)/(protected)/your/matches/MatchesTags';
import PageMenuWrapper from '@/components/app/PageMenuWrapper';
import Notice from '@/components/app/Notice';

export default function MatchesLeftNav() {
  return (
    <PageMenuWrapper>
      <Accordion
        defaultSelectedKeys={['1']}
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
          <Notice variant="warning">
            <span>Creating matches is supported only from event detail.</span>
            <span>Recommended approach:</span>
            <ol className="list-decimal pl-4 text-xs">
              <li>Create deck</li>
              <li>Create event with the deck</li>
              <li>Create matches from the event</li>
            </ol>
          </Notice>
        </AccordionItem>
      </Accordion>
    </PageMenuWrapper>
  );
}
