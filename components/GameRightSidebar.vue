<script lang="ts" setup>
const rightSidebarId = useId();
const isMenuOpened = inject<Ref<boolean>>("isMenuOpened");
const closeMenu = inject<Ref<() => void>>("closeMenu");
const menuClass = computed(() => (isMenuOpened?.value ? "active" : ""));

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
    <Sidebar
      :key="rightSidebarId"
      variant="floating"
      side="right"
      class="z-40 backdrop-blur-lg"
    >
      <SidebarHeader>
        <div class="flex items-center justify-between gap-4">
          <LazySvgoRotate
            class="size-12 origin-center cursor-pointer rounded bg-neutral-950 p-2.5 motion-safe:transition-all motion-safe:active:size-10 motion-reduce:active:invert-[.1] motion-reduce:active:sepia"
            @click.prevent="eventBus.emit('rotate-camera')"
            hydrate-on-visible
          />
          <button
            data-test="menu-toggle-button"
            class="size-12 p-2.5"
            @click="toggle"
          >
            <LazySvgoMenu
              id="Menu"
              class="h-10 -scale-x-100"
              :class="menuClass"
              hydrate-on-visible
            />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea class="h-full">
          <SidebarGroup
            ><BattleshipGameLogger ref="gameLogger" playerKey="player2"
          /></SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  </aside>
</template>
