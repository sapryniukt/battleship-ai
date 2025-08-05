import { generateUUID } from 'three/src/math/MathUtils.js';
import { BOARD_SIZE_X, BOARD_SIZE_Y, CellMode } from '~/constants/battleship';
import type { Board, Ship } from '~/types/battleship';

const isOutOfBounds = (x: number, y: number): boolean => x < 0 || x >= BOARD_SIZE_X || y < 0 || y >= BOARD_SIZE_Y;

const isCellEmptyOrOutOfBounds = (board: Board, x: number, y: number): boolean =>
  isOutOfBounds(x, y) || board[x].row[y].mode === CellMode.Empty;

const canPlaceHorizontal = (board: Board, x: number, y: number, length: number): boolean => {
  if (x + length > BOARD_SIZE_X) return false;

  for (let i = -1; i <= length; i++) {
    const cx = x + i;
    if (
      !isCellEmptyOrOutOfBounds(board, cx, y) ||
      !isCellEmptyOrOutOfBounds(board, cx, y - 1) ||
      !isCellEmptyOrOutOfBounds(board, cx, y + 1)
    )
      return false;
  }
  return true;
};

const canPlaceVertical = (board: Board, x: number, y: number, length: number): boolean => {
  if (y + length > BOARD_SIZE_Y) return false;

  for (let i = -1; i <= length; i++) {
    const cy = y + i;
    if (
      !isCellEmptyOrOutOfBounds(board, x, cy) ||
      !isCellEmptyOrOutOfBounds(board, x - 1, cy) ||
      !isCellEmptyOrOutOfBounds(board, x + 1, cy)
    )
      return false;
  }
  return true;
};

export const canPlaceShip = (board: Board, x: number, y: number, length: number, horizontal: boolean): boolean => {
  return horizontal ? canPlaceHorizontal(board, x, y, length) : canPlaceVertical(board, x, y, length);
};

export const placeShip = (
  board: Board,
  x: number,
  y: number,
  length: number,
  horizontal: boolean,
  name: string
): Ship => {
  const coordinates = [];

  if (horizontal) {
    for (let i = 0; i < length; i++) {
      board[x + i].row[y].mode = CellMode.Occupied;
      coordinates.push({ x: x + i, y: y });
    }
  } else {
    for (let i = 0; i < length; i++) {
      board[x].row[y + i].mode = CellMode.Occupied;
      coordinates.push({ x, y: y + i });
    }
  }

  return {
    id: generateUUID(),
    name,
    coordinates,
    orientation: +horizontal,
    destroyed: false
  };
};
