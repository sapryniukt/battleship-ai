<script setup lang="ts">
const { camera } = useTresContext();
const groupRef = shallowRef();

const updateGroupYPosition = () => {
  if (camera.value && groupRef.value) {
    groupRef.value.position.setY(camera.value.position.y - 2.75);
  }
};

const { onBeforeRender } = useLoop();
onBeforeRender(({ invalidate }) => {
  updateGroupYPosition();
  invalidate();
});
</script>

<template>
  <TresGroup ref="groupRef">
    <Suspense>
      <Smoke :speed="0.2" :segments="4" :width="1" />
    </Suspense>
    <TresAmbientLight :intensity="3" />
    <TresDirectionalLight :intensity="3" :position="[2, 1, 2]" />
  </TresGroup>
</template>
