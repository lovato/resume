#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { parseResume, toPlainText } from './parse-resume.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/content/resume.mdx'), 'utf8');
const outDir = join(root, 'public');

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'resume.txt'), toPlainText(parseResume(source)), 'utf8');
console.log('Wrote public/resume.txt');
