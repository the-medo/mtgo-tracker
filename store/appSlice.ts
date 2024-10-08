import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { Breakpoint, breakpoints, getBreakpoint } from '@/lib/breakpoints';

export enum LeftMenuType {
  NAVIGATION = 'navigation',
  SUBMENU = 'submenu',
}
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export type AppState = {
  theme: Theme;
  breakpoint: Breakpoint;
  isMenuOpen: LeftMenuType | false;
  isStatModalOpen: boolean;
};

type AppStateType = keyof AppState;

export type AppActions = {
  setTheme: (value: Theme) => void;
  setBreakpoint: (value: Breakpoint) => void;
  isUpToBreakpoint: (upTo: Breakpoint) => boolean;
  toggleIsMenuOpen: (menuType: LeftMenuType) => void;
  toggleIsStatModalOpen: () => void;
};

export type AppSlice = AppState & AppActions;

export const createAppSlice: StateCreator<AllSlices, [], [], AppSlice> = (set, get) => ({
  theme: Theme.LIGHT,
  breakpoint: 'md',
  isMenuOpen: false,
  isStatModalOpen: false,
  isUpToBreakpoint: (upTo: Breakpoint) => {
    return breakpoints[get().breakpoint] <= breakpoints[upTo];
  },
  setTheme: (value: Theme) => {
    set(state => ({
      ...state,
      theme: value,
    }));
  },
  setBreakpoint: (value: Breakpoint) => {
    set(state => ({
      ...state,
      breakpoint: value,
    }));
  },
  toggleIsMenuOpen: (menuType: LeftMenuType) => {
    set(state => ({
      ...state,
      isMenuOpen: state.isMenuOpen === menuType ? false : menuType,
    }));
  },
  toggleIsStatModalOpen: () => {
    set(state => ({
      ...state,
      isStatModalOpen: !state.isStatModalOpen,
    }));
  },
});
