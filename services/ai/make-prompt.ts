import fs from 'fs';
import mustache from 'mustache';
import path from 'path';

export function makePrompt(options: object): string {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const template = fs.readFileSync(path.join(__dirname, 'prompt.mustache'), 'utf8');
  const prompt = mustache.render(template, options, {}, { escape: (value: string) => value });

  return prompt;
}
