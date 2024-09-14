import { StateCreator } from 'zustand';
import { AllSlices } from '@/store/store';
import { getEmptyStatData, StatData, StatGrouping } from '@/components/app/stats/statModalLib';

export type StatState = {
  statData: StatData;
  statGrouping: StatGrouping;
  statSelectedArchetypeId?: number;
  isStatDiverging: boolean;
  isStatByStartingPlayer: boolean;
  isStatByOpeningHand: boolean;
};

type StatStateType = keyof StatState;

export type StatActions = {
  setStatData: (value: StatData) => void;
  setStatGrouping: (value: StatGrouping) => void;
  setStatSelectedArchetypeId: (value: number) => void;
  toggleIsStatDiverging: () => void;
  toggleIsStatByStartingPlayer: () => void;
  toggleIsStatByOpeningHand: () => void;
};

export type StatSlice = StatState & StatActions;

export const createStatSlice: StateCreator<AllSlices, [], [], StatSlice> = set => ({
  statData: getEmptyStatData(),
  statGrouping: StatGrouping.MATCH,
  statSelectedArchetypeId: undefined,
  isStatDiverging: true,
  isStatByStartingPlayer: true,
  isStatByOpeningHand: false,
  setStatData: (value: StatData) => {
    set(state => ({
      ...state,
      statData: value,
    }));
  },
  setStatGrouping: (value: StatGrouping) => {
    set(state => ({
      ...state,
      statGrouping: value,
    }));
  },
  setStatSelectedArchetypeId: (value: number) => {
    set(state => ({
      ...state,
      statSelectedArchetypeId: value,
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
