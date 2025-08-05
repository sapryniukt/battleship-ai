<script setup lang="ts">
const yRotation = shallowRef(0);
useRenderLoop().onLoop(({ delta }) => {
  yRotation.value += 0.01 * delta;
});
</script>

<template>
  <Stars
    :rotation="[0, yRotation, 0]"
    :radius="500"
    :depth="500"
    :count="6000"
    :size="2"
    :transparent="false"
    :alphaTest="0"
  />
</template>
