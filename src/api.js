// Driver Game Center talks to the shared qr-menu backend under the /api/dgc
// namespace. The origin can be overridden at build time with VITE_API_BASE; it
// defaults to localhost for development (prod sets VITE_API_BASE to the API host).
export const API_BASE = (import.meta.env.VITE_API_BASE || 'https://coffee-menu.bahram.site').replace(/\/$/, '');

// export const API_BASE = (
//   import.meta.env.VITE_API_BASE || "http://localhost:3000"
// ).replace(/\/$/, "");

// Base for REST calls, e.g. `${API_URL}/menu/items`.
export const API_URL = `${API_BASE}/api/dgc`;

export function apiBaseFor(restaurant) {
  return (restaurant?.apiBase || API_BASE).replace(/\/$/, "");
}

export function apiUrlFor(restaurant) {
  return `${apiBaseFor(restaurant)}/api/dgc`;
}

// Resolve a server-relative asset path (e.g. "/uploads-dgc/x.png") to an absolute URL.
export function assetUrl(path, base = API_BASE) {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith("/uploads-dgc/") || path.startsWith("/uploads/")) {
    return `${(base || API_BASE).replace(/\/$/, "")}${path}`;
  }
  return path;
}

// Parse a dish's `sizes` column (JSON array of { label, price } in AZN) into a
// clean array. Returns [] when the dish has no size variants — callers then fall
// back to the plain `price` field.
export function dishSizes(dish) {
  if (!dish || dish.sizes == null) return [];
  try {
    const arr =
      typeof dish.sizes === "string" ? JSON.parse(dish.sizes) : dish.sizes;
    return Array.isArray(arr)
      ? arr.filter((s) => s && s.label != null && s.price != null)
      : [];
  } catch {
    return [];
  }
}

// WebSocket endpoint on the API host (DGC channel by default).
export function wsUrl(path = "/dgc/ws") {
  const url = new URL(API_BASE);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = path;
  return url.toString();
}

// Thin fetch helper. `path` is relative to the API root, e.g. "/menu/dishes".
export async function api(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, opts);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

export function adminHeaders(pw, extra = {}) {
  return { "x-admin-password": pw || "", ...extra };
}

// JSON helper for admin writes (non-multipart)
export function jsonHeaders(pw) {
  return { "Content-Type": "application/json", ...adminHeaders(pw) };
}
