import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getMoveList, getMove } from '@/services/moveService';
import { formatPokemonName } from '@/utils/formatters';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { SearchBar } from '@/components/shared/SearchBar/SearchBar';
import { Spinner } from '@/components/shared/Spinner/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { Link, useParams } from 'react-router-dom';

export function MovesPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['moves'],
      queryFn: ({ pageParam = 0 }) => getMoveList(50, pageParam),
      initialPageParam: 0,
      getNextPageParam: (last, _p, param) => (last.next ? param + 50 : undefined),
    });

  const items = data?.pages.flatMap((p) => p.results) ?? [];
  const filtered = debounced
    ? items.filter((m) => m.name.includes(debounced.toLowerCase()))
    : items.slice(0, 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Movimientos</h1>
      <div className="mb-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar movimiento..." />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background-tertiary">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.name} className="border-t border-border hover:bg-background-tertiary/50">
                  <td className="px-4 py-2 font-medium">{formatPokemonName(m.name)}</td>
                  <td className="px-4 py-2">
                    <Link to={`/moves/${m.name}`} className="text-accent hover:underline">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasNextPage && !debounced && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-accent hover:underline"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}

export function MoveDetailPage() {
  const { idOrName } = useParams<{ idOrName: string }>();
  const { data: move, isLoading } = useQuery({
    queryKey: ['move', idOrName],
    queryFn: () => getMove(idOrName!),
    enabled: !!idOrName,
  });

  if (isLoading || !move) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">{formatPokemonName(move.name)}</h1>
      <div className="mt-2">
        <TypeBadge type={move.type.name} />
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <dt className="text-foreground-secondary">Potencia</dt>
        <dd>{move.power ?? '—'}</dd>
        <dt className="text-foreground-secondary">Precisión</dt>
        <dd>{move.accuracy ?? '—'}</dd>
        <dt className="text-foreground-secondary">PP</dt>
        <dd>{move.pp ?? '—'}</dd>
        <dt className="text-foreground-secondary">Clase</dt>
        <dd>{formatPokemonName(move.damage_class.name)}</dd>
      </dl>
    </div>
  );
}
