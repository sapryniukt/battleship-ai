<script lang="ts" setup>
import { defaultBoardProps } from '~/constants/defaultBattleshipProps';
import type { BattleshipBoardFieldProps } from '~/types/battleship';

const props = withDefaults(defineProps<BattleshipBoardFieldProps>(), defaultBoardProps);
</script>

<template>
  <TresMesh :position="props.position">
    <TresBoxGeometry :args="[props.size, props.size, props.depth]" />
    <TresMeshStandardMaterial v-bind="material" />
  </TresMesh>
</template>
