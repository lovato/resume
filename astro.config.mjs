import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://lovato.github.io/resume/
export default defineConfig({
  site: 'https://lovato.github.io',
  base: '/resume',
  integrations: [mdx()],
});
