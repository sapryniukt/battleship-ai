import { BOARD_SIZE_X, BOARD_SIZE_Y, CellMode } from '~/constants/battleship';
import { getLLMProvider, type GameContext } from './LLMService';
import type { Board, Coordinate, Cell, PlayerKey, LLMProviders } from '~/types/battleship';

export interface GuessingStrategy {
  guess(board: Board | undefined, key?: PlayerKey): Promise<Cell>;
  setLastHit?: (hit: Coordinate) => void;
  getName(): string;
}

export const useRandomGuessStrategy = (): GuessingStrategy => {
  const lastHit: Coordinate[] = [];

  async function guess(board: Board | undefined): Promise<Cell> {
    let x: number, y: number;

    do {
      x = Math.floor(Math.random() * BOARD_SIZE_X);
      y = Math.floor(Math.random() * BOARD_SIZE_Y);
    } while (board?.[x].row[y].mode !== CellMode.Empty && board?.[x].row[y].mode !== CellMode.Occupied);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(board[x].row[y]);
      }, 700);
    });
  }

  const setLastHit = (hit: Coordinate) => {
    lastHit.push(hit);
  };

  return {
    setLastHit,
    guess,
    getName() {
      return 'random';
    }
  };
};

export const useHuntTargetStrategy = (): GuessingStrategy => {
  const lastHit: Coordinate[] = [];

  const guess = async (board: Board): Promise<Cell> => {
    if (lastHit.length) {
      const potentialTargets: Cell[] = lastHit
        .map(({ x, y }) => [
          x > 0 ? board[x - 1].row[y] : null,
          x < BOARD_SIZE_X - 1 ? board[x + 1].row[y] : null,
          y > 0 ? board[x].row[y - 1] : null,
          y < BOARD_SIZE_Y - 1 ? board[x].row[y + 1] : null
        ])
        .flat()
        .filter(Boolean) as Cell[];

      const validTargets = potentialTargets.filter(
        (cell) => cell.mode === CellMode.Empty || cell.mode === CellMode.Occupied
      );

      if (validTargets.length > 0) {
        const chosenTarget = validTargets[Math.floor(Math.random() * validTargets.length)];

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(chosenTarget);
          }, 700);
        });
      }
    }

    // If no valid targets, fallback to random guessing
    const randomGuessStrategy = useRandomGuessStrategy();
    return await randomGuessStrategy.guess(board);
  };

  const setLastHit = (hit: Coordinate) => {
    lastHit.push(hit);
  };

  return {
    guess,
    setLastHit,
    getName() {
      return 'hunt';
    }
  };
};

export const guessCoordinate = async (
  board: Board | undefined,
  strategy: GuessingStrategy = useRandomGuessStrategy(),
  key?: PlayerKey
): Promise<Cell> => {
  return await strategy.guess(board, key);
};

export const useLLMStrategy = (providerName: LLMProviders, model: string): GuessingStrategy => {
  const lastHits: Coordinate[] = [];
  const moveHistory: Coordinate[] = [];
  let turnNumber = 0;

  const guess = async (board: Board | undefined, key: PlayerKey): Promise<Cell> => {
    if (!board) {
      throw new Error('Board is required for LLM strategy');
    }

    const provider = getLLMProvider(providerName);
    if (!provider) {
      console.warn(`LLM provider ${providerName} not found, falling back to hunt-target`);
      const fallback = useHuntTargetStrategy();
      return fallback.guess(board);
    }

    const context: GameContext = {
      moveHistory,
      lastHits,
      difficulty: 'medium', // This could be configurable
      turnNumber: turnNumber++
    };

    const { coordinate: suggestedCoordinate, thought } = await provider.suggestMove(board, context, model);

    // Validate the suggested move
    if (isValidMove(board, suggestedCoordinate)) {
      moveHistory.push(suggestedCoordinate);
      eventBus.emit(`game:llm:thinking:${key}`, { thought, provider: providerName });
      return board[suggestedCoordinate.x].row[suggestedCoordinate.y];
    } else {
      throw {
        coordinate: suggestedCoordinate,
        error: new Error('LLM suggested invalid move')
      };
    }
  };

  const setLastHit = (hit: Coordinate) => {
    lastHits.push(hit);
  };

  return {
    guess,
    setLastHit,
    getName() {
      return `llm-${providerName}`;
    }
  };
};

// Helper function to validate moves
function isValidMove(board: Board, coord: Coordinate): boolean {
  if (coord.x < 0 || coord.x >= BOARD_SIZE_X || coord.y < 0 || coord.y >= BOARD_SIZE_Y) {
    return false;
  }
  const cell = board[coord.x].row[coord.y];
  return cell.mode === CellMode.Empty || cell.mode === CellMode.Occupied;
}

// Strategy factory
export function createStrategy(type: string, options?: { provider?: LLMProviders; model?: string }): GuessingStrategy {
  switch (type) {
    case 'random':
      return useRandomGuessStrategy();
    case 'hunt-target':
      return useHuntTargetStrategy();
    case 'llm':
      return useLLMStrategy(options?.provider || 'openai', options?.model || 'gpt-4o-mini');
    default:
      return useRandomGuessStrategy();
  }
}
