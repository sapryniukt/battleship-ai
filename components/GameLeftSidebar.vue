<script lang="ts" setup>
const leftSidebarId = useId();
</script>

<template>
  <aside id="sidebar-left">
    <Sidebar :key="leftSidebarId" variant="floating" class="z-40 backdrop-blur-lg">
      <SidebarHeader>
        <div class="flex items-center justify-between gap-4">
          <NuxtLinkLocale
            to="/"
            aria-label="home"
            class="motion-safe:transition motion-safe:focus-visible:rotate-[18deg]"
          >
            <LazySvgoLogo
              :class="[
                'size-12',
                'origin-center rounded bg-neutral-950 p-2.5',
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
          <SheetTrigger>
            <LazySvgoConfig
              class="size-12 origin-center cursor-pointer rounded bg-neutral-950 p-2.5 motion-safe:transition-all motion-safe:active:size-10 motion-reduce:active:invert-[.1] motion-reduce:active:sepia"
              hydrate-on-visible
            />
          </SheetTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea class="h-full">
          <SidebarGroup>
            <BattleshipGameLogger ref="gameLogger" playerKey="player1" />
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  </aside>
</template>
