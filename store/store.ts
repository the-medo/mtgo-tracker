import { create } from 'zustand';
import { createTableSlice, TableSlice } from '@/store/tableSlice';
import { createFilterSlice, FilterSlice } from '@/store/filterSlice';
import { AppSlice, createAppSlice } from '@/store/appSlice';
import { createStatSlice, StatSlice } from '@/store/statSlice';

export type AllSlices = TableSlice & FilterSlice & AppSlice & StatSlice;

const useStore = create<AllSlices>()((...a) => ({
  ...createAppSlice(...a),
  ...createTableSlice(...a),
  ...createFilterSlice(...a),
  ...createStatSlice(...a),
}));

export default useStore;
