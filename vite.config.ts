import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: path.join(projectRoot, '.generated'),
  build: {
    outDir: path.join(projectRoot, 'dist'),
    emptyOutDir: true,
  },
});
