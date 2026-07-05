import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served under /driver-game-center/ on the MenyuQR site
// (prod: https://www.menyuqr.com/driver-game-center/, dev: localhost:5174/driver-game-center/).
const BASE = '/driver-game-center/';

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
