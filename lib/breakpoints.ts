export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const getBreakpoint = (width: number): Breakpoint => {
  if (width < breakpoints.sm) return 'xs';
  else if (width < breakpoints.md) return 'sm';
  else if (width < breakpoints.lg) return 'md';
  else if (width < breakpoints.xl) return 'lg';
  else if (width < breakpoints['2xl']) return 'xl';
  else return '2xl';
};
