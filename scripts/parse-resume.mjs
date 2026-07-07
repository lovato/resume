/**
 * Parses resume.mdx into structured data for export scripts.
 */
export function parseResume(source) {
  const header = parseFrontmatter(source);
  let body = source.replace(/^---[\s\S]*?---\n/, '');
  body = body
    .replace(/^import .+$/gm, '')
    .replace(/<header[\s\S]*?<\/header>/g, '')
    .trim();

  const sections = [];
  const sectionRe = /<Section title="([^"]+)">([\s\S]*?)<\/Section>/g;
  let match = sectionRe.exec(body);
  while (match) {
    sections.push(parseSection(match[1], match[2]));
    match = sectionRe.exec(body);
  }

  return { header, sections };
}

export function toPlainText({ header, sections }) {
  const lines = [
    header.name,
    header.title,
    `${header.location} | ${header.phone}`,
    `${header.email} | ${header.linkedin}`,
    '',
  ];

  for (const section of sections) {
    lines.push(section.title, '='.repeat(40), '');
    appendSectionContent(lines, section);
    lines.push('');
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function appendSectionContent(lines, section) {
  for (const p of section.paragraphs) lines.push(p, '');
  for (const entry of section.entries) {
    lines.push(entry.role, entry.company, formatDateLine(entry), '');
    for (const p of entry.paragraphs) lines.push(p, '');
    for (const b of entry.bullets) lines.push(`  - ${b}`);
    lines.push('');
  }
  for (const b of section.bullets) lines.push(`- ${b}`);
}

function parseSection(title, content) {
  const entries = [];
  let rest = content;

  rest = rest.replace(/<Entry\s+([^>]+)\/>/g, (_, attrs) => {
    entries.push(parseEntry(attrs, ''));
    return '\n';
  });

  rest = rest.replace(/<Entry\s+([^>]+)>([\s\S]*?)<\/Entry>/g, (_, attrs, inner) => {
    entries.push(parseEntry(attrs, inner));
    return '\n';
  });

  const { paragraphs, bullets } = parseMarkdownBlock(rest);
  return { title, entries, paragraphs, bullets };
}

function parseEntry(attrs, inner) {
  return {
    role: attr(attrs, 'role') ?? attr(attrs, 'title') ?? '',
    company: attr(attrs, 'company') ?? attr(attrs, 'org') ?? '',
    dates: attr(attrs, 'dates') ?? '',
    location: attr(attrs, 'location') ?? '',
    ...parseMarkdownBlock(inner),
  };
}

function parseMarkdownBlock(text) {
  const paragraphs = [];
  const bullets = [];
  const lines = text.replace(/<\/?[A-Za-z][^>]*>/g, '').split('\n');
  let current = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (current.length) {
        paragraphs.push(current.join(' ').trim());
        current = [];
      }
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)/);
    if (bullet) {
      if (current.length) {
        paragraphs.push(current.join(' ').trim());
        current = [];
      }
      bullets.push(stripMarkdown(bullet[1]));
      continue;
    }

    current.push(stripMarkdown(line));
  }

  if (current.length) paragraphs.push(current.join(' ').trim());
  return { paragraphs, bullets };
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function parseFrontmatter(source) {
  const fmMatch = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) {
    return { name: '', title: '', location: '', email: '', phone: '', linkedin: '' };
  }
  const fm = fmMatch[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
  return {
    name: get('name'),
    title: get('title'),
    location: get('location'),
    email: get('email'),
    phone: get('phone'),
    linkedin: get('linkedin'),
  };
}

function formatDateLine(entry) {
  return entry.location ? `${entry.dates} | ${entry.location}` : entry.dates;
}

function attr(attrs, name) {
  return attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}
