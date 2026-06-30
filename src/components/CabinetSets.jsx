import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl } from '../api.js';

// "Cabinet Sets" — ready-made combos. Adding a set drops it into the cart as a
// single line (its own id namespace so it never clashes with menu items).
export default function CabinetSets() {
  const { apiUrl, apiBase, tl, t, formatPrice } = useApp();
  const { add } = useCart();
  const [sets, setSets] = useState([]);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (!apiUrl) return;
    fetch(`${apiUrl}/menu/sets`).then((r) => r.json()).then((d) => setSets(Array.isArray(d) ? d : [])).catch(() => {});
  }, [apiUrl]);

  if (!sets.length) return null;

  const addSet = (s) => {
    add({ id: `set-${s.id}`, name: s.name, price: s.price, image: s.image, is_set: 1 });
    setAddedId(s.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="pt-6">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-ink">
        <span className="neon-text">🎮</span> {t.cabinetSets}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sets.map((s) => (
          <div key={s.id} className="neon-card flex gap-3 rounded-2xl p-3">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2 text-3xl">
              {s.image ? <img src={assetUrl(s.image, apiBase)} alt="" className="h-full w-full object-cover" /> : '🍔'}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold text-ink">{tl(s.name)}</h3>
                {!!s.includes_hookah && (
                  <span className="shrink-0 rounded-full bg-neon-2/15 px-2 py-0.5 text-[10px] font-semibold text-neon-2">💨 {t.hookah}</span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted">{tl(s.description)}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="neon-text font-display text-lg font-bold">{formatPrice(s.price)}</span>
                  {s.old_price ? <span className="text-xs text-muted line-through">{formatPrice(s.old_price)}</span> : null}
                </div>
                <button
                  onClick={() => addSet(s)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${addedId === s.id ? 'bg-emerald-500 text-white' : 'bg-accent text-accent-ink neon-glow'}`}
                >
                  {addedId === s.id ? `✓ ${t.added}` : `+ ${t.addSet}`}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
