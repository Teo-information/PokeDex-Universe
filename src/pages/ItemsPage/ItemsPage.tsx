import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getItemList, getItem } from '@/services/itemService';
import { formatPokemonName } from '@/utils/formatters';
import { Card } from '@/components/shared/Card/Card';
import { SearchBar } from '@/components/shared/SearchBar/SearchBar';
import { Spinner } from '@/components/shared/Spinner/Spinner';
import { useDebounce } from '@/hooks/useDebounce';

export function ItemsPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);
  const [selected, setSelected] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: ({ pageParam = 0 }) => getItemList(40, pageParam),
      initialPageParam: 0,
      getNextPageParam: (last, _p, param) => (last.next ? param + 40 : undefined),
    });

  const { data: detail } = useQuery({
    queryKey: ['item', selected],
    queryFn: () => getItem(selected!),
    enabled: !!selected,
  });

  const items = data?.pages.flatMap((p) => p.results) ?? [];
  const filtered = debounced
    ? items.filter((i) => i.name.includes(debounced.toLowerCase()))
    : items;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Objetos</h1>
      <div className="mb-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar objeto..." />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelected(item.name)}
              className="text-left"
            >
              <Card className="p-4 transition-shadow hover:shadow-card-hover">
                <p className="font-medium">{formatPokemonName(item.name)}</p>
              </Card>
            </button>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-accent hover:underline"
          >
            {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[80vh] max-w-lg overflow-y-auto p-6">
            <div className="flex gap-4">
              {detail.sprites.default && (
                <img src={detail.sprites.default} alt="" className="h-16 w-16" />
              )}
              <div>
                <h2 className="text-xl font-bold">{formatPokemonName(detail.name)}</h2>
                <p className="text-sm text-foreground-secondary">
                  {formatPokemonName(detail.category.name)} · {detail.cost} ₽
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground-secondary">
              {detail.effect_entries.find((e) => e.language.name === 'es')?.short_effect ??
                detail.effect_entries[0]?.short_effect}
            </p>
            <button
              type="button"
              className="mt-4 text-accent"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
