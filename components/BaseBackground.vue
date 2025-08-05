<script lang="ts" setup>
import { useFps } from '@vueuse/core';
import { CANVAS_RENDER_MODE, MIN_FPS_THRESHOLD } from '~/constants/3d';

const { settings } = useRendererSettings();

const renderMode = ref(CANVAS_RENDER_MODE.ON_DEMAND);
const fps = useFps();

const progress = ref(0);
const isStarsEnabled = ref(false);
const prefersReducedMotion = useReducedMotion();

const updateRenderMode = () => {
  const measuredFps = fps.value;
  const goodPerformance = (isStarsEnabled.value = measuredFps > MIN_FPS_THRESHOLD);
  renderMode.value = goodPerformance ? CANVAS_RENDER_MODE.ON_DEMAND : CANVAS_RENDER_MODE.MANUAL;

  console.log('Measured FPS:', measuredFps, 'Setting renderMode to:', renderMode.value);
};

onMounted(() => {
  setTimeout(updateRenderMode, 2000);
});

const updatedSettings = computed(() => ({
  ...settings.value,
  renderMode: prefersReducedMotion.value ? CANVAS_RENDER_MODE.MANUAL : renderMode.value,
  alpha: false
}));
</script>

<template>
  <TresCanvas v-bind="updatedSettings" class="z-[-1]" window-size>
    <StarryBackground v-if="isStarsEnabled" />
    <StarryNebula />
    <ScrollControls v-if="isStarsEnabled" v-model="progress" :distance="50" html-scroll />
  </TresCanvas>
</template>
