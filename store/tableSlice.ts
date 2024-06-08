import { create, StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';

type SelectedIdMap = Record<number | string, boolean | undefined>;

export type SingleTableState = {
  selectedIds: SelectedIdMap;
  clickedColumn?: string;
};

export type TableState = {
  tables: Record<string, SingleTableState | undefined>;
};

export type TableActions = {
  clearTableData: (tableId: string) => void;
  setSelectedId: (tableId: string, id: string | number) => void;
  toggleSelectedId: (tableId: string, id: string | number) => void;
  setClickedColumn: (tableId: string, value: string | undefined) => void;
};

export type TableSlice = TableState & TableActions;

export const createTableSlice: StateCreator<AllSlices, [], [], TableSlice> = set => ({
  tables: {},
  clearTableData: (tableId: string) => {
    set(state => ({
      tables: {
        ...state.tables,
        [tableId]: {
          selectedIds: {},
          clickedColumn: undefined,
        },
      },
    }));
  },
  setSelectedId: (tableId: string, id: string | number) => {
    set(state => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          selectedIds: {
            ...state.tables[tableId]?.selectedIds,
            [id]: true,
          },
        },
      },
    }));
  },
  toggleSelectedId: (tableId: string, id: string | number) => {
    set(state => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          selectedIds: {
            ...state.tables[tableId]?.selectedIds,
            [id]: state.tables[tableId]?.selectedIds[id] ? undefined : true,
          },
        },
      },
    }));
  },
  setClickedColumn: (tableId: string, value: string | undefined) => {
    set(state => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          selectedIds: state.tables[tableId]?.selectedIds ?? {},
          clickedColumn: value,
        },
      },
    }));
  },
});
