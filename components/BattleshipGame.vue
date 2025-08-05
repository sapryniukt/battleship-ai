<script lang="ts" setup>
import { CANVAS_RENDER_MODE } from '~/constants/3d';
import { Raycaster, Vector2 } from 'three';
import type { BattleshipPlayerConfig } from '~/types/battleship';

defineProps<{
  config: BattleshipPlayerConfig[];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const levitatingBoardRef = ref<HTMLDivElement | null>(null);
const boardRef = shallowRef();
const canvasRef = shallowRef();

const boardDimensions = ref({ width: 150, height: 150, depth: 5 });
const boardColor = ref('#3a3a3a');

const { settings } = useRendererSettings();
const { isTV } = useBreakpoints();

onBeforeUnmount(() => {
  levitatingBoardRef.value = null;
});

const rayCoordinates = ref({ x: 0, y: 0, z: 0 });

provide('rayCoordinates', rayCoordinates);

/**
 * onOverlayClick uses a Raycaster to compute a point in the world.
 */
const onOverlayClick = (event: MouseEvent) => {
  if (!boardRef.value) return;
  const { scene, camera } = boardRef.value;
  const canvas = canvasRef.value?.$el || canvasRef.value;
  const rect = canvas.getBoundingClientRect();

  // Convert the click coordinates into normalized device coordinates (-1 to 1).
  const mouse = new Vector2();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    rayCoordinates.value = { x: point.x, y: point.y, z: point.z };
  }
};
</script>

<template>
  <div class="w-full snap-y snap-mandatory" @click="onOverlayClick">
    <div ref="containerRef" class="container mx-auto"></div>
    <!-- Top dummy space for scroll -->
    <div class="absolute left-0 z-10 h-1/4 w-full"></div>

    <div ref="levitatingBoardRef" class="absolute top-2/4"></div>

    <!-- Bottom dummy space for scroll -->
    <div class="absolute bottom-0 left-0 z-10 grid h-1/4 w-full place-content-center"></div>

    <!-- Use an overlay container that catches the click -->
    <div class="relative h-svh min-h-[48rem]">
      <TresCanvas
        v-if="levitatingBoardRef"
        ref="canvasRef"
        v-bind="settings"
        :render-mode="CANVAS_RENDER_MODE.ON_DEMAND"
        class="pointer-events-none !relative snap-start snap-always"
        shadows
      >
        <TresPerspectiveCamera :position="[0, 0, 300]" :zoom="isTV ? 0.8 : 1" />
        <LevitatingBoard ref="boardRef" :size="boardDimensions" :color="boardColor" :container="containerRef">
          <BattleshipBoard
            v-for="player in config"
            :key="player.key"
            :player-key="player.key"
            :rows="10"
            :columns="10"
            :size="14"
            :gap="0.3"
            :depth="player.depth"
            :playerConfig="player.value"
            :inverse="player.inverse"
          />
        </LevitatingBoard>
        <LightElement />
        <LightElement side="left" />
        <LightElement side="right" :depth="-boardDimensions.depth" />
      </TresCanvas>
    </div>
  </div>
</template>
