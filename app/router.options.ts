import type { RouterConfig } from '@nuxt/schema';

type ScrollToPosition = {
  top?: number;
  left?: number;
  behavior?: ScrollBehavior;
};

type ScrollToElement = {
  el: string | Element;
  top?: number;
  behavior?: ScrollBehavior;
};

// @todo: consider elimination when the comment https://github.com/nuxt/nuxt/pull/31545#issuecomment-2781495556 has a better solution.
export default <RouterConfig>{
  scrollBehavior(to, from) {
    const nuxtApp = useNuxtApp();
    const { scrollTo } = useLenisScrollTo();

    // @ts-expect-error untyped, nuxt-injected option
    const behavior = useRouter().options?.scrollBehaviorType ?? 'auto';

    const waitForTransition = (callback: () => ScrollToPosition | ScrollToElement) =>
      new Promise((resolve) => {
        nuxtApp.hooks.hookOnce('page:transition:finish', () => {
          requestAnimationFrame(() => resolve(callback()));
        });
      });

    if (to.hash && to.path === from.path) {
      scrollTo(to.hash);

      return { left: 0, behavior };
    }

    if (to.hash && to.path !== from.path) {
      return waitForTransition(() => {
        scrollTo(to.hash, { force: true });

        return { top: _getHashElementScrollMarginTop(to.hash) };
      });
    }

    if (to) {
      scrollTo(0);
      return waitForTransition(() => ({ left: 0, behavior }));
    }

    return { top: 0, left: 0, behavior };
  }
};

function _getHashElementScrollMarginTop(selector: string): number {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return (
        (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) +
        (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
      );
    }
  } catch {
    // ignore any errors parsing scrollMarginTop
  }
  return 0;
}
