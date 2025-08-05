import { describe, it, expect, beforeEach } from 'vitest';
import { markSurroundingAsMissed, markAxisAsMissed } from '~/utils/battleship/shipMarking';
import { CellMode, Orientation } from '~/constants/battleship';
import type { Board, Ship } from '~/types/battleship';

const BOARD_SIZE = 10;

const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE }, (_, x) => ({
    id: `row-${x}`,
    row: Array.from({ length: BOARD_SIZE }, (_, y) => ({
      id: `${x}-${y}`,
      coordinate: { x, y },
      mode: CellMode.Empty
    }))
  }));
};

describe('ship marking utils', () => {
  let board: Board;

  beforeEach(() => {
    board = createEmptyBoard();
  });

  it('marks all surrounding cells as missed (corner case)', () => {
    const ship: Ship = {
      id: 's1',
      name: 'Test Ship',
      coordinates: [{ x: 0, y: 0 }],
      orientation: Orientation.Horizontal,
      destroyed: true
    };

    board[0].row[0].mode = CellMode.Damaged;

    markSurroundingAsMissed(board, ship);

    const missedCoords = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];

    missedCoords.forEach(({ x, y }) => expect(board[x].row[y].mode).toBe(CellMode.Missed));
  });

  it('does not override non-empty surrounding cells', () => {
    board[1].row[0].mode = CellMode.Missed;
    const ship: Ship = {
      id: 's2',
      name: 'Test Ship',
      coordinates: [{ x: 0, y: 0 }],
      orientation: Orientation.Horizontal,
      destroyed: true
    };
    markSurroundingAsMissed(board, ship);
    expect(board[1].row[0].mode).toBe(CellMode.Missed);
  });

  it('marks horizontal axis cells as missed if partially damaged', () => {
    const ship: Ship = {
      id: 's3',
      name: 'Test Ship',
      coordinates: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 }
      ],
      orientation: Orientation.Horizontal,
      destroyed: false
    };

    board[5].row[5].mode = CellMode.Damaged;
    board[5].row[6].mode = CellMode.Damaged;

    markAxisAsMissed(board, ship);

    expect(board[5].row[4].mode).toBe(CellMode.Missed);
    expect(board[5].row[7].mode).toBe(CellMode.Missed);
  });

  it('marks vertical axis cells as missed if partially damaged', () => {
    const ship: Ship = {
      id: 's4',
      name: 'Test Ship',
      coordinates: [
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 5, y: 3 }
      ],
      orientation: Orientation.Vertical,
      destroyed: false
    };

    board[4].row[3].mode = CellMode.Damaged;
    board[5].row[3].mode = CellMode.Damaged;

    markAxisAsMissed(board, ship);

    expect(board[3].row[3].mode).toBe(CellMode.Missed);
    expect(board[6].row[3].mode).toBe(CellMode.Missed);
  });

  it('does not mark axis cells if only one cell is damaged', () => {
    const ship: Ship = {
      id: 's5',
      name: 'Test Ship',
      coordinates: [
        { x: 7, y: 2 },
        { x: 7, y: 3 }
      ],
      orientation: Orientation.Horizontal,
      destroyed: false
    };

    board[7].row[2].mode = CellMode.Damaged;

    markAxisAsMissed(board, ship);

    expect(board[7].row[1].mode).toBe(CellMode.Empty);
    expect(board[7].row[3].mode).toBe(CellMode.Empty);
  });

  it('marks opposite vertical neighbors as missed when two vertical cells are damaged', () => {
    const ship: Ship = {
      id: 's6',
      name: 'Test Ship',
      coordinates: [
        { x: 4, y: 2 },
        { x: 4, y: 3 },
        { x: 4, y: 4 }
      ],
      orientation: Orientation.Vertical,
      destroyed: false
    };

    board[4].row[2].mode = CellMode.Damaged;
    board[4].row[3].mode = CellMode.Damaged;

    markAxisAsMissed(board, ship);

    expect(board[3].row[2].mode).toBe(CellMode.Missed);
    expect(board[5].row[2].mode).toBe(CellMode.Missed);
    expect(board[3].row[3].mode).toBe(CellMode.Missed);
    expect(board[5].row[3].mode).toBe(CellMode.Missed);
  });

  it('marks opposite horizontal neighbors as missed when two horizontal cells are damaged', () => {
    const ship: Ship = {
      id: 's7',
      name: 'Test Ship',
      coordinates: [
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 }
      ],
      orientation: Orientation.Horizontal,
      destroyed: false
    };

    board[2].row[5].mode = CellMode.Damaged;
    board[3].row[5].mode = CellMode.Damaged;

    markAxisAsMissed(board, ship);

    expect(board[2].row[4].mode).toBe(CellMode.Missed);
    expect(board[2].row[6].mode).toBe(CellMode.Missed);
    expect(board[3].row[4].mode).toBe(CellMode.Missed);
    expect(board[3].row[6].mode).toBe(CellMode.Missed);
  });
});
