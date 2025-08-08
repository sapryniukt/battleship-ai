import { OpenAI } from 'openai';
import z from 'zod';
import { makePrompt } from '~/services/ai/make-prompt';
import { moveResponseSchema } from '~/services/battleship/schemas/moveSchemas';

export default defineEventHandler(async (event) => {
  const { model, ...options } = await readBody(event);
  const config = useRuntimeConfig();

  const prompt = await makePrompt({ ...options });

  try {
    const openai = await new OpenAI({ apiKey: config.private.openaiApiKey });
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Battleship player. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'battleship_move', schema: z.toJSONSchema(moveResponseSchema) }
      }
    });

    const parsedMove = moveResponseSchema.parse(JSON.parse(completion.choices[0].message.content ?? '{}'));

    return {
      content: parsedMove,
      usage: completion.usage
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API Error',
      data: error
    });
  }
});
