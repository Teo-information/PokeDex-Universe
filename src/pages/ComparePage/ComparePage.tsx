import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useCompareStore } from '@/store/compareStore';
import { getPokemon } from '@/services/pokemonService';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { StatBar } from '@/components/shared/StatBar/StatBar';
import { CompareStatsRadar } from '@/components/pokemon/CompareStatsRadar/CompareStatsRadar';
import { Button } from '@/components/shared/Button/Button';
import { formatPokemonName, formatPokedexId } from '@/utils/formatters';
import { getStatValue, STAT_LABELS } from '@/utils/statHelpers';
import { Card } from '@/components/shared/Card/Card';

const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

export function ComparePage() {
  const { slots, removePokemon, clearAll } = useCompareStore();
  const active = slots.filter((s): s is NonNullable<typeof s> => s !== null);

  const queries = useQueries({
    queries: active.map((s) => ({
      queryKey: ['pokemon', s.id],
      queryFn: () => getPokemon(s.id),
    })),
  });

  const pokemonList = queries.map((q) => q.data).filter(Boolean);

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Comparador</h1>
        <p className="mt-4 text-foreground-secondary">
          Añade hasta 4 Pokémon desde el catálogo o el detalle.
        </p>
        <Link to="/catalog" className="mt-6 inline-block text-accent hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const base = pokemonList[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Comparar ({active.length}/4)</h1>
        <Button variant="ghost" onClick={clearAll}>
          Vaciar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {active.map((slot) => (
          <Card key={slot.id} className="p-4 text-center">
            {slot.sprite && (
              <img src={slot.sprite} alt="" className="mx-auto h-24 w-24 object-contain" />
            )}
            <p className="font-bold">{formatPokemonName(slot.name)}</p>
            <p className="font-mono text-xs text-foreground-secondary">
              {formatPokedexId(slot.id)}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              {slot.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => removePokemon(slot.id)}
            >
              Quitar
            </Button>
          </Card>
        ))}
      </div>

      {pokemonList.length >= 2 && base && (
        <Card className="mt-8 p-6">
          <h2 className="mb-4 font-semibold">Estadísticas comparadas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Stat</th>
                  {pokemonList.map((p) => (
                    <th key={p!.id} className="px-2">
                      {formatPokemonName(p!.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STAT_KEYS.map((stat) => (
                  <tr key={stat} className="border-t border-border">
                    <td className="py-2">{STAT_LABELS[stat]}</td>
                    {pokemonList.map((p) => {
                      const val = getStatValue(p!.stats, stat);
                      const baseVal = getStatValue(base.stats, stat);
                      const diff = val - baseVal;
                      return (
                        <td
                          key={p!.id}
                          className={`px-2 py-2 font-mono ${
                            diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : ''
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pokemonList.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pokemonList.map((p) => (
              <Card key={p!.id} className="p-4">
                <h3 className="mb-4 font-semibold">{formatPokemonName(p!.name)}</h3>
                {STAT_KEYS.slice(0, 3).map((stat) => (
                  <StatBar
                    key={stat}
                    label={STAT_LABELS[stat]}
                    value={getStatValue(p!.stats, stat)}
                    statName={stat}
                  />
                ))}
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6">
            <h2 className="mb-4 font-semibold">Radar de estadísticas</h2>
            <CompareStatsRadar
              series={pokemonList.map((p) => ({
                id: p!.id,
                name: p!.name,
                stats: p!.stats,
              }))}
            />
          </Card>
        </>
      )}
    </div>
  );
}
