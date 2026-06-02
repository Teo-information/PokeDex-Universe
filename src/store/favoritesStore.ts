import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  ids: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  exportJson: () => string;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggleFavorite: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
      exportJson: () => JSON.stringify({ favorites: get().ids }, null, 2),
    }),
    { name: 'pokedex-favorites' },
  ),
);
