<script setup lang="ts">
import { defaultBoardProps } from '~/constants/defaultBoardProps';
import type { LevitatingBoardContentFrameProps } from '~/types/board';

const props = withDefaults(defineProps<LevitatingBoardContentFrameProps>(), defaultBoardProps);

const boardGeometry = computed(
  () => [props.size.width, props.size.height, props.size.depth] as [number, number, number]
);
</script>

<template>
  <TresGroup>
    <slot name="board">
      <TresMesh :position="props.boardPosition">
        <TresBoxGeometry :args="boardGeometry" />
        <TresMeshStandardMaterial v-bind="props.boardMaterial" />
      </TresMesh>
    </slot>
  </TresGroup>
</template>
