<script lang="ts" setup>
import { Vector3 } from 'three';
import { getMaterial } from '~/utils/battleship/fieldMaterial';
import { TabColor } from '~/constants/battleship';
import type { BattleshipBoardProps, Cell, Coordinate } from '~/types/battleship';

const props = defineProps<BattleshipBoardProps>();
const { data, hitCell, isUserActive, isAIActive } = usePlayerManager(props.playerConfig!);

const rayCoordinates = inject('rayCoordinates', ref({ x: 0, y: 0, z: 0 }));
const xOffset = (props.columns - 1) / 2;
const yOffset = (props.rows - 1) / 2;
const tabColor = ref('#222222');
const textColor = ref('f3f3f3');

const tabWidth = computed(() => {
  return (data.value.name?.length + String(data.value?.winCount).length) * 9;
});

const getPosition = (row: number, col: number): [number, number, number] => {
  const x = (col - xOffset) * (props.size + props.gap);
  const y = (row - yOffset) * (props.size + props.gap);
  return [x, y, props.depth];
};

const handleCellClick = async (cell: Cell) => {
  if (isUserActive.value) {
    await hitCell(cell);
  }
};

watch(rayCoordinates, (newCoord: Coordinate) => {
  if (!data.value || !data.value.board) return;
  const tolerance = props.size / 2;

  data.value.board.forEach(({ row }: { row: Cell[] }, rowIndex: number) => {
    row.forEach((cell: Cell, colIndex: number) => {
      const [cellX, cellY] = getPosition(rowIndex, colIndex);

      if (Math.abs(newCoord.x - cellX) <= tolerance && Math.abs(newCoord.y - cellY) <= tolerance) {
        handleCellClick(cell);
      }
    });
  });
});

watch(isUserActive, () => {
  tabColor.value = isUserActive.value ? TabColor.Active : TabColor.Inactive;
});

watch(isAIActive, () => {
  if (props.playerConfig?.useAI) {
    tabColor.value = isAIActive.value ? TabColor.Active : TabColor.Inactive;
  }
});
</script>

<template>
  <Base3DTab
    v-if="data"
    :color="textColor"
    :bgcolor="tabColor"
    :position="new Vector3(-75, 90, 0)"
    :dimensions="[tabWidth, 20, 2]"
    :label="`${data.name}: ${data.winCount}`"
    :inverse="props.inverse"
  />
  <template v-for="({ id: rowID, row }, rowIndex) in data?.board" :key="`row-${rowID}`">
    <BattleshipBoardField
      v-for="(cell, colIndex) in row"
      :key="`col-${cell.id}`"
      :position="getPosition(rowIndex, colIndex)"
      :size="props.size"
      :depth="props.depth"
      :material="getMaterial(cell, !!props.playerConfig?.useAI)"
    />
  </template>
</template>
