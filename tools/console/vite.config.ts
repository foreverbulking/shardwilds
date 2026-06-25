import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import consolePlugin from './vite-plugin-console';

export default defineConfig({
  plugins: [react(), tailwindcss(), consolePlugin()],
  server: {
    port: 5174,
    strictPort: true,
  },
});