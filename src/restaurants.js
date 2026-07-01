import { API_BASE } from './api.js';

// Single-tenant app: just Driver Game Center. The multi-restaurant scaffolding
// is kept (AppContext/CartContext resolve the active restaurant) but there is
// only one entry, used as the default everywhere.
export const DEFAULT_RESTAURANT_SLUG = 'driver-game-center';

export const restaurants = [
  {
    slug: 'driver-game-center',
    name: 'Driver Game Center',
    category: 'Oyun klubu',
    description: 'Simulyasiya, yarış və oyun klubu.',
    logo: `${import.meta.env.BASE_URL}driver-game-center-logo.jpeg`,
    accentColor: '#7C3AED',
    apiBase: API_BASE,
    tags: ['Oyun klubu', 'Kabinetlər', 'Qəlyan'],
  },
];

export function getRestaurantBySlug(slug) {
  return restaurants.find((restaurant) => restaurant.slug === slug) || null;
}

export function restaurantSlugFromPath(pathname) {
  const [segment] = pathname.split('/').filter(Boolean);
  if (!segment || segment === 'admin') return null;
  return segment;
}

export function localizedText(value, language = 'az') {
  if (value == null) return '';
  if (typeof value === 'object') return value[language] || value.az || value.en || Object.values(value)[0] || '';
  return String(value);
}
