#!/usr/bin/env node
/**
 * Builds public/resume.docx — ATS-friendly Word export from resume.mdx.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { parseResume } from './parse-resume.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/content/resume.mdx'), 'utf8');
const resume = parseResume(source);

const BULLET_REF = 'resume-bullets';

const children = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: resume.header.name, bold: true })],
  }),
  new Paragraph({
    children: [new TextRun({ text: resume.header.title, bold: true })],
  }),
  new Paragraph({
    children: [
      new TextRun(`${resume.header.location} | ${resume.header.phone}`),
    ],
  }),
  new Paragraph({
    children: [
      new TextRun(resume.header.email),
      new TextRun(' | '),
      new TextRun(resume.header.linkedin),
    ],
  }),
  new Paragraph({ children: [new TextRun('')] }),
];

for (const section of resume.sections) {
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: section.title, bold: true })],
    }),
  );

  for (const paragraph of section.paragraphs) {
    children.push(bodyParagraph(paragraph));
  }

  for (const entry of section.entries) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: entry.role, bold: true })],
      }),
    );
    children.push(
      new Paragraph({
        children: [new TextRun({ text: entry.company, bold: true })],
      }),
    );
    children.push(
      new Paragraph({
        children: [new TextRun(formatDateLine(entry))],
      }),
    );

    for (const paragraph of entry.paragraphs) {
      children.push(bodyParagraph(paragraph));
    }

    for (const bullet of entry.bullets) {
      children.push(bulletParagraph(bullet));
    }
  }

  for (const bullet of section.bullets) {
    children.push(bulletParagraph(bullet));
  }
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: BULLET_REF,
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 },
              },
            },
          },
        ],
      },
    ],
  },
  sections: [{ children }],
});

const buffer = await Packer.toBuffer(doc);
const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'resume.docx'), buffer);
console.log('Wrote public/resume.docx');

function bodyParagraph(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun(text)],
  });
}

function bulletParagraph(text) {
  return new Paragraph({
    numbering: { reference: BULLET_REF, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun(text)],
  });
}

function formatDateLine(entry) {
  return entry.location ? `${entry.dates} | ${entry.location}` : entry.dates;
}
