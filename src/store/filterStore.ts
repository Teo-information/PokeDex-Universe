import { create } from 'zustand';
import {
  initialFilterState,
  type FilterState,
  type SortField,
  type SortDirection,
  type TypeMatchMode,
} from '@/types/filter.types';

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  toggleType: (type: string) => void;
  setTypeMatchMode: (mode: TypeMatchMode) => void;
  setGeneration: (gen: number | null) => void;
  setStatRange: (stat: string, min: number, max: number) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  setFavoritesOnly: (value: boolean) => void;
  resetFilters: () => void;
  syncFromUrl: (params: URLSearchParams) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialFilterState,
  setSearch: (search) => set({ search }),
  toggleType: (type) =>
    set((s) => {
      const types = s.types.includes(type)
        ? s.types.filter((t) => t !== type)
        : s.types.length < 2
          ? [...s.types, type]
          : [s.types[1], type];
      return { types };
    }),
  setTypeMatchMode: (typeMatchMode) => set({ typeMatchMode }),
  setGeneration: (generation) => set({ generation }),
  setStatRange: (stat, min, max) =>
    set((s) => ({
      statRanges: { ...s.statRanges, [stat]: { min, max } },
    })),
  setSort: (sortField, sortDirection) =>
    set((s) => ({
      sortField,
      sortDirection: sortDirection ?? s.sortDirection,
    })),
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
  resetFilters: () => set(initialFilterState),
  syncFromUrl: (params) => {
    const type = params.get('type');
    const gen = params.get('gen');
    set({
      types: type ? [type] : [],
      generation: gen ? parseInt(gen, 10) : null,
    });
  },
}));
