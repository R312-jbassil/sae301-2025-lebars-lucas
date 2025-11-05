// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Server output to support API routes in production
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  vite: {
    plugins: [tailwindcss()]
  }
});