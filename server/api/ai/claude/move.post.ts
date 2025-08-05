import Anthropic from '@anthropic-ai/sdk';
import { Tool } from '@anthropic-ai/sdk/resources/messages';
import { moveResponseSchema } from '~/services/battleship/schemas/moveSchemas';
import z from 'zod';
import { makePrompt } from '~/services/ai/make-prompt';

export default defineEventHandler(async (event) => {
  const { model = 'claude-3-haiku-20240307', ...options } = await readBody(event);
  const config = useRuntimeConfig();

  const prompt = await makePrompt({ ...options });

  try {
    const client = new Anthropic({
      apiKey: config.private.anthropicApiKey
    });

    const response = await client.messages.create({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      tools: [
        {
          name: 'suggest_move',
          description: 'Suggest the best next move in Battleship',
          input_schema: z.toJSONSchema(moveResponseSchema) as Tool.InputSchema
        }
      ],
      tool_choice: {
        name: 'suggest_move',
        type: 'tool'
      }
    });

    // Find the tool use in the response
    const toolUse = response.content.find((c) => c.type === 'tool_use');

    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('No tool use found in Claude response');
    }

    // Parse and validate the response
    const parsedMove = moveResponseSchema.parse(toolUse.input);

    return {
      content: parsedMove,
      usage: response.usage,
      model: response.model
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Claude API Error',
      data: error
    });
  }
});
