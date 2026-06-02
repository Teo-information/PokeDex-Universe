import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '@/constants/api';
import { getPokemonList } from '@/services/pokemonService';
import { extractIdFromUrl } from '@/utils/formatters';
import { getPokemon } from '@/services/pokemonService';

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => getPokemonList(DEFAULT_PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.next) return undefined;
      return lastPageParam + DEFAULT_PAGE_SIZE;
    },
  });
}

export function usePokemonBatch(names: string[]) {
  return useInfiniteQuery({
    queryKey: ['pokemon-batch', names],
    enabled: names.length > 0,
    queryFn: async () => {
      const results = await Promise.all(names.map((n) => getPokemon(n)));
      return results;
    },
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
}

export function pokemonIdsFromList(
  pages: { results: { name: string; url: string }[] }[] | undefined,
): { id: number; name: string }[] {
  if (!pages) return [];
  return pages.flatMap((p) =>
    p.results.map((r) => ({ id: extractIdFromUrl(r.url), name: r.name })),
  );
}
