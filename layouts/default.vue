<script lang="ts" setup>
import type { HeaderMarkdown } from "~/types/markdown";
const startPreloadAnimation = inject<Ref<boolean>>("startPreloadAnimation");

const { onAfterLoop } = useRenderLoop();
onAfterLoop(({ elapsed }: { elapsed: number }) => {
  if (elapsed > 1 && startPreloadAnimation) {
    startPreloadAnimation.value = true;
  }
});

const doc = useContentEntry<HeaderMarkdown>("header");
const isMenuOpened = ref(false);
const closeMenu = ref<() => void>(() => {});

provide("isMenuOpened", isMenuOpened);
provide("closeMenu", closeMenu);

const lockScrollClass = computed(() =>
  isMenuOpened.value ? "disable-scroll" : ""
);
const prefersReducedMotion = useReducedMotion();

watchEffect(() => {
  if (!doc.value) return;

  useHead({
    htmlAttrs: {
      class: "dark text-foreground",
    },
    titleTemplate: (titleChunk?: string) =>
      titleChunk && doc.value?.titles?.general
        ? `${titleChunk} | ${doc.value.titles.general}`
        : (doc.value?.titles?.base ?? ""),
  });
});

watch(prefersReducedMotion, (flag: boolean) => {
  if (flag && startPreloadAnimation) {
    startPreloadAnimation.value = true;
  }
});
</script>

<template>
  <div id="layout" class="w-full text-white" :class="lockScrollClass">
    <BaseBackground />

    <main>
      <Suspense>
        <slot />
      </Suspense>
    </main>
  </div>
</template>
