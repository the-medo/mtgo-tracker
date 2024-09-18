import { OrderByInput } from '@/types/api-params';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { EventType, MatchResult, MatchType, Prisma } from '@prisma/client';
import IntFilter = Prisma.IntFilter;

export type FilterState = {
  decks: {
    deckName?: string;
    formatId?: number;
    deckArchetypeId?: number;
    lastPlayedAt?: DateOrRangeValue;
    createdAt?: DateOrRangeValue;
    tagIds?: number[];
    orderBy?: OrderByInput<'Deck'>;
  };
  events: {
    eventName?: string;
    type?: EventType;
    formatId?: number;
    deckId?: number;
    rounds?: IntFilter;
    entry?: IntFilter;
    winnings?: IntFilter;
    date?: DateOrRangeValue;
    tagIds?: number[];
    deckTagIds?: number[];
    orderBy?: OrderByInput<'Event'>;
  };
  matches: {
    oppName?: string;
    matchType?: MatchType;
    deckId?: number;
    deckName?: string;
    result?: MatchResult | null;
    startTime?: DateOrRangeValue;
    public?: boolean;
    tagIds?: number[];
    orderBy?: OrderByInput<'Match'>;
  };
};

type FilterType = keyof FilterState;

export type FilterActions = {
  clearFilter: (filterType: FilterType) => void;
  setFilter: <T extends FilterType, U extends keyof FilterState[T]>(
    filterType: T,
    key: U,
    value: FilterState[T][U],
  ) => void;
};

export type FilterSlice = FilterState & FilterActions;

export const createFilterSlice: StateCreator<AllSlices, [], [], FilterSlice> = set => ({
  decks: { filter: {} },
  events: { filter: {} },
  matches: { filter: {} },
  clearFilter: filterType => {
    set(state => ({
      ...state,
      [filterType]: {},
    }));
  },
  setFilter: (filterType, key, value) => {
    set(state => ({
      ...state,
      [filterType]: {
        ...state[filterType],
        [key]: value,
      },
    }));
  },
});
