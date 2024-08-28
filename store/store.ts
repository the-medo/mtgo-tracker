import { create } from 'zustand';
import { createTableSlice, TableSlice } from '@/store/tableSlice';
import { createFilterSlice, FilterSlice } from '@/store/filterSlice';
import { AppSlice, createAppSlice } from '@/store/appSlice';

export type AllSlices = TableSlice & FilterSlice & AppSlice;

const useStore = create<AllSlices>()((...a) => ({
  ...createAppSlice(...a),
  ...createTableSlice(...a),
  ...createFilterSlice(...a),
}));

export default useStore;
