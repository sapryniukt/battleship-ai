import * as GameService from '~/services/battleship/GameService';
import * as PlayerService from '~/services/battleship/PlayerService';
import { BOARD_SIZE_X, BOARD_SIZE_Y, CellMode } from '~/constants/battleship';
import { useBattleshipGameSetup } from './useBattleshipGameSetup';
import type { Board, Cell, Person, Player, PlayerKey, Ship, ShipsStatusList } from '~/types/battleship';
import { useDebounceFn } from '@vueuse/core';

export const useBattleshipGame = () => {
  const players = reactive(new Map<string, Player>(PlayerService.getPlayers()));
  const activePlayer = ref<string>('');
  const winner = ref<string | null>(null);
  const setups = [0, 1].map(() => useBattleshipGameSetup(generateGameBoard()));
  const existingPlayer = PlayerService.getPlayer();
  const { alert } = useAlertDialog();

  function generateGameBoard(): [Board, Ship[]] {
    return GameService.placeShipsRandomly(GameService.initializeBoard());
  }

  const registerPlayer = (id: string, key: PlayerKey, name: string) => {
    const updatePlayer = (players: Map<string, Player>, data: Person): Map<string, Player> => {
      const { placedBoard, placedShips } = setups.pop() ?? useBattleshipGameSetup(generateGameBoard());
      const [board, setBoard] = placedBoard;
      const [ships, setShips] = placedShips;

      return players.set(data.id, {
        ...data,
        board,
        setBoard,
        ships,
        setShips
      });
    };

    if (id && !players.has(id)) {
      updatePlayer(players, { id, key, name, winCount: 0 });
    } else {
      const player = players.get(id);

      if (player) {
        updatePlayer(players, { ...player, name, key });
      }
    }

    PlayerService.savePlayers(Array.from(players.entries()));

    if (!activePlayer.value) {
      activePlayer.value = id;
    }
  };

  const togglePlayer = () => {
    const playerArray = Array.from(players.keys());
    const currentIndex = playerArray.indexOf(activePlayer.value);
    const nextIndex = (currentIndex + 1) % playerArray.length;
    queueMicrotask(() => {
      activePlayer.value = playerArray[nextIndex];
    });

    useDebounceFn(() => {
      eventBus.emit('rotate-camera', nextIndex ? Math.PI : 0);
    }, 100)();
  };

  const areAllShipsDestroyed = (player: Player): boolean => {
    return player.ships.every((ship) => ship.destroyed);
  };

  const hitOpponent = (value: Cell) => {
    const player = players.get(activePlayer.value);

    if (player) {
      const { board, setBoard } = player;
      const { ships, setShips } = player;

      const [hitCell, hitShip] = GameService.hitCell(board, ships, value);
      eventBus.emit(`game:hit:${player.key}`, { player, coordinate: value.coordinate, hit: hitCell });
      if (hitShip) {
        eventBus.emit(`game:sink:${player.key}`, { player, ship: hitShip });
      }

      setBoard([...board]);
      setShips([...ships]);

      if (areAllShipsDestroyed(player)) {
        winner.value = activePlayer.value;
        return;
      }

      if (value.mode !== CellMode.Damaged) {
        togglePlayer();
      }
    }
  };

  const getPlayerData = (id: string): Player | undefined => {
    return players.get(id);
  };

  const createNewGame = () => {
    players.forEach((player) => {
      const [newBoard, newShips] = generateGameBoard();
      let winCount = player.winCount;

      if (player.id === winner.value) {
        winCount++;
        winner.value = null;
      }

      players.set(player.id, {
        ...player,
        winCount,
        board: newBoard,
        ships: newShips
      });

      PlayerService.savePlayers(Array.from(players.entries()));
    });
  };

  const reset = () => {
    createNewGame();
    togglePlayer();
  };

  // Auto-reset after a winner is declared
  watch(winner, () => {
    const timeout = setTimeout(async () => {
      if (winner.value) {
        await alert(`${players.get(activePlayer.value)?.name} wins!`);
        eventBus.emit('game:reset');
      }
    }, 400);

    return () => clearTimeout(timeout);
  });

  eventBus.on('game:reset', reset);

  onUnmounted(() => {
    eventBus.off('game:reset', reset);
  });

  return {
    players,
    activePlayer,
    existingPlayer,
    winner,
    registerPlayer,
    getPlayerData,
    hitOpponent,
    createNewGame
  };
};

export const useShipsStatusList = (board: Board): ShipsStatusList => {
  const damaged = [];
  const missed = [];
  const valid = [];
  for (let x = 0; x < BOARD_SIZE_X; x++) {
    for (let y = 0; y < BOARD_SIZE_Y; y++) {
      const cell = board[x].row[y];
      switch (cell.mode) {
        case CellMode.Damaged:
          damaged.push({ x, y });
          break;
        case CellMode.Missed:
          missed.push({ x, y });
          break;
        default:
          valid.push({ x, y });
          break;
      }
    }
  }

  return { damaged, missed, valid };
};
