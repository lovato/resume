#!/usr/bin/env node
/**
 * Builds public/resume.txt from resume.mdx for ATS paste / upload.
 * Strips MDX syntax; keeps readable plain text.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/content/resume.mdx'), 'utf8');

let text = source;

// Frontmatter → header lines
const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n/);
if (fmMatch) {
  const fm = fmMatch[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
  const name = get('name');
  const title = get('title');
  const location = get('location');
  const email = get('email');
  const phone = get('phone');
  const linkedin = get('linkedin');
  text = [
    name,
    title,
    `${location} | ${phone}`,
    `${email} | ${linkedin}`,
    '',
  ].join('\n');
}

// Body: drop imports and MDX/HTML wrappers
let body = source.replace(/^---[\s\S]*?---\n/, '');
body = body
  .replace(/^import .+$/gm, '')
  .replace(/<header[^>]*>|<\/header>/g, '')
  .replace(/<Contact[^/]*\/>/g, '')
  .replace(/#\s*\{frontmatter\.name\}\s*/g, '')
  .replace(/<p class="tagline">\{frontmatter\.tagline\}<\/p>\s*/g, '')
  .replace(/<Section title="([^"]+)">/g, '\n$1\n' + '='.repeat(40) + '\n')
  .replace(/<\/Section>/g, '\n')
  .replace(/<Entry\s+([^>]+)\/?>/g, (_, attrs) => formatEntry(attrs, false))
  .replace(/<Entry\s+([^>]+)>([\s\S]*?)<\/Entry>/g, (_, attrs, inner) => formatEntry(attrs, true, inner))
  .replace(/<\/?[A-Za-z][^>]*>/g, '')
  .replace(/\{frontmatter\.[^}]+\}/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

text = text ? `${text}\n\n${body}` : body;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'resume.txt'), text + '\n', 'utf8');
console.log('Wrote public/resume.txt');

function formatEntry(attrs, hasBody, inner = '') {
  const role = attr(attrs, 'role') ?? attr(attrs, 'title') ?? '';
  const company = attr(attrs, 'company') ?? attr(attrs, 'org') ?? '';
  const dates = attr(attrs, 'dates') ?? '';
  const location = attr(attrs, 'location') ?? '';
  const dateLine = location ? `${dates} | ${location}` : dates;
  const bullets = hasBody
    ? inner
        .replace(/^\s*[-*]\s+/gm, '  - ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    : '';
  return `\n${role}\n${company}\n${dateLine}\n${bullets ? bullets + '\n' : ''}`;
}

function attr(attrs, name) {
  return attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}
