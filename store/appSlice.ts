import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { Breakpoint } from '@/lib/hooks/useBreakpoint';

export type AppState = {
  breakpoint: Breakpoint;
  isMenuOpen: boolean;
  isStatModalOpen: boolean;
};

type AppStateType = keyof AppState;

export type AppActions = {
  setBreakpoint: (value: Breakpoint) => void;
  toggleIsMenuOpen: () => void;
  toggleIsStatModalOpen: () => void;
};

export type AppSlice = AppState & AppActions;

export const createAppSlice: StateCreator<AllSlices, [], [], AppSlice> = set => ({
  breakpoint: 'md',
  isMenuOpen: false,
  isStatModalOpen: false,
  setBreakpoint: (value: Breakpoint) => {
    set(state => ({
      ...state,
      breakpoint: value,
    }));
  },
  toggleIsMenuOpen: () => {
    set(state => ({
      ...state,
      isMenuOpen: !state.isMenuOpen,
    }));
  },
  toggleIsStatModalOpen: () => {
    set(state => ({
      ...state,
      isStatModalOpen: !state.isStatModalOpen,
    }));
  },
});
