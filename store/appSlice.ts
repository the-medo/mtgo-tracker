import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { Breakpoint } from '@/lib/hooks/useBreakpoint';

export type AppState = {
  breakpoint: Breakpoint;
};

type AppStateType = keyof AppState;

export type AppActions = {
  setBreakpoint: (value: Breakpoint) => void;
};

export type AppSlice = AppState & AppActions;

export const createAppSlice: StateCreator<AllSlices, [], [], AppSlice> = set => ({
  breakpoint: 'md',
  setBreakpoint: (value: Breakpoint) => {
    set(state => ({
      ...state,
      breakpoint: value,
    }));
  },
});
