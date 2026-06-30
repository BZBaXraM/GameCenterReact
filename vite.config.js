import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const BASE = '/driver-game-center/';

// Dev-only: Vite's dev server is mounted at `base`, so hitting the bare path
// (no trailing slash) shows its "did you mean /driver-game-center/" helper page.
// Redirect /driver-game-center → /driver-game-center/ so the app loads either way.
function baseRedirect() {
  return {
    name: 'dgc-base-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/driver-game-center') {
          res.statusCode = 302;
          res.setHeader('Location', BASE);
          return res.end();
        }
        next();
      });
    },
  };
}

// Served under /driver-game-center both in dev (localhost:5174/driver-game-center)
// and prod (menyuqr.com/driver-game-center). The app talks to the backend
// directly via API_BASE (CORS-enabled), so the proxy is only a dev convenience.
export default defineConfig({
  base: BASE,
  plugins: [baseRedirect(), react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads-dgc': 'http://localhost:3000',
      '/dgc/ws': { target: 'ws://localhost:3000', ws: true },
    },
  },
});
