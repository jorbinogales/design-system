import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `npm run prototype` serves the MVP preview; `npm run build:prototype` builds it into dist-prototype/
// with relative paths so it can be hosted from any folder.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-prototype',
    rollupOptions: { input: { prototype: 'prototype.html' } },
  },
})
