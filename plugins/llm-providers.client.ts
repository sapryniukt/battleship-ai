import { registerLLMProvider } from '~/services/battleship/LLMService';
import { OpenAIProvider } from '~/services/battleship/providers/OpenAIProvider';
import { ClaudeProvider } from '~/services/battleship/providers/ClaudeProvider';
import { GeminiProvider } from '~/services/battleship/providers/GeminiProvider';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Register LLM providers
  if (config.public.openaiEnabled) {
    registerLLMProvider(new OpenAIProvider());
  }

  if (config.public.anthropicEnabled) {
    registerLLMProvider(new ClaudeProvider());
  }

  if (config.public.googleAiEnabled) {
    registerLLMProvider(new GeminiProvider());
  }
});
