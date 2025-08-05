<script lang="ts" setup>
const rightSidebarId = useId();
const isMenuOpened = inject<Ref<boolean>>('isMenuOpened');
const closeMenu = inject<Ref<() => void>>('closeMenu');
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
</script>

<template>
  <aside id="sidebar-right">
    <Sidebar :key="rightSidebarId" variant="floating" side="right" class="z-40 backdrop-blur-lg">
      <SidebarHeader>
        <div class="flex items-center justify-between gap-4">
          <LazySvgoRotate
            class="size-12 origin-center cursor-pointer rounded bg-neutral-950 p-2.5 motion-safe:transition-all motion-safe:active:size-10 motion-reduce:active:invert-[.1] motion-reduce:active:sepia"
            @click.prevent="eventBus.emit('rotate-camera')"
            hydrate-on-visible
          />
          <a href="https://github.com/sapryniukt/battleship-ai" target="_blank" class="rounded bg-neutral-950">
            <LazySvgoGithub
              id="Github"
              class="size-12 -scale-x-100 p-2.5 invert"
              :class="menuClass"
              hydrate-on-visible
            />
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea class="h-full">
          <SidebarGroup><BattleshipGameLogger ref="gameLogger" playerKey="player2" /></SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  </aside>
</template>
