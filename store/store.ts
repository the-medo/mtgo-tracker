import { create } from 'zustand';

type SelectedIdMap = Record<number | string, boolean | undefined>;

export type TableState = {
  selectedIds: SelectedIdMap;
  clickedColumn?: string;
};

type State = {
  tables: Record<string, TableState | undefined>;
};

type Actions = {
  clearTableData: (tableId: string) => void;
  setSelectedId: (tableId: string, id: string | number) => void;
  toggleSelectedId: (tableId: string, id: string | number) => void;
  setClickedColumn: (tableId: string, value: string | undefined) => void;
};

const useStore = create<State & Actions>(set => ({
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
}));

export default useStore;
