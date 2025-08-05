import { usePreferredReducedMotion } from '@vueuse/core';

export const useReducedMotion = () => {
  const prefersReducedMotion = usePreferredReducedMotion();
  return computed(() => prefersReducedMotion.value === 'reduce');
};
