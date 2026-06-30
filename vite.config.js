import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served at the root of its own subdomain (game-center.bahram.site).
const BASE = '/';

// Served at the root in both dev (localhost:5174) and prod (game-center.bahram.site).
// The app talks to the backend directly via API_BASE (CORS-enabled), so the proxy
// is only a dev convenience.
export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads-dgc': 'http://localhost:3000',
      '/dgc/ws': { target: 'ws://localhost:3000', ws: true },
    },
  },
});
