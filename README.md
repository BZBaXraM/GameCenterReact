# Driver Game Center — Frontend

Neon-themed QR menu + admin panel for the **Driver Game Center** gaming club.
Standalone React 18 + Vite + Tailwind v4 app (cloned from Coffee-menu-React),
served under `/driver-game-center`.

- **Dev:** `http://localhost:5174/driver-game-center`
- **Prod:** `https://www.menyuqr.com/driver-game-center`

## Run

```bash
bun install
bun run dev      # http://localhost:5174/driver-game-center  (needs the API on :3000)
bun run build    # → dist/
```

The app talks to the shared `qr-menu` backend under the **`/api/dgc`** namespace
(see `src/api.js`). `API_BASE` defaults to `http://localhost:3000` and is
overridden in production with `VITE_API_BASE` (the DGC API host).

## Deploy

The app is built with Vite `base: '/driver-game-center/'` (see `vite.config.js`)
and served at `menyuqr.com/driver-game-center` by the **MenyuQR / Coffee-menu-API**
Express backend — the build output is bundled into that repo under
`public/driver-game-center/`. From the Coffee-menu-API repo, run:

```bash
bun run game-center:build   # or: node scripts/build-game-center.mjs
```

which rebuilds this app and copies `dist/` into `public/driver-game-center/`; then
redeploy the API image as usual. The standalone `Dockerfile`/`nginx.conf` here now
only 301-redirect the legacy `game-center.bahram.site` subdomain to the new URL.

## What's different from the coffee app

- **Cabinets** (`CabinetsPanel`) — private rooms with a live, WebSocket-driven
  open/closed status + elapsed timer + running cost (`/dgc/ws`, `cabinet_update`).
- **Cabinet Sets** (`CabinetSets`) — ready-made combos, some with hookah.
- **Cabinet QR** — a `?cabinet=N` URL param unlocks the cabinet-only menu
  (hookah category + sets); a plain `?table=N` (or no param) shows the main menu.
- **Admin** (`/driver-game-center/admin`, default password `admin123`) — adds
  **Cabinets** (open/close + session/billing history) and **Sets** tabs; items
  carry a `scope` (menu / cabinet / both) and `is_hookah` flag; WhatsApp number
  is editable in **Settings**.
- **Neon theme** — dark base with glowing accents (`src/index.css`).
# GameCenterReact
