import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('templates');
const destinations: string[] = [];

if (process.env.NODE_ENV === 'production') {
  destinations.push(path.resolve('.output/server'), path.resolve('.vercel/output/functions/__nitro.func'));
} else {
  destinations.push(path.resolve('.nuxt/dev'));
}

export function copyMustacheTemplates() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.mustache'));

  for (const destDir of destinations) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    for (const file of files) {
      const src = path.join(sourceDir, file);
      const dest = path.join(destDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to ${dest}`);
    }
  }
}

copyMustacheTemplates();

export default {
  copyMustacheTemplates
};
