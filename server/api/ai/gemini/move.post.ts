import { GoogleGenAI } from '@google/genai';
import z from 'zod';
import { makePrompt } from '~/services/ai/make-prompt';
import { moveResponseSchema } from '~/services/battleship/schemas/moveSchemas';

export default defineEventHandler(async (event) => {
  const { model, ...options } = await readBody(event);
  const config = useRuntimeConfig();

  const prompt = await makePrompt({ ...options });

  try {
    const ai = new GoogleGenAI({ apiKey: config.private.googleAiApiKey });

    const completion = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 300,
        topP: 0.8,
        responseMimeType: 'application/json',
        responseSchema: z.toJSONSchema(moveResponseSchema)
      }
    });

    const content = JSON.parse(completion.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}');

    const parsedMove = moveResponseSchema.parse(content);

    return {
      content: parsedMove,
      usage: {
        totalTokens: completion.usageMetadata?.totalTokenCount || 0
      },
      model
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API Error',
      data: error
    });
  }
});
