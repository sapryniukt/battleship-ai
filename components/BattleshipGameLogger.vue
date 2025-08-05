<script lang="ts" setup>
import type {
  BattleshipHitEvent,
  BattleshipLLMThinkingEvent,
  BattleshipMistakeEvent,
  BattleshipSinkEvent,
  BattleshipPlayerConfig,
  GameLog,
  Player,
  PlayerKey
} from '~/types/battleship';

const props = defineProps<{
  playerKey: PlayerKey;
}>();

const logs = ref<GameLog[]>([]);

const _players = inject<BattleshipPlayerConfig[]>('players');
const playerConfig = computed(() => _players?.find((p: BattleshipPlayerConfig) => p.key === props.playerKey));

const isAIProviderEnabled = computed(() => {
  return (
    playerConfig.value?.value &&
    playerConfig.value.value.useAI &&
    playerConfig.value.value.aiStrategy === 'llm' &&
    playerConfig.value.value.llmProvider
  );
});

const addLog = ({
  player,
  message,
  provider,
  type = 'info'
}: {
  player: Player;
  provider?: string;
  message: string;
  type: 'hit' | 'miss' | 'sink' | 'info';
}) => {
  logs.value.unshift({
    id: Date.now(),
    timestamp: new Date(),
    provider,
    message,
    player,
    type
  });
};

const hitLogHandler = ({ player, coordinate, hit }: BattleshipHitEvent) => {
  addLog({
    player,
    message: `Fired at (${coordinate.x}, ${coordinate.y}) - ${hit ? 'HIT!' : 'Miss'}`,
    type: hit ? 'hit' : 'miss'
  });
};

const sinkLogHandler = ({ player, ship }: BattleshipSinkEvent) => {
  addLog({
    player,
    message: `Sank a ${ship.name}!`,
    type: 'sink'
  });
};

const mistakeLogHandler = ({ player, coordinate, provider }: BattleshipMistakeEvent) => {
  addLog({
    player,
    provider,
    message: `Attempted an invalid move at (${coordinate?.x ?? NaN}, ${coordinate?.y ?? NaN}). The system will choose a valid coordinate automatically.`,
    type: 'miss'
  });
};

const handleLLMMessage = ({ thought, provider }: BattleshipLLMThinkingEvent) => {
  addLog({
    player: {
      name: capitalize(provider)
    } as Player,
    provider,
    message: thought,
    type: 'info'
  });
};

const resetLogs = () => {
  logs.value = [];
};

onMounted(() => {
  eventBus.on(`game:hit:${props.playerKey}`, hitLogHandler);
  eventBus.on(`game:sink:${props.playerKey}`, sinkLogHandler);
  eventBus.on(`game:mistake:${props.playerKey}`, mistakeLogHandler);
  eventBus.on(`game:llm:thinking:${props.playerKey}`, handleLLMMessage);
  eventBus.on('game:reset', resetLogs);
});
onUnmounted(() => {
  eventBus.off(`game:hit:${props.playerKey}`, hitLogHandler);
  eventBus.off(`game:sink:${props.playerKey}`, sinkLogHandler);
  eventBus.off(`game:mistake:${props.playerKey}`, mistakeLogHandler);
  eventBus.off(`game:llm:thinking:${props.playerKey}`, handleLLMMessage);
  eventBus.off('game:reset', resetLogs);
});

defineExpose({ addLog });
</script>

<template>
  <div class="h-full">
    <h3 class="mb-2 px-2 text-lg font-semibold">Logs of {{ playerConfig?.value.name }}</h3>
    <div class="space-y-1">
      <Alert
        v-for="log in logs"
        :key="log.id"
        class="p-2 text-sm"
        :class="{
          'bg-red-800/30': log.type === 'hit',
          'bg-red-950/30': log.type === 'sink',
          'bg-gray-800/20': log.type === 'info'
        }"
      >
        <component v-if="log.provider" :is="`svgo-${log.provider}`" />
        <p class="absolute right-2 top-2 text-xs opacity-60">
          {{ log.timestamp.toLocaleTimeString() }}
        </p>
        <AlertTitle>{{ log.player.name }}</AlertTitle>
        <AlertDescription>{{ log.message }}</AlertDescription>
      </Alert>

      <Alert v-if="!logs.length && playerConfig">
        <component v-if="isAIProviderEnabled" :is="`svgo-${playerConfig.value.llmProvider}`" />
        <AlertTitle>{{ playerConfig.value.name }}</AlertTitle>
        <AlertDescription>No moves have been made.</AlertDescription>
      </Alert>
    </div>
  </div>
</template>
