import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { StatGrouping } from '@/components/app/stats/statModalLib';

export type StatState = {
  statGrouping: StatGrouping;
  isStatDiverging: boolean;
  isStatByStartingPlayer: boolean;
  isStatByOpeningHand: boolean;
};

type StatStateType = keyof StatState;

export type StatActions = {
  setStatGrouping: (value: StatGrouping) => void;
  toggleIsStatDiverging: () => void;
  toggleIsStatByStartingPlayer: () => void;
  toggleIsStatByOpeningHand: () => void;
};

export type StatSlice = StatState & StatActions;

export const createStatSlice: StateCreator<AllSlices, [], [], StatSlice> = set => ({
  statGrouping: StatGrouping.MATCH,
  isStatDiverging: true,
  isStatByStartingPlayer: true,
  isStatByOpeningHand: false,
  setStatGrouping: (value: StatGrouping) => {
    set(state => ({
      ...state,
      statGrouping: value,
    }));
  },
  toggleIsStatDiverging: () => {
    set(state => ({
      ...state,
      isStatDiverging: !state.isStatDiverging,
    }));
  },
  toggleIsStatByStartingPlayer: () => {
    set(state => ({
      ...state,
      isStatByStartingPlayer: !state.isStatByStartingPlayer,
    }));
  },
  toggleIsStatByOpeningHand: () => {
    set(state => ({
      ...state,
      isStatByOpeningHand: !state.isStatByOpeningHand,
    }));
  },
});
