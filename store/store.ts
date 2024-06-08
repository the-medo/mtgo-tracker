import { create } from 'zustand';
import { createTableSlice, TableSlice } from '@/store/tableSlice';
import { createFilterSlice, FilterSlice } from '@/store/filterSlice';

export type AllSlices = TableSlice & FilterSlice;

const useStore = create<AllSlices>()((...a) => ({
  ...createTableSlice(...a),
  ...createFilterSlice(...a),
}));

export default useStore;
