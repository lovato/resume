#!/usr/bin/env node
/**
 * Bundles workflow + resume + job posting into one prompt for any LLM.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '.job-analysis');
const outFile = join(outDir, 'prompt.md');

const workflow = read(join(root, 'job-fit/workflow.md'));
const template = read(join(root, 'job-fit/report-template.md'));
const resumePath = join(root, 'public/resume.txt');
const postingPath = join(outDir, 'current-posting.txt');

if (!existsSync(resumePath)) {
  console.error('Missing public/resume.txt — run: task export-txt');
  process.exit(1);
}

if (!existsSync(postingPath)) {
  console.error('Missing .job-analysis/current-posting.txt');
  console.error('Run: task job-fetch URL=\'...\'  or paste the JD into that file.');
  process.exit(1);
}

const resume = read(resumePath);
const posting = read(postingPath);

const prompt = `# Job fit analysis request

You are evaluating whether the candidate is a fit for the job described below.

Follow the workflow and produce a report using the template at the end.

---

## Workflow

${workflow}

---

## Candidate resume

\`\`\`
${resume.trim()}
\`\`\`

---

## Job posting

\`\`\`
${posting.trim()}
\`\`\`

---

## Report template (use this structure for your answer)

${template}
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, prompt, 'utf8');
console.log(`Wrote ${outFile}`);
console.log('Copy the file contents into any LLM, or point your agent at it.');

function read(path) {
  return readFileSync(path, 'utf8');
}
