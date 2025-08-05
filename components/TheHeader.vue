<script lang="ts" setup>
import type { HeaderMarkdown } from '~/types/markdown';

const { isMobile } = useBreakpoints();
const isMenuOpened = inject<Ref<boolean>>('isMenuOpened');
const closeMenu = inject<Ref<() => void>>('closeMenu');
const doc = useContentEntry<HeaderMarkdown>('header');

const menuClass = computed(() => (isMenuOpened?.value ? 'active' : ''));

const toggle = () => {
  if (isMenuOpened) {
    isMenuOpened.value = !isMenuOpened.value;
  }
};

onMounted(() => {
  if (closeMenu) {
    closeMenu.value = () => (toggle(), undefined);
  }
});

watchEffect(() => {
  if (!doc.value) return;

  useHead({
    htmlAttrs: {
      class: 'dark text-foreground'
    },
    titleTemplate: (titleChunk) =>
      titleChunk && doc.value?.titles?.general
        ? `${titleChunk} | ${doc.value.titles.general}`
        : (doc.value?.titles?.base ?? '')
  });
});
</script>

<template>
  <header class="sticky inset-0 z-30 h-fit max-w-full">
    <nav class="absolute w-full backdrop-blur-[2px]">
      <div class="container mx-auto flex h-24 justify-between">
        <div class="flex items-center">
          <NuxtLinkLocale
            to="/"
            aria-label="home"
            class="motion-safe:transition motion-safe:focus-visible:rotate-[18deg]"
          >
            <LazySvgoLogo
              :class="[
                'h-10',
                'md:h-12',
                'w-auto',
                'cursor-pointer',
                'duration-300',
                'invert-0',
                'motion-safe:hover:scale-95',
                'motion-safe:hover:rotate-[18deg]',
                'hover:brightness-90',
                'hover:sepia'
              ]"
              hydrate-on-idle
            />
          </NuxtLinkLocale>
          <template v-if="!isMobile && !isMenuOpened">
            <div id="divider" class="ml-8 mr-6 h-8 border-r"></div>
            <BaseButton class="py-2" data-test="menu-button" @click="toggle">{{ doc?.menuLabel }}</BaseButton>
          </template>
        </div>
        <div class="flex items-center gap-4">
          <LazySvgoRotate
            class="size-12 origin-center cursor-pointer rounded bg-neutral-950 p-2.5 motion-safe:transition-all motion-safe:active:size-10 motion-reduce:active:invert-[.1] motion-reduce:active:sepia"
            @click.prevent="eventBus.emit('rotate-camera')"
            hydrate-on-visible
          />
          <SheetTrigger v-show="isMobile || isMenuOpened">
            <LazySvgoMenu id="Menu" class="h-10 -scale-x-100" :class="menuClass" hydrate-on-visible />
          </SheetTrigger>
        </div>
      </div>
    </nav>
  </header>
</template>

<style>
#Menu line {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
  transform-origin: center;
}
#Menu.active .middle {
  opacity: 0;
}
#Menu.active .top {
  transform: translate(-4px, 5px) rotate(45deg) scaleX(1.3);
}
#Menu.active .bottom {
  transform: translate(-8px, -1px) rotate(-45deg) scaleX(-1.63);
}
#Menu:not(.active):hover .top {
  transform: scaleX(1.3);
}
#Menu:not(.active):hover .bottom {
  transform: scaleX(2.4);
}
</style>
