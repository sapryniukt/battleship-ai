import type { LLMProvider, GameContext } from '~/services/battleship/LLMService';
import type { Board, LLMResponse } from '~/types/battleship';
import type { MoveResponse } from '../schemas/moveSchemas';
export class ClaudeProvider implements LLMProvider {
  name = 'claude';
  model = 'claude-sonnet-4-20250514';

  async suggestMove(board: Board, context: GameContext, model: string): Promise<LLMResponse> {
    const { damaged, missed, valid } = useShipsStatusList(board);

    const response = await $fetch('/api/ai/claude/move', {
      method: 'POST',
      body: {
        damaged,
        missed,
        valid,
        difficulty: context.difficulty,
        model
      }
    });

    return this.parseMoveResponse(response);
  }

  getConfidence(): number {
    return 0.95; // Claude with structured outputs has high confidence
  }

  private parseMoveResponse(response: { content: MoveResponse }): LLMResponse {
    const moveData = response.content;

    return {
      coordinate: {
        x: moveData.move.x,
        y: moveData.move.y
      },
      thought: moveData.thought,
      strategy: moveData.strategy
    };
  }
}
