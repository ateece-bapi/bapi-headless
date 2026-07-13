#!/usr/bin/env node
/**
 * Storybook Story Count Audit
 *
 * Counts all story variations (named exports) across *.stories.tsx files
 * and reports a per-file breakdown plus the grand total.
 *
 * Usage:
 *   pnpm run storybook:audit
 *
 * Run quarterly to keep README story counts accurate.
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STORIES_DIR = join(__dirname, '..', 'src', 'stories');

/** Matches story exports: `export const Foo` (one per story variation) */
const NAMED_EXPORT_RE = /^export\s+const\s+\w+/gm;

async function findStoryFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findStoryFiles(full)));
    } else if (entry.name.endsWith('.stories.tsx') || entry.name.endsWith('.stories.ts')) {
      files.push(full);
    }
  }
  return files;
}

async function countStories(filePath) {
  const src = await readFile(filePath, 'utf8');
  return [...src.matchAll(NAMED_EXPORT_RE)].length;
}

async function main() {
  let files;
  try {
    files = await findStoryFiles(STORIES_DIR);
  } catch {
    console.error(`Could not read stories directory: ${STORIES_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('No story files found.');
    process.exit(0);
  }

  const rows = [];
  let total = 0;

  for (const file of files.sort()) {
    const count = await countStories(file);
    total += count;
    rows.push({ file: relative(join(__dirname, '..'), file), count });
  }

  const maxLen = Math.max(...rows.map((r) => r.file.length), 'File'.length);
  const header = `${'File'.padEnd(maxLen)}  Stories`;
  const divider = '-'.repeat(header.length);

  console.log('\nStorybook Story Count Audit');
  console.log(divider);
  console.log(header);
  console.log(divider);
  for (const { file, count } of rows) {
    console.log(`${file.padEnd(maxLen)}  ${count}`);
  }
  console.log(divider);
  console.log(`${'TOTAL'.padEnd(maxLen)}  ${total}`);
  console.log();
  console.log(
    `Update README.md "story variations" count to ${total} if it differs from the current value.`
  );
}

main();
