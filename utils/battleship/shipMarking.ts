import { CellMode, Orientation } from '~/constants/battleship';
import type { Board, Ship, Coordinate } from '~/types/battleship';

function getPartialyDestroyedShip(board: Board, ship: Ship): Coordinate[] {
  return ship.coordinates.filter((coord) => board[coord.x].row[coord.y].mode === CellMode.Damaged);
}

export function markSurroundingAsMissed(board: Board, ship: Ship) {
  const surroundingCells: Coordinate[] = [];

  ship.coordinates.forEach(({ x, y }) => {
    if (x > 0) surroundingCells.push({ x: x - 1, y });
    if (x < 9) surroundingCells.push({ x: x + 1, y });
    if (y > 0) surroundingCells.push({ x, y: y - 1 });
    if (y < 9) surroundingCells.push({ x, y: y + 1 });

    // Add diagonal cells to ensure there's a safety margin around the ship
    if (x > 0 && y > 0) surroundingCells.push({ x: x - 1, y: y - 1 });
    if (x < 9 && y > 0) surroundingCells.push({ x: x + 1, y: y - 1 });
    if (x > 0 && y < 9) surroundingCells.push({ x: x - 1, y: y + 1 });
    if (x < 9 && y < 9) surroundingCells.push({ x: x + 1, y: y + 1 });
  });

  surroundingCells.forEach(({ x, y }) => {
    const currentMode = board[x].row[y].mode;
    if (currentMode === CellMode.Empty) {
      board[x].row[y].mode = CellMode.Missed;
    }
  });
}

export function markAxisAsMissed(board: Board, ship: Ship) {
  const partialyDestroyedShip = getPartialyDestroyedShip(board, ship);

  if (partialyDestroyedShip.length > 1) {
    partialyDestroyedShip.forEach(({ x, y }) => {
      if (ship.orientation === Orientation.Horizontal) {
        if (y > 0) board[x].row[y - 1].mode = CellMode.Missed;
        if (y < 9) board[x].row[y + 1].mode = CellMode.Missed;
      } else {
        if (x > 0) board[x - 1].row[y].mode = CellMode.Missed;
        if (x < 9) board[x + 1].row[y].mode = CellMode.Missed;
      }
    });
  }
}
