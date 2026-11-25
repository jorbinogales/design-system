import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `npm run dev` serves the landing (index.html) and the app preview (prototype.html);
// `npm run build:prototype` builds both into dist-prototype/
// with relative paths so it can be hosted from any folder.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-prototype',
    rollupOptions: {
      input: { index: 'index.html', detailing: 'detailing.html', towing: 'towing.html', 'personal-washing': 'personal-washing.html', prototype: 'prototype.html' },
    },
  },
})
