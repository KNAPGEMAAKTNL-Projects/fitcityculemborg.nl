import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fitcityculemborg.nl',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !['/admin/', '/signup/success/', '/privacy/', '/voorwaarden/'].some((excluded) =>
          page.includes(excluded)
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
