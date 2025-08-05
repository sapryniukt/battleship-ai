import type { Board, Coordinate, LLMResponse } from '~/types/battleship';

export interface LLMProvider {
  name: string;
  model: string;
  suggestMove(
    board: Board,
    context: GameContext,
    model: string
  ): Promise<LLMResponse>;
  getConfidence(): number;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMAnalysis {
  boardState: {
    hits: Coordinate[];
    misses: Coordinate[];
    potentialShips: ShipProbability[];
  };
  suggestedMoves: SuggestedMove[];
  strategy: 'hunt' | 'target' | 'finish';
}

export interface SuggestedMove {
  coordinate: Coordinate;
  probability: number;
}

export interface ShipProbability {
  startCoordinate: Coordinate;
  orientation: 'horizontal' | 'vertical';
  length: number;
  probability: number;
}

export interface GameContext {
  moveHistory: Coordinate[];
  lastHits: Coordinate[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  turnNumber: number;
}

// LLM Provider Registry
const llmProviders = new Map<string, LLMProvider>();

export function registerLLMProvider(provider: LLMProvider) {
  llmProviders.set(provider.name, provider);
}

export function getLLMProvider(name: string): LLMProvider | undefined {
  return llmProviders.get(name);
}

export function getAvailableLLMProviders(): string[] {
  return Array.from(llmProviders.keys());
}
