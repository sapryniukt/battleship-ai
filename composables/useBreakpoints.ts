import { useBreakpoints as VueUseBreakpoints } from '@vueuse/core';

const breakpoints = VueUseBreakpoints({
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1600
});

export function useBreakpoints() {
  const isMobile = breakpoints.smaller('md');
  const isTablet = breakpoints.between('sm', 'lg');
  const isDesktop = breakpoints.greater('lg');
  const isTV = breakpoints.greater('xl');

  return { isMobile, isDesktop, isTablet, isTV };
}
