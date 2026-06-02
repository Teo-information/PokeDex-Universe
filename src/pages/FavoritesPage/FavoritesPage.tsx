import { useQueries } from '@tanstack/react-query';
import { getPokemon } from '@/services/pokemonService';
import { useFavoritesStore } from '@/store/favoritesStore';
import { PokemonCard } from '@/components/pokemon/PokemonCard/PokemonCard';
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCard/PokemonCardSkeleton';
import { Button } from '@/components/shared/Button/Button';
import type { Pokemon } from '@/types/pokemon.types';

export function FavoritesPage() {
  const { ids, exportJson } = useFavoritesStore();

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => getPokemon(id),
    })),
  });

  const pokemonList = queries
    .map((q) => q.data)
    .filter((p): p is Pokemon => p !== undefined);

  const loading = queries.some((q) => q.isLoading);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pokedex-favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareUrl = () => {
    const params = new URLSearchParams({ favorites: ids.join(',') });
    void navigator.clipboard.writeText(`${window.location.origin}/favorites?${params}`);
  };

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <p className="mt-4 text-foreground-secondary">
          Marca Pokémon con el corazón para guardarlos aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Favoritos ({ids.length})</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Exportar JSON
          </Button>
          <Button variant="outline" onClick={shareUrl}>
            Copiar enlace
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ids.map((id) => (
            <PokemonCardSkeleton key={id} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pokemonList.map((pokemon, index) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
