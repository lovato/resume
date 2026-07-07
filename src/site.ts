/** Site identity — used for HTML meta, OG tags, and page title. */
export const site = {
  title: 'Marco Lovato',
  tagline: 'Senior Software Engineer',
  description:
    'Resume of Marco Lovato — Senior Software Engineer with 15+ years building distributed systems, microservices, and cloud architectures.',
  url: 'https://lovato.github.io/resume/',
  author: 'Marco Lovato',
} as const;

export type SiteConfig = typeof site;
