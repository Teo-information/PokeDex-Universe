import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, Scale } from 'lucide-react';
import { usePokemonDetail } from '@/hooks/usePokemonDetail';
import { usePokemonSpecies } from '@/hooks/usePokemonSpecies';
import { useEvolutionChain } from '@/hooks/useEvolutionChain';
import { extractEvolutionChainId } from '@/services/evolutionService';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { StatBar } from '@/components/shared/StatBar/StatBar';
import { StatsRadar } from '@/components/pokemon/StatsRadar/StatsRadar';
import { EvolutionTree } from '@/components/pokemon/EvolutionTree/EvolutionTree';
import { Spinner } from '@/components/shared/Spinner/Spinner';
import { Card } from '@/components/shared/Card/Card';
import { Button } from '@/components/shared/Button/Button';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCompareStore } from '@/store/compareStore';
import {
  formatPokemonName,
  formatPokedexId,
  getSpanishFlavorText,
  heightInMeters,
  weightInKg,
} from '@/utils/formatters';
import { STAT_LABELS } from '@/utils/statHelpers';
import { typeColorSoft } from '@/utils/colorMap';

const MAIN_STATS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

export function DetailPage() {
  const { idOrName } = useParams<{ idOrName: string }>();
  const navigate = useNavigate();
  const [shiny, setShiny] = useState(false);
  const { data: pokemon, isLoading, isError } = usePokemonDetail(idOrName);
  const { data: species } = usePokemonSpecies(idOrName);
  const chainId = species ? extractEvolutionChainId(species.evolution_chain.url) : undefined;
  const { data: evolution } = useEvolutionChain(chainId);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addPokemon, isFull } = useCompareStore();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-lg">Pokémon no encontrado.</p>
        <Link to="/catalog" className="mt-4 inline-block text-accent hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const sprite = shiny
    ? pokemon.sprites.front_shiny ?? pokemon.sprites.front_default
    : pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default;

  const share = () => {
    void navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: `linear-gradient(180deg, ${typeColorSoft(primaryType)} 0%, transparent 40%)` }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
          <div className="flex gap-2">
            <Link to={`/pokemon/${pokemon.id - 1}`}>
              <Button variant="outline" size="sm" disabled={pokemon.id <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/pokemon/${pokemon.id + 1}`}>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="flex flex-col items-center p-8">
            <span className="font-mono text-foreground-secondary">
              {formatPokedexId(pokemon.id)}
            </span>
            <h1 className="text-4xl font-bold">{formatPokemonName(pokemon.name)}</h1>
            <div className="mt-2 flex gap-2">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            {sprite && (
              <img src={sprite} alt="" className="my-6 h-64 w-64 object-contain" loading="lazy" />
            )}
            <div className="flex gap-2">
              <Button variant={shiny ? 'primary' : 'outline'} size="sm" onClick={() => setShiny(!shiny)}>
                {shiny ? 'Shiny' : 'Normal'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(pokemon.id)}
              >
                <Heart className={isFavorite(pokemon.id) ? 'fill-accent text-accent' : ''} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isFull()}
                onClick={() =>
                  addPokemon({
                    id: pokemon.id,
                    name: pokemon.name,
                    sprite: pokemon.sprites.front_default,
                    types: pokemon.types.map((t) => t.type.name),
                  })
                }
              >
                <Scale className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={share}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-foreground-secondary">
              {heightInMeters(pokemon.height)} · {weightInKg(pokemon.weight)}
            </p>
          </Card>

          <div className="space-y-6">
            {species && (
              <Card className="p-6">
                <h2 className="mb-2 font-semibold">Descripción</h2>
                <p className="text-foreground-secondary">
                  {getSpanishFlavorText(species.flavor_text_entries)}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-foreground-secondary">Captura</dt>
                  <dd>{species.capture_rate}</dd>
                  <dt className="text-foreground-secondary">Felicidad base</dt>
                  <dd>{species.base_happiness}</dd>
                  <dt className="text-foreground-secondary">Pasos eclosión</dt>
                  <dd>{(species.hatch_counter + 1) * 255}</dd>
                </dl>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="mb-4 font-semibold">Estadísticas</h2>
              <div className="space-y-3">
                {pokemon.stats
                  .filter((s) => MAIN_STATS.includes(s.stat.name))
                  .map((s) => (
                    <StatBar
                      key={s.stat.name}
                      label={STAT_LABELS[s.stat.name] ?? s.stat.name}
                      value={s.base_stat}
                      statName={s.stat.name}
                    />
                  ))}
              </div>
              <div className="mt-6">
                <StatsRadar stats={pokemon.stats} />
              </div>
            </Card>
          </div>
        </div>

        {evolution && (
          <Card className="mt-8 p-6">
            <h2 className="mb-4 text-xl font-semibold">Cadena evolutiva</h2>
            <EvolutionTree chain={evolution.chain} />
          </Card>
        )}

        <Card className="mt-8 p-6">
          <h2 className="mb-4 font-semibold">Habilidades</h2>
          <ul className="space-y-2">
            {pokemon.abilities.map((a) => (
              <li key={a.ability.name} className="text-sm">
                <span className="font-medium">{formatPokemonName(a.ability.name)}</span>
                {a.is_hidden && (
                  <span className="ml-2 text-xs text-foreground-secondary">(oculta)</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
