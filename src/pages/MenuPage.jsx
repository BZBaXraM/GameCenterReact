import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import Navbar from '../components/Navbar.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import DishCard from '../components/DishCard.jsx';
import DishModal from '../components/DishModal.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import CartBar from '../components/CartBar.jsx';
import AIChat from '../components/AIChat.jsx';
import ContactBar from '../components/ContactBar.jsx';
import RestaurantInfo from '../components/RestaurantInfo.jsx';
import Pagination from '../components/Pagination.jsx';
import PromotionBanner from '../components/PromotionBanner.jsx';
import CabinetSets from '../components/CabinetSets.jsx';
import CabinetsPanel from '../components/CabinetsPanel.jsx';
import { assetUrl } from '../api.js';

export default function MenuPage() {
  const { tl, t, settings, activeRestaurant, apiUrl } = useApp();
  // A cabinet QR (?cabinet=N) unlocks the cabinet-only menu (incl. hookah).
  const cabinetId = useMemo(() => new URLSearchParams(window.location.search).get('cabinet'), []);
  const scope = cabinetId ? 'cabinet' : 'menu';

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [modalDish, setModalDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiUrl) return setCategories([]);
    fetch(`${apiUrl}/menu/categories?scope=${scope}`).then((r) => r.json()).then(setCategories).catch(() => {});
  }, [apiUrl, scope]);

  useEffect(() => {
    if (!apiUrl) return setPromotions([]);
    fetch(`${apiUrl}/menu/promotions`).then((r) => r.json()).then(setPromotions).catch(() => {});
  }, [apiUrl]);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeCat, debounced]);

  useEffect(() => {
    if (!apiUrl) { setDishes([]); setTotalPages(1); setLoading(false); return; }
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12', scope });
    if (activeCat) params.set('category_id', String(activeCat));
    if (debounced) params.set('search', debounced);
    fetch(`${apiUrl}/menu/items?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setDishes(data.items || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiUrl, page, activeCat, debounced, scope]);

  const categoryFor = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.id] = c; });
    return (id) => map[id] || null;
  }, [categories]);

  return (
    <div className="min-h-screen bg-bg pb-28">
      <Navbar onSearch={setSearch} search={search} />

      <main className="mx-auto max-w-5xl px-4 pb-12">
        <section className="py-6 text-center">
          <img
            src={assetUrl(settings.logo_image || activeRestaurant?.logo || `${import.meta.env.BASE_URL}driver-game-center-logo.jpeg`, activeRestaurant?.apiBase)}
            alt=""
            className="mx-auto mb-3 mt-10 h-48 w-48 rounded-full object-cover neon-glow sm:h-56 sm:w-56 md:h-64 md:w-64"
          />
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {tl(settings.restaurant_name) || 'Driver Game Center'}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">{t.specialty}</p>
          <p className="mt-1 font-display text-sm italic neon-text">{t.tagline}</p>
          {cabinetId && (
            <p className="mt-2 inline-block rounded-full neon-border px-3 py-1 text-xs font-semibold text-ink">
              🕹️ {t.cabinets} #{cabinetId}
            </p>
          )}
          <ContactBar />
        </section>

        <PromotionBanner promotions={promotions} />

        <CabinetsPanel highlightId={cabinetId} />

        <CabinetSets />

        <div id="menu" className="sticky top-[58px] z-20 -mx-4 mt-6 bg-bg/90 px-4 py-2 backdrop-blur">
          <CategoryFilter categories={categories} active={activeCat} onChange={setActiveCat} />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-line bg-surface" />
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <p className="py-16 text-center text-muted">{t.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 lg:grid-cols-4">
            {dishes.map((d) => (
              <DishCard key={d.id} dish={d} category={categoryFor(d.category_id)} onOpen={setModalDish} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </main>

      <RestaurantInfo />

      <AIChat />
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {modalDish && (
        <DishModal dish={modalDish} category={categoryFor(modalDish.category_id)} onClose={() => setModalDish(null)} />
      )}
    </div>
  );
}
