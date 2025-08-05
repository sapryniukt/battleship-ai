<script setup lang="ts">
import { ExtrudeGeometry, Shape } from 'three';
import { defaultRoundedBorderProps } from '~/constants/defaultBoardProps';
import type { LevitatingBoardRoundedBorderProps } from '~/types/board';

const props = withDefaults(defineProps<LevitatingBoardRoundedBorderProps>(), defaultRoundedBorderProps);

const { boardWidth, boardHeight, thickness, depth, radius, outerFrameColor } = props;

const createCornerShape = (shape: Shape, width: number, height: number, radius: number) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  shape.moveTo(-halfWidth + radius, -halfHeight);
  shape.lineTo(halfWidth - radius, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius);
  shape.lineTo(halfWidth, halfHeight - radius);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight);
  shape.lineTo(-halfWidth + radius, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius);
  shape.lineTo(-halfWidth, -halfHeight + radius);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight);
};

const createGeometry = () => {
  const outerShape = new Shape();
  const borderThickness = thickness + 0.5;

  createCornerShape(outerShape, boardWidth, boardHeight, radius);

  const innerShape = new Shape();
  const innerRadius = radius - borderThickness;
  const innerWidth = boardWidth - 2 * borderThickness;
  const innerHeight = boardHeight - 2 * borderThickness;

  createCornerShape(innerShape, innerWidth, innerHeight, innerRadius);

  outerShape.holes.push(innerShape);

  const extrudeSettings = {
    steps: 2,
    depth,
    bevelEnabled: false
  };

  return new ExtrudeGeometry(outerShape, extrudeSettings);
};

const geometry = createGeometry();

onBeforeUnmount(() => {
  geometry.dispose();
});
</script>

<template>
  <TresGroup>
    <TresMesh :geometry="geometry" :position="[0, 0, -depth / 2]">
      <TresMeshStandardMaterial :color="outerFrameColor" :roughness="0.5" :metalness="1" />
    </TresMesh>
  </TresGroup>
</template>
