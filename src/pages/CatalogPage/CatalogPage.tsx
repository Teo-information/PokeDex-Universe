import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { FilterPanel } from '@/components/filters/FilterPanel/FilterPanel';
import { PokemonCard } from '@/components/pokemon/PokemonCard/PokemonCard';
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCard/PokemonCardSkeleton';
import { SearchBar } from '@/components/shared/SearchBar/SearchBar';
import { Spinner } from '@/components/shared/Spinner/Spinner';
import { usePokemonList, pokemonIdsFromList } from '@/hooks/usePokemonList';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilterStore } from '@/store/filterStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { getPokemon } from '@/services/pokemonService';
import { matchesFilters, sortPokemon } from '@/utils/filterPokemon';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { Button } from '@/components/shared/Button/Button';
import { GENERATIONS } from '@/constants/generations';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const filters = useFilterStore();
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const { search, setSearch, resetFilters, syncFromUrl, types, generation } = filters;
  const debouncedSearch = useDebounce(search);
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    syncFromUrl(searchParams);
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams, syncFromUrl, setSearch]);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePokemonList();
  const allIds = useMemo(() => pokemonIdsFromList(data?.pages), [data?.pages]);

  const visibleIds = useMemo(() => {
    let list = allIds;
    if (generation) {
      const gen = GENERATIONS.find((g) => g.id === generation);
      if (gen) list = list.filter((p) => p.id >= gen.startId && p.id <= gen.endId);
    }
    if (types.length > 0) {
      // Type filter applied after pokemon load — keep all IDs for now
    }
    if (debouncedSearch && /^\d+$/.test(debouncedSearch.trim())) {
      const id = parseInt(debouncedSearch.trim(), 10);
      list = list.filter((p) => p.id === id);
    } else if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      list = list.filter((p) => p.name.includes(q));
    }
    return list;
  }, [allIds, generation, types, debouncedSearch]);

  const batchSize = 20;
  const [loadedCount, setLoadedCount] = useState(batchSize);
  const batch = visibleIds.slice(0, loadedCount);

  const queries = useQueries({
    queries: batch.map(({ name }) => ({
      queryKey: ['pokemon', name],
      queryFn: () => getPokemon(name),
    })),
  });

  const pokemonLoaded = queries
    .map((q) => q.data)
    .filter((p): p is NonNullable<typeof p> => !!p);

  const filtered = useMemo(() => {
    const withSearch = { ...filters, search: debouncedSearch };
    const matched = pokemonLoaded.filter((p) => matchesFilters(p, withSearch, favoriteIds));
    if (types.length > 0) {
      return matched.filter((p) => {
        const pt = p.types.map((t) => t.type.name);
        return filters.typeMatchMode === 'all'
          ? types.every((t) => pt.includes(t))
          : types.some((t) => pt.includes(t));
      });
    }
    return sortPokemon(matched, withSearch);
  }, [pokemonLoaded, filters, debouncedSearch, favoriteIds, types]);

  const sentinelRef = useInfiniteScroll(
    () => {
      if (loadedCount < visibleIds.length) {
        setLoadedCount((c) => Math.min(c + batchSize, visibleIds.length));
      } else if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    loadedCount < visibleIds.length || !!hasNextPage,
    isFetchingNextPage,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo</h1>
          <p className="text-foreground-secondary">
            {filtered.length} Pokémon coinciden
            {data?.pages[0]?.count ? ` · ${data.pages[0].count} total` : ''}
          </p>
        </div>
        <div className="w-full max-w-md">
          <SearchBar value={localSearch} onChange={setLocalSearch} />
        </div>
      </div>

      {(types.length > 0 || generation) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 shrink-0 lg:block">
          <FilterPanel />
        </div>
        <div className="flex-1 lg:hidden">
          <FilterPanel />
        </div>
        <div className="flex-1">
          {isLoading && pokemonLoaded.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((pokemon, index) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
              ))}
            </div>
          )}
          <div ref={sentinelRef} className="flex justify-center py-8">
            {(isFetchingNextPage || queries.some((q) => q.isLoading)) && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
