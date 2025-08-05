import type { Board, Ship } from '~/types/battleship';

type GameSetup = {
  placedBoard: [Board, (value: Board) => void];
  placedShips: [Ship[], (value: Ship[]) => void];
};

export const useBattleshipGameSetup = ([placedBoard, placedShips]: [Board, Ship[]]): GameSetup => {
  const board = ref<Board>(placedBoard);
  const ships = ref<Ship[]>(placedShips);

  const setBoard = (newBoard: Board) => {
    board.value = newBoard;
  };

  const setShips = (newShips: Ship[]) => {
    ships.value = newShips;
  };

  return {
    placedBoard: [board.value, setBoard],
    placedShips: [ships.value, setShips]
  };
};
