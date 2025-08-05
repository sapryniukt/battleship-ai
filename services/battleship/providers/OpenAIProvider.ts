import type { Board, LLMResponse } from '~/types/battleship';
import type { LLMProvider, GameContext } from '../LLMService';
import { BOARD_SIZE_X, BOARD_SIZE_Y } from '~/constants/battleship';
import type { MoveResponse } from '../schemas/moveSchemas';

export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  model = 'gpt-4o-mini';

  async suggestMove(board: Board, context: GameContext, model: string): Promise<LLMResponse> {
    const { damaged, missed, valid } = useShipsStatusList(board);

    const response = await $fetch('/api/ai/openai/move', {
      method: 'POST',
      body: {
        damaged,
        missed,
        valid,
        difficulty: context.difficulty,
        model,
        temperature: 0.3
      }
    });

    return this.parseMoveResponse(response);
  }

  getConfidence(): number {
    return 0.95;
  }

  private parseMoveResponse(response: { content: string | MoveResponse }): LLMResponse {
    try {
      const content = typeof response.content === 'string' ? JSON.parse(response.content) : response.content;
      const x = parseInt(content.move.x);
      const y = parseInt(content.move.y);

      if (isNaN(x) || isNaN(y) || x < 0 || x >= BOARD_SIZE_X || y < 0 || y >= BOARD_SIZE_Y) {
        throw new Error('Invalid coordinates');
      }

      return { coordinate: { x, y }, thought: content.thought, strategy: content.strategy };
    } catch (error) {
      console.error('Failed to parse Gemini move response:', error);
      throw new Error('Failed to parse Gemini response');
    }
  }
}
