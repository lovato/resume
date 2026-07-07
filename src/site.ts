/** Site identity — used for HTML meta, OG tags, and page title. */
export const site = {
  title: 'Marco Lovato',
  tagline: 'Senior Software Engineer | Architect & Lead Developer',
  description:
    'Resume of Marco Lovato — software architect and senior engineer with 15+ years in distributed systems, IoT platforms, and cloud-native architecture.',
  url: 'https://lovato.github.io/resume/',
  author: 'Marco Lovato',
  github: 'https://github.com/lovato/resume',
} as const;

export type SiteConfig = typeof site;
