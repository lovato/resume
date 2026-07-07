#!/usr/bin/env node
/**
 * Bundles workflow + resume + optional private profile + job posting into one prompt.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '.job-analysis');
const outFile = join(outDir, 'prompt.md');
const profilePath = join(root, 'private/career-profile.yaml');

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
const profileSection = buildProfileSection();

const prompt = `# Job fit analysis request

You are evaluating whether the candidate is a fit for the job described below.

Follow the workflow and produce a report using the template at the end.

---

## Workflow

${workflow}

---

## Candidate resume (public)

\`\`\`
${resume.trim()}
\`\`\`
${profileSection}
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
if (!profileSection) {
  console.warn('Note: no private profile included (missing or git-crypt locked).');
}
console.log('Copy the file contents into any LLM, or point your agent at it.');

function buildProfileSection() {
  if (!existsSync(profilePath)) {
    return '\n';
  }
  const raw = readFileSync(profilePath);
  if (raw.slice(0, 8).toString() === 'GITCRYPT') {
    console.warn('private/career-profile.yaml is encrypted — run: git crypt unlock <key-file>');
    return '\n';
  }
  const text = raw.toString('utf8').trim();
  if (!text) return '\n';
  return `
---

## Private career profile (confidential — not on public resume)

\`\`\`yaml
${text}
\`\`\`
`;
}

function read(path) {
  return readFileSync(path, 'utf8');
}
