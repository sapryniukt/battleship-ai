<script lang="ts" setup>
import { DoubleSide, Vector3 } from 'three';
import Base3DText from '~/components/Base3DText.vue';
import type { Tab3DProps } from '~/types/tab3d';

const props = withDefaults(defineProps<Tab3DProps>(), {
  label: 'Tab',
  position: new Vector3(0, 0, 0),
  dimensions: () => [0, 0, 0],
  fontSize: 8,
  bgcolor: '#333333',
  color: '#f3f3f3',
  inverse: false
});

const materialProps = ref({
  metalness: 1,
  roughness: 0.5,
  side: DoubleSide,
  flatShading: true
});

const inversedValues = computed(() => {
  const i = props.inverse ? -1 : 1;

  const [w, h, z] = props.dimensions;

  const groupPosition = new Vector3(props.position.x * i, props.position.y * i, props.position.z * i);

  const boxDimensions = [w! * i, h! * i, z! * i] as [number, number, number];

  const boxOffset = new Vector3(w! / 2, 0, 0).multiplyScalar(i);
  const textPosX = 5 * i;
  const textPosZ = 1.25 * i;

  return {
    groupPosition,
    boxDimensions,
    boxOffset,
    textPosX,
    textPosZ
  };
});
</script>

<template>
  <TresGroup :key="props.label" :position="inversedValues.groupPosition">
    <TresMesh :position="inversedValues.boxOffset">
      <TresBoxGeometry :args="inversedValues.boxDimensions" />
      <TresMeshStandardMaterial v-bind="materialProps" :color="props.bgcolor" />
    </TresMesh>

    <Base3DText
      v-for="(z, index) in [-inversedValues.textPosZ, inversedValues.textPosZ]"
      :key="index"
      :text="props.label"
      :size="props.fontSize"
      :defaultColor="props.color"
      :inverse="props.inverse"
      :position="{ x: inversedValues.textPosX, y: 6, z }"
    />
  </TresGroup>
</template>
