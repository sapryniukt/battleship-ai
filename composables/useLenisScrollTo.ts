import { useLenis } from 'lenis/vue';

export function useLenisScrollTo() {
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  function scrollTo(target: string | Element | number, options?: Record<string, unknown>) {
    lenis.value?.resize();
    requestAnimationFrame(() => {
      if (prefersReducedMotion.value) {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'auto' });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: 'auto' });
        } else if (target instanceof Element) {
          target.scrollIntoView({ behavior: 'auto' });
        }
      } else {
        lenis.value?.scrollTo(target as HTMLElement, {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          ...options
        });
      }
    });
  }

  return { scrollTo };
}
