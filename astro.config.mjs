// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Use static output so the site can build without a server adapter.
  output: 'static',

  vite: {
    plugins: [tailwindcss()]
  }
});