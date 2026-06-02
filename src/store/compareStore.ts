import { create } from 'zustand';
import type { PokemonSummary } from '@/types/pokemon.types';

const MAX_SLOTS = 4;

interface CompareStore {
  slots: (PokemonSummary | null)[];
  addPokemon: (pokemon: PokemonSummary) => boolean;
  removePokemon: (id: number) => void;
  clearAll: () => void;
  isInCompare: (id: number) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  slots: [null, null, null, null],
  addPokemon: (pokemon) => {
    const { slots } = get();
    if (slots.some((s) => s?.id === pokemon.id)) return true;
    if (slots.every((s) => s !== null)) return false;
    const next = [...slots];
    const idx = next.findIndex((s) => s === null);
    next[idx] = pokemon;
    set({ slots: next });
    return true;
  },
  removePokemon: (id) =>
    set((s) => ({
      slots: s.slots.map((slot) => (slot?.id === id ? null : slot)),
    })),
  clearAll: () => set({ slots: [null, null, null, null] }),
  isInCompare: (id) => get().slots.some((s) => s?.id === id),
  isFull: () => get().slots.every((s) => s !== null),
}));

export { MAX_SLOTS };
