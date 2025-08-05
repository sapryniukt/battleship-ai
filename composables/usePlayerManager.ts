import { generateUUID } from 'three/src/math/MathUtils.js';
import { CellMode } from '~/constants/battleship';
import * as AIService from '~/services/battleship/AIService';
import type { Cell, Coordinate, PlayerConfig } from '~/types/battleship';

const { activePlayer, existingPlayer, registerPlayer, getPlayerData, hitOpponent, winner } = useBattleshipGame();

export const usePlayerManager = (config: Ref<PlayerConfig> | PlayerConfig) => {
  const playerConfig = isRef(config) ? config : ref(config);

  const id = shallowRef<string>();
  const _aiStrategy = shallowRef();
  const data = shallowRef();

  const isActive = (): boolean => {
    return activePlayer.value === id.value;
  };

  const isUserActive = computed((): boolean => {
    return isActive() && !playerConfig.value.useAI;
  });

  const isAIActive = computed((): boolean => {
    return isActive() && !!playerConfig.value.useAI;
  });

  const preventChange = (value: Cell): boolean => {
    return !value || !isActive() || value.mode === CellMode.Damaged || value.mode === CellMode.Missed;
  };

  const aiGuessCoordinate = async () => {
    try {
      return await AIService.guessCoordinate(data.value?.board, _aiStrategy.value, playerConfig.value.key);
    } catch (error: unknown) {
      const { coordinate } = error as unknown as { coordinate: Coordinate };
      eventBus.emit(`game:mistake:${playerConfig.value.key!}`, {
        provider: playerConfig.value.llmProvider,
        player: getPlayerData(id.value!)!,
        coordinate
      });
      return await AIService.guessCoordinate(data.value?.board, AIService.useHuntTargetStrategy());
    }
  };

  const hitCell = async (value: Cell) => {
    if (preventChange(value)) {
      return;
    }

    hitOpponent(value);

    if (value.mode === CellMode.Damaged && isAIActive.value && _aiStrategy.value?.setLastHit) {
      _aiStrategy.value.setLastHit(value.coordinate);
      const cell = await aiGuessCoordinate();
      if (cell) {
        hitCell(cell);
      }
    }
  };

  const updateData = () => {
    const { key, name } = playerConfig.value;
    registerPlayer(id.value!, key!, name);
    data.value = getPlayerData(id.value!);
  };

  const updateStrategy = () => {
    if (playerConfig.value.useAI) {
      _aiStrategy.value = AIService.createStrategy(playerConfig.value.aiStrategy, {
        provider: playerConfig.value.llmProvider,
        model: playerConfig.value.llmModel
      });
    } else {
      _aiStrategy.value = null;
    }
  };

  const update = () => {
    updateData();
    updateStrategy();
  };

  watch(
    () => playerConfig,
    async () => {
      // If key changes, we need to re-register
      update();

      if (isAIActive.value) {
        const cell = await aiGuessCoordinate();
        if (cell) {
          hitCell(cell);
        }
      }
    },
    { deep: true }
  );

  onMounted(() => {
    const player = existingPlayer.next().value;
    const existingId = player?.[0] || id.value;
    id.value = existingId || generateUUID();
    updateData();
    updateStrategy();
    eventBus.on('game:reset', update);
  });

  onBeforeUnmount(() => {
    id.value = '';
    data.value = null;
    _aiStrategy.value = null;
    eventBus.off('game:reset', update);
  });

  watch(activePlayer, async () => {
    if (playerConfig.value.useAI && data.value && activePlayer.value === id.value) {
      const cell = await aiGuessCoordinate();
      if (cell) {
        hitCell(cell);
      }
    }
  });

  watch(winner, () => {
    data.value = getPlayerData(id.value!);
    if (playerConfig.value.useAI && (!_aiStrategy.value || winner.value)) {
      updateStrategy();
    }
  });

  return {
    data,
    config: playerConfig,
    hitCell,
    isUserActive,
    isAIActive
  };
};
