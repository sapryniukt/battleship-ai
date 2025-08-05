<script lang="ts" setup>
import type { BattleshipPlayerConfig } from "~/types/battleship";
import type { HeaderMarkdown } from "~/types/markdown";

await usePageContentFetch(["header", "about", "footer"]);

const doc = useContentEntry<HeaderMarkdown>("header");
const title = computed(() => doc.value?.titles.battleship);
const { isMobile } = useBreakpoints();

useSeoMeta({
  title,
});

const players = reactive<BattleshipPlayerConfig[]>([
  {
    key: "player1",
    value: {
      name: "You",
      key: "player1",
      useAI: false,
      aiStrategy: "random",
      llmProvider: "openai",
      llmModel: "gpt-4o-mini",
    },
    depth: 2,
  },
  {
    key: "player2",
    value: {
      name: "AI",
      key: "player2",
      useAI: true,
      aiStrategy: "hunt-target",
      llmProvider: "openai",
      llmModel: "gpt-4o-mini",
    },
    inverse: true,
    depth: -2,
  },
]);

provide("players", players);
</script>

<template>
  <Sheet>
    <TheHeader v-if="isMobile" />

    <SidebarProvider>
      <GameLeftSidebar />

      <BattleshipGame :config="players" />
      <BattleshipConfig>
        <BattleshipPlayerConfig
          v-for="player in players"
          :key="player.key"
          v-model="player.value"
        >
          {{ player.value.name }}
        </BattleshipPlayerConfig>
      </BattleshipConfig>
      <GameRightSidebar />
    </SidebarProvider>
  </Sheet>
</template>
