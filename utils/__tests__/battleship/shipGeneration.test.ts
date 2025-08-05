import { describe, it, expect, beforeEach } from 'vitest';
import { canPlaceShip, placeShip } from '~/utils/battleship/shipGeneration';
import { CellMode } from '~/constants/battleship';
import type { Board } from '~/types/battleship';

const BOARD_SIZE_X = 10;
const BOARD_SIZE_Y = 10;

const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE_X }, (_, x) => ({
    id: `row-${x}`,
    row: Array.from({ length: BOARD_SIZE_Y }, (_, y) => ({
      id: `${x}-${y}`,
      coordinate: { x, y },
      mode: CellMode.Empty
    }))
  }));
};

describe('canPlaceShip', () => {
  let board: Board;

  beforeEach(() => {
    board = createEmptyBoard();
  });

  it('allows placing a ship horizontally when space is clear', () => {
    expect(canPlaceShip(board, 0, 0, 3, true)).toBe(true);
  });

  it('denies placing a ship horizontally when out of bounds', () => {
    expect(canPlaceShip(board, 9, 0, 3, true)).toBe(false); // 9 + 3 > 10
  });

  it('denies placing a ship horizontally when space is occupied', () => {
    board[1].row[0].mode = CellMode.Occupied;
    expect(canPlaceShip(board, 0, 0, 3, true)).toBe(false);
  });

  it('allows placing a ship vertically when space is clear', () => {
    expect(canPlaceShip(board, 0, 0, 3, false)).toBe(true);
  });

  it('denies placing a ship vertically when out of bounds', () => {
    expect(canPlaceShip(board, 0, 9, 3, false)).toBe(false); // 9 + 3 > 10
  });

  it('denies placing a ship vertically when adjacent cells are occupied', () => {
    board[0].row[1].mode = CellMode.Occupied;
    expect(canPlaceShip(board, 0, 0, 3, false)).toBe(false);
  });

  it('allows placing at edge of board if it fits', () => {
    expect(canPlaceShip(board, 7, 0, 3, true)).toBe(true); // fits exactly
  });
});

describe('placeShip', () => {
  let board: Board;

  beforeEach(() => {
    board = createEmptyBoard();
  });

  it('places a ship horizontally and returns correct metadata', () => {
    const ship = placeShip(board, 2, 2, 3, true, 'Test Ship');
    expect(ship.coordinates).toEqual([
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 }
    ]);
    expect(ship.orientation).toBe(1);
    for (const { x, y } of ship.coordinates) {
      expect(board[x].row[y].mode).toBe(CellMode.Occupied);
    }
  });

  it('places a ship vertically and returns correct metadata', () => {
    const ship = placeShip(board, 5, 1, 2, false, 'Test Ship');
    expect(ship.coordinates).toEqual([
      { x: 5, y: 1 },
      { x: 5, y: 2 }
    ]);
    expect(ship.orientation).toBe(0);
    for (const { x, y } of ship.coordinates) {
      expect(board[x].row[y].mode).toBe(CellMode.Occupied);
    }
  });

  it('assigns a unique UUID', () => {
    const ship1 = placeShip(board, 0, 0, 1, true, 'Test Ship 1');
    const ship2 = placeShip(board, 0, 2, 1, true, 'Test Ship 2');
    expect(ship1.id).not.toBe(ship2.id);
  });

  it('marks ship as not destroyed initially', () => {
    const ship = placeShip(board, 1, 1, 2, true, 'Test Ship');
    expect(ship.destroyed).toBe(false);
  });
});
