#!/usr/bin/env node
/**
 * Fetches a job posting URL to plain text for job-fit analysis.
 * LinkedIn and other sites may block or return login walls — paste JD manually if needed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/fetch-job-posting.mjs <url>');
  console.error('   or: task job-fetch URL=<url>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '.job-analysis');
const outFile = join(outDir, 'current-posting.txt');

let html;
try {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  html = await res.text();
} catch (err) {
  console.error(`Fetch failed: ${err.message}`);
  process.exit(1);
}

const text = htmlToText(html);
const header = [`Source URL: ${url}`, `Fetched: ${new Date().toISOString()}`, '', '---', ''].join(
  '\n',
);

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, header + text + '\n', 'utf8');

console.log(`Wrote ${outFile} (${text.length} chars)`);

if (text.length < 400) {
  console.warn('Warning: very little text — page may be login-walled. Paste the job description in chat.');
} else if (/sign in|log in|join linkedin/i.test(text.slice(0, 2000))) {
  console.warn('Warning: login wall detected. Paste the job description in chat.');
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}
