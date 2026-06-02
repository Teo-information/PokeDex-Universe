import { GENERATIONS } from '@/constants/generations';
import type { FilterState } from '@/types/filter.types';
import type { Pokemon } from '@/types/pokemon.types';
import { getStatValue, getTotalStats } from '@/utils/statHelpers';
import { formatPokemonName } from '@/utils/formatters';

export function matchesFilters(
  pokemon: Pokemon,
  filters: FilterState,
  favoriteIds: number[],
): boolean {
  const { search, types, typeMatchMode, generation, favoritesOnly, statRanges, heightRange, weightRange } =
    filters;

  if (favoritesOnly && !favoriteIds.includes(pokemon.id)) return false;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    const idMatch = /^\d+$/.test(q) && pokemon.id === parseInt(q, 10);
    const nameMatch =
      pokemon.name.includes(q) || formatPokemonName(pokemon.name).toLowerCase().includes(q);
    if (!idMatch && !nameMatch) return false;
  }

  if (types.length > 0) {
    const pokemonTypes = pokemon.types.map((t) => t.type.name);
    if (typeMatchMode === 'all') {
      if (!types.every((t) => pokemonTypes.includes(t))) return false;
    } else if (!types.some((t) => pokemonTypes.includes(t))) return false;
  }

  if (generation) {
    const gen = GENERATIONS.find((g) => g.id === generation);
    if (gen && (pokemon.id < gen.startId || pokemon.id > gen.endId)) return false;
  }

  const heightM = pokemon.height / 10;
  const weightKg = pokemon.weight / 10;
  if (heightM < heightRange.min || heightM > heightRange.max) return false;
  if (weightKg < weightRange.min || weightKg > weightRange.max) return false;

  for (const [stat, range] of Object.entries(statRanges)) {
    const val =
      stat === 'total'
        ? getTotalStats(pokemon.stats)
        : getStatValue(pokemon.stats, stat);
    if (val < range.min || val > range.max) return false;
  }

  return true;
}

export function sortPokemon(list: Pokemon[], filters: FilterState): Pokemon[] {
  const { sortField, sortDirection } = filters;
  const dir = sortDirection === 'asc' ? 1 : -1;

  return [...list].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'id':
        cmp = a.id - b.id;
        break;
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'weight':
        cmp = a.weight - b.weight;
        break;
      case 'height':
        cmp = a.height - b.height;
        break;
      case 'total':
        cmp = getTotalStats(a.stats) - getTotalStats(b.stats);
        break;
      default:
        cmp = getStatValue(a.stats, sortField) - getStatValue(b.stats, sortField);
    }
    return cmp * dir;
  });
}
