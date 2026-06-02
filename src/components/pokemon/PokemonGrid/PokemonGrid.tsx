import { useQueries } from '@tanstack/react-query';
import { PokemonCard } from '@/components/pokemon/PokemonCard/PokemonCard';
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCard/PokemonCardSkeleton';
import { getPokemon } from '@/services/pokemonService';
import type { Pokemon } from '@/types/pokemon.types';

interface PokemonGridProps {
  names: { id: number; name: string }[];
}

export function PokemonGrid({ names }: PokemonGridProps) {
  const queries = useQueries({
    queries: names.map(({ name }) => ({
      queryKey: ['pokemon', name],
      queryFn: () => getPokemon(name),
    })),
  });

  const loading = queries.some((q) => q.isLoading);
  const pokemonList = queries
    .map((q) => q.data)
    .filter((p): p is Pokemon => p !== undefined);

  if (loading && pokemonList.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pokemonList.map((pokemon, index) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
      ))}
      {loading &&
        Array.from({ length: 4 }).map((_, i) => <PokemonCardSkeleton key={`sk-${i}`} />)}
    </div>
  );
}
