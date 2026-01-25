import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://heyzack.ai',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
