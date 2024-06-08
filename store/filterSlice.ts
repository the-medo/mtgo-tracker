import { SingleTableState, TableActions, TableSlice, TableState } from '@/store/tableSlice';
import { OrderByInput, WhereInput } from '@/types/api-params';
import { Deck } from '@prisma/client';
import { DateOrRangeValue } from '@/components/form/DateOrRangePicker';
import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';

export type FilterState = {
  decks: {
    deckName?: string;
    formatId?: number;
    deckArchetypeId?: number;
    lastPlayedAt?: DateOrRangeValue;
    createdAt?: DateOrRangeValue;
    order?: OrderByInput<Deck>;
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
