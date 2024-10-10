import { Theme } from '@nivo/core';

export enum NivoElement {
  TIME_RANGE = 'TIME_RANGE',
  BAR_CHART = 'BAR_CHART',
}

export const darkThemeNivo: Record<NivoElement, Theme> = {
  [NivoElement.TIME_RANGE]: {
    labels: {
      text: { fill: 'hsl(240 5.03% 64.9%)' },
    },
  },
  [NivoElement.BAR_CHART]: {
    axis: {
      ticks: {
        text: {
          fill: 'hsl(240 5.03% 64.9%)',
        },
      },
    },
  },
};
