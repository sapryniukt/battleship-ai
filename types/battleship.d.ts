export type LLMProviders = 'openai' | 'claude' | 'gemini';
export interface BattleshipBoardProps {
  playerKey: PlayerKey;
  columns: number;
  rows: number;
  size: number;
  depth: number;
  gap: number;
  playerConfig: PlayerConfig | null;
  inverse?: boolean;
}

export interface BattleshipBoardFieldProps {
  size?: number;
  depth?: number;
  position?: VectorCoordinates;
  geometry?: unknown;
  material?: Material;
  onCellClick?: (cell: Cell) => void;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Cell {
  id: string;
  coordinate: Coordinate;
  mode: CellMode;
}

export interface Row {
  id: string;
  row: Cell[];
}

export type Board = Row[];

export interface Ship {
  id: string;
  name: string;
  coordinates: { x: number; y: number }[];
  orientation: Orientation;
  destroyed: boolean;
}

export type PlayerKey = 'player1' | 'player2';

export interface Player {
  id: string;
  name: string;
  key: PlayerKey;
  board: Board;
  ships: Ship[];
  winCount: number;

  setBoard: Dispatch<SetStateAction<Board>>;
  setShips: Dispatch<SetStateAction<Ship[]>>;
}

export type Person = Omit<Player, 'board' | 'setBoard' | 'ships' | 'setShips'>;

export type ShipStatus = Pick<Ship, 'id' | 'coordinates' | 'destroyed'> & {
  name: string;
  size: number;
};

export type ShipsStatusList = {
  damaged: Coordinate[];
  missed: Coordinate[];
  valid: Coordinate[];
};

export interface GameLog {
  id: number;
  player: Player;
  provider?: string;
  timestamp: Date;
  message: string;
  type: 'hit' | 'miss' | 'sink' | 'info';
}

export interface AIConfig {
  strategy: 'random' | 'hunt-target' | 'llm';
  provider?: LLMProviders;
  apiKey?: string;
  model?: string;
}

export interface BattleshipHitEvent {
  player: Player;
  coordinate: Coordinate;
  hit: boolean;
}

export interface BattleshipSinkEvent {
  player: Player;
  ship: Ship;
}

export interface BattleshipMistakeEvent {
  player: Player;
  coordinate: Coordinate;
  provider: LLMProviders;
}

export interface BattleshipLLMThinkingEvent {
  thought: string;
  provider: LLMProviders;
}

export interface PlayerConfig {
  key?: PlayerKey;
  name: string;
  useAI: boolean;
  aiStrategy: 'random' | 'hunt-target' | 'llm';
  llmProvider: LLMProviders;
  llmModel: string;
}

export interface LLMResponse {
  thought: string;
  strategy: string;
  coordinate: Coordinate;
}

export interface BattleshipPlayerConfig {
  key: PlayerKey;
  value: PlayerConfig;
  depth: number;
  inverse?: boolean;
}
