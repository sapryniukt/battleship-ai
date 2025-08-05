<script lang="ts" setup>
import { BaseCameraControls } from '@tresjs/cientos';
import { useMediaQuery } from '@vueuse/core';
import type { LevitatingBoardProps } from '~/types/board';

const props = defineProps<LevitatingBoardProps>();
const { size, color, container } = props;

const cameraControllRotation = ref(0);
const controlsState = reactive<Partial<BaseCameraControls>>({});
const cameraControls = shallowRef();

const isTouchDevice = useMediaQuery('(pointer: coarse)');
const polarSpeed = computed(() => (isTouchDevice.value ? 0 : 1));


useCameraPosition(controlsState, container);

const toggleCameraControllRotation = (angle?: 0 | Math['PI']) => {
  cameraControllRotation.value = angle ?? (cameraControllRotation.value ? 0 : Math.PI);
  cameraControls.value.instance.rotateTo(cameraControllRotation.value, Math.PI / 2, 2);
};

watch(cameraControllRotation, (value) => {
  container?.setAttribute('data-rotation', value.toString());
});

onMounted(() => {
  eventBus.on('rotate-camera', toggleCameraControllRotation);
});
onUnmounted(() => {
  eventBus.off('rotate-camera', toggleCameraControllRotation);
});
const { camera, scene } = useTresContext();
defineExpose({ cameraControls, camera, scene });
</script>

<template>
  <LevitatingBoardContentFrame :size="size" :color="color" />
  <LevitatingBoardRoundedBorder
    :boardWidth="size.width"
    :boardHeight="size.height"
    :boardDepth="-size.depth"
    :depth="size.depth - 0.3"
    :thickness="1"
    :radius="1"
    :segments="1"
  />
  <LevitatingBoardRoundedBorder
    :boardWidth="size.width + 8"
    :boardHeight="size.height + 8"
    :boardDepth="-size.depth"
    :depth="size.depth - 0.4"
    :thickness="3"
    :radius="2"
  />
  <slot></slot>
  <CameraControls
    ref="cameraControls"
    v-bind="controlsState"
    :mouse-buttons="{ wheel: BaseCameraControls.ACTION.NONE }"
    :touches="{ two: BaseCameraControls.ACTION.TOUCH_ZOOM }"
    :polar-rotate-speed="polarSpeed"
  />
</template>
