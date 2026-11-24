import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://product-selection-delta.vercel.app',
  output: 'static',
  publicDir: './.public-build',
  build: { format: 'directory', inlineStylesheets: 'never' },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
