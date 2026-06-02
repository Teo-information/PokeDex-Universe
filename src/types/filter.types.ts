export type SortField =
  | 'id'
  | 'name'
  | 'total'
  | 'weight'
  | 'height'
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export type SortDirection = 'asc' | 'desc';

export type TypeMatchMode = 'any' | 'all';

export interface StatRange {
  min: number;
  max: number;
}

export interface FilterState {
  search: string;
  types: string[];
  typeMatchMode: TypeMatchMode;
  generation: number | null;
  statRanges: Record<string, StatRange>;
  heightRange: StatRange;
  weightRange: StatRange;
  favoritesOnly: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const initialFilterState: FilterState = {
  search: '',
  types: [],
  typeMatchMode: 'any',
  generation: null,
  statRanges: {
    hp: { min: 0, max: 255 },
    attack: { min: 0, max: 190 },
    defense: { min: 0, max: 230 },
    'special-attack': { min: 0, max: 194 },
    'special-defense': { min: 0, max: 230 },
    speed: { min: 0, max: 200 },
    total: { min: 0, max: 780 },
  },
  heightRange: { min: 0, max: 25 },
  weightRange: { min: 0, max: 1000 },
  favoritesOnly: false,
  sortField: 'id',
  sortDirection: 'asc',
};
