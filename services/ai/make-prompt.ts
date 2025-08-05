import mustache from 'mustache';
import { readTemplate } from '~/server/utils/templates/readTemplate';

export async function makePrompt(options: object): Promise<string> {
  const prompt = mustache.render(
    await readTemplate('prompt.mustache'),
    options,
    {},
    { escape: (value: string) => value }
  );

  return prompt;
}
