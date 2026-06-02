import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBerryList, getBerry } from '@/services/berryService';
import { formatPokemonName } from '@/utils/formatters';
import { Card } from '@/components/shared/Card/Card';
import { Spinner } from '@/components/shared/Spinner/Spinner';

export function BerriesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: list, isLoading } = useQuery({
    queryKey: ['berries'],
    queryFn: () => getBerryList(64, 0),
  });

  const { data: detail } = useQuery({
    queryKey: ['berry', selected],
    queryFn: () => getBerry(selected!),
    enabled: !!selected,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Bayas</h1>
      <p className="mb-8 text-foreground-secondary">{list?.count ?? 64} bayas en PokeAPI</p>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-4">
          {list?.results.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelected(b.name)}
                className={`rounded-card border p-3 text-left transition-colors hover:bg-background-tertiary ${
                  selected === b.name ? 'border-accent' : 'border-border'
                }`}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${b.name}-berry.png`}
                  alt=""
                  className="mx-auto h-12 w-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <p className="mt-2 text-center text-sm font-medium">
                  {formatPokemonName(b.name)}
                </p>
              </button>
          ))}
        </div>

        {detail && (
          <Card className="h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold">{formatPokemonName(detail.name)}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Crecimiento</dt>
                <dd>{detail.growth_time} h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Cosecha máx.</dt>
                <dd>{detail.max_harvest}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Firmeza</dt>
                <dd>{formatPokemonName(detail.firmness.name)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Regalo Natural</dt>
                <dd>
                  {detail.natural_gift_power} ·{' '}
                  {detail.natural_gift_type
                    ? formatPokemonName(detail.natural_gift_type.name)
                    : '—'}
                </dd>
              </div>
            </dl>
            <h3 className="mt-4 font-medium">Sabores</h3>
            <ul className="mt-2 text-sm">
              {detail.flavors
                .filter((f) => f.potency > 0)
                .map((f) => (
                  <li key={f.flavor.name}>
                    {formatPokemonName(f.flavor.name)}: {f.potency}
                  </li>
                ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
