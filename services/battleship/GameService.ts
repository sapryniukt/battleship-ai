import { generateUUID } from 'three/src/math/MathUtils.js';
import { shipLengths } from '~/config/ships';
import { BOARD_SIZE_X, BOARD_SIZE_Y, CellMode } from '~/constants/battleship';
import type { Board, Cell, Row, Ship } from '~/types/battleship';
import { canPlaceShip, placeShip } from '~/utils/battleship/shipGeneration';
import { markAxisAsMissed, markSurroundingAsMissed } from '~/utils/battleship/shipMarking';

export function initializeBoard(): Board {
  return new Array(BOARD_SIZE_X).fill(0).map(
    (_, x): Row => ({
      id: `row-${generateUUID()}`,
      row: new Array(BOARD_SIZE_Y).fill(0).map(
        (_, y): Cell => ({
          id: `col-${generateUUID()}`,
          coordinate: { x, y },
          mode: CellMode.Empty
        })
      )
    })
  );
}

export function placeShipsRandomly(board: Board): [Board, Ship[]] {
  const list = shipLengths.entries();
  const placedShips: Ship[] = [];

  let [name, length] = list.next().value ?? [];

  while (length) {
    let placed = false;

    while (!placed) {
      const horizontal = Math.random() > 0.5;
      const x = Math.floor(Math.random() * BOARD_SIZE_X);
      const y = Math.floor(Math.random() * BOARD_SIZE_Y);

      if (canPlaceShip(board, x, y, length, horizontal)) {
        placedShips.push(placeShip(board, x, y, length, horizontal, name!));
        placed = true;
      }
    }

    [name, length] = list.next().value ?? [];
  }

  return [board, placedShips];
}

function isShipDestroyed(board: Board, ship: Ship): boolean {
  return ship.coordinates.every((coord) => board[coord.x].row[coord.y].mode === CellMode.Damaged);
}

export function hitCell(board: Board, ships: Ship[], value: Cell): [boolean, Ship | null] {
  const { x, y } = value.coordinate;

  const hitMode = board[x].row[y].mode === CellMode.Occupied;

  board[x].row[y].mode = hitMode ? CellMode.Damaged : CellMode.Missed;

  if (hitMode) {
    const hitShip = ships.find((ship) => ship.coordinates.some((coord) => coord.x === x && coord.y === y));

    if (hitShip) {
      if (isShipDestroyed(board, hitShip)) {
        markSurroundingAsMissed(board, hitShip);
        hitShip.destroyed = true;
        return [hitMode, hitShip];
      } else {
        markAxisAsMissed(board, hitShip);
      }
    }
  }

  return [hitMode, null];
}
