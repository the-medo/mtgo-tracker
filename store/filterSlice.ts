import { OrderByInput } from '@/types/api-params';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { EventType, MatchType } from '@prisma/client';

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
    rounds?: number;
    entry?: number;
    winnings?: number;
    date?: DateOrRangeValue;
    tagIds?: number[];
    orderBy?: OrderByInput<'Event'>;
  };
  matches: {
    oppName?: string;
    type?: MatchType;
    round?: number;
    eventId?: number;
    deckId?: number;
    isWin?: boolean;
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
