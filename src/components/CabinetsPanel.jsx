import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { wsUrl } from '../api.js';

function fmtDuration(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

// Live cabinet board. Shows each cabinet's open/closed status and, for open
// cabinets, a ticking elapsed timer. Updates arrive over the /dgc/ws channel
// (cabinet_update) broadcast when staff open/close a cabinet from the admin.
export default function CabinetsPanel({ highlightId }) {
  const { apiUrl, apiBase, tl, t, formatPrice } = useApp();
  const [cabinets, setCabinets] = useState([]);
  const [, force] = useState(0);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!apiUrl) return;
    fetch(`${apiUrl}/cabinets`).then((r) => r.json()).then((d) => setCabinets(Array.isArray(d) ? d : [])).catch(() => {});
  }, [apiUrl]);

  // Live updates via WebSocket.
  useEffect(() => {
    if (!apiBase) return;
    let ws;
    try {
      ws = new WebSocket(wsUrl('/dgc/ws'));
      wsRef.current = ws;
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'cabinet_update' && msg.cabinet) {
            setCabinets((prev) => prev.map((c) => (c.id === msg.cabinet.id ? { ...c, ...msg.cabinet } : c)));
          }
        } catch { /* ignore */ }
      };
    } catch { /* ignore */ }
    return () => ws && ws.close();
  }, [apiBase]);

  // Re-render every second so open timers tick with seconds.
  const anyOpen = cabinets.some((c) => c.status === 'open');
  useEffect(() => {
    if (!anyOpen) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [anyOpen]);

  if (!cabinets.length) return null;

  const elapsedOf = (c) => {
    if (c.status !== 'open' || !c.opened_at) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(c.opened_at).getTime()) / 1000));
  };

  return (
    <section id="cabinets" className="pt-6">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-ink">
        <span className="neon-text">🕹️</span> {t.cabinets}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cabinets.map((c) => {
          const open = c.status === 'open';
          const elapsed = elapsedOf(c);
          const highlight = String(c.id) === String(highlightId);
          return (
            <div
              key={c.id}
              className={`relative overflow-hidden rounded-2xl p-3 ${open ? 'neon-card animate-neon-pulse' : 'neon-card'} ${highlight ? 'ring-2 ring-neon' : ''}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-ink">{tl(c.name)}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${open ? 'bg-neon/20 text-neon' : 'bg-surface-2 text-muted'}`}>
                  {open ? `● ${t.open}` : t.closed}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted">
                👥 {c.capacity} · {formatPrice(c.hourly_rate)}{t.perHour}
              </div>
              {open && (
                <div className="mt-2 rounded-lg bg-bg/60 px-2 py-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted">{t.elapsed}</span><span className="font-semibold tabular-nums text-ink">{fmtDuration(elapsed)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">{t.runningCost}</span><span className="neon-text font-semibold">{formatPrice(c.running_cost ?? 0)}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
