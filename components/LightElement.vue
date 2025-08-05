<script setup lang="ts">
import { LightSide, defaultLightProps } from '~/constants/defaultLightProps';
import type { LightProps } from '~/types/light';

const props = withDefaults(defineProps<Partial<LightProps>>(), defaultLightProps);

const lightX = ref(0);
const lightY = ref(props.height / 2);
const lightZ = ref(0);

switch (props.side) {
  case LightSide.Left:
    lightX.value = -props.width * 2;
    break;
  case LightSide.Right:
    lightX.value = props.width * 2;
    break;
  default:
    lightX.value = 0;
}

const groupRef = shallowRef();
const { camera } = useTresContext();

const updateGroupPosition = () => {
  if (camera.value && groupRef.value) {
    groupRef.value.position.copy(camera.value.position);
  }
};

const { onBeforeRender } = useLoop();
onBeforeRender(({ invalidate }) => {
  updateGroupPosition();
  invalidate();
});
</script>

<template>
  <TresGroup ref="groupRef">
    <TresAmbientLight :intensity="props.ambientIntensity" />

    <TresDirectionalLight cast-shadow :position="[lightX, lightY, lightZ]" :intensity="props.directionalIntensity" />

    <TresDirectionalLight cast-shadow :position="[lightX, -lightY, lightZ]" :intensity="props.directionalIntensity" />

    <TresDirectionalLight cast-shadow :position="[lightX, 0, lightZ]" :intensity="props.directionalIntensity" />

    <TresPointLight :position="[lightX, 0, lightZ]" :intensity="props.pointIntensity" />

    <TresSpotLight
      :position="[lightX * 1.5, lightY * 1.5, lightZ * 1.5]"
      :intensity="props.spotIntensity"
      :angle="props.spotAngle"
    />
  </TresGroup>
</template>
