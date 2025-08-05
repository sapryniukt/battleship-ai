import { DoubleSide } from 'three';
import { CellColor, CellMode } from '~/constants/battleship';
import type { Cell } from '~/types/battleship';

export const getMaterial = (cell: Cell, useAI: boolean) => {
  let color: string;

  switch (cell.mode) {
    case CellMode.Occupied:
      color = useAI ? CellColor.Occupied : CellColor.Empty;
      break;
    case CellMode.Missed:
      color = CellColor.Missed;
      break;
    case CellMode.Damaged:
      color = CellColor.Damaged;
      break;
    default:
      color = CellColor.Empty;
      break;
  }

  return {
    color,
    roughness: 0.4,
    metalness: 1,
    side: DoubleSide,
    flatShading: true
  };
};
