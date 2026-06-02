import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlipHorizontal2, Heart, Scale } from 'lucide-react';
import { TypeBadge } from '@/components/shared/TypeBadge/TypeBadge';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCompareStore } from '@/store/compareStore';
import { usePrefetchPokemon } from '@/hooks/usePrefetchPokemon';
import { formatPokemonName, formatPokedexId } from '@/utils/formatters';
import { typeColorSoft } from '@/utils/colorMap';
import { getStatValue } from '@/utils/statHelpers';
import type { Pokemon } from '@/types/pokemon.types';
import { cn } from '@/utils/cn';

interface PokemonCardProps {
  pokemon: Pokemon;
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addPokemon, isInCompare, isFull } = useCompareStore();
  const { onHoverStart, onHoverEnd } = usePrefetchPokemon();

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default;
  const shiny = pokemon.sprites.front_shiny;

  const fav = isFavorite(pokemon.id);
  const inCompare = isInCompare(pokemon.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="perspective-[1000px]"
      onMouseEnter={() => onHoverStart(pokemon.id)}
      onMouseLeave={onHoverEnd}
    >
      <div
        className={cn(
          'relative h-64 w-full cursor-pointer transition-transform duration-300 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <article
          className="absolute inset-0 flex flex-col overflow-hidden rounded-card border border-border shadow-card transition-shadow hover:shadow-card-hover hover:scale-[1.03] [backface-visibility:hidden]"
          style={{ backgroundColor: typeColorSoft(primaryType) }}
        >
          <div className="flex items-start justify-between p-3">
            <div className="flex gap-1">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <span className="font-mono text-xs text-foreground-secondary">
              {formatPokedexId(pokemon.id)}
            </span>
          </div>
          <Link
            to={`/pokemon/${pokemon.id}`}
            className="flex flex-1 flex-col items-center justify-center px-3"
            onClick={(e) => e.stopPropagation()}
          >
            {sprite && (
              <img
                src={sprite}
                alt={pokemon.name}
                loading="lazy"
                className="h-28 w-28 object-contain"
              />
            )}
            <h3 className="mt-2 text-lg font-bold">{formatPokemonName(pokemon.name)}</h3>
          </Link>
          <div className="grid grid-cols-3 items-center border-t border-border/50 p-2">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(pokemon.id);
                }}
                className="rounded-lg p-2 hover:bg-background-secondary/50"
                aria-label="Favorito"
              >
                <Heart className={cn('h-4 w-4', fav && 'fill-accent text-accent')} />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                aria-label="Voltear tarjeta"
                title="Voltear tarjeta"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped((f) => !f);
                }}
                className="group/flip rounded-lg p-2 text-foreground-secondary transition-colors hover:bg-background-secondary/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FlipHorizontal2 className="h-4 w-4 motion-safe:group-hover/flip:rotate-180 motion-safe:transition-transform motion-safe:duration-500" />
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isFull() && !inCompare}
                onClick={(e) => {
                  e.stopPropagation();
                  addPokemon({
                    id: pokemon.id,
                    name: pokemon.name,
                    sprite,
                    types: pokemon.types.map((t) => t.type.name),
                  });
                }}
                className="rounded-lg p-2 hover:bg-background-secondary/50 disabled:opacity-40"
                aria-label="Comparar"
              >
                <Scale className={cn('h-4 w-4', inCompare && 'text-accent')} />
              </button>
            </div>
          </div>
        </article>

        <article
          className="absolute inset-0 flex flex-col rounded-card border border-border bg-background-secondary [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="flex flex-1 flex-col items-center justify-center p-4">
            {shiny && (
              <img src={shiny} alt="" loading="lazy" className="h-24 w-24 object-contain" />
            )}
            <p className="mt-2 text-sm font-semibold text-foreground-secondary">Shiny</p>
            <div className="mt-3 grid w-full grid-cols-2 gap-2 text-xs">
              <span>HP: {getStatValue(pokemon.stats, 'hp')}</span>
              <span>ATK: {getStatValue(pokemon.stats, 'attack')}</span>
              <span>DEF: {getStatValue(pokemon.stats, 'defense')}</span>
              <span>VEL: {getStatValue(pokemon.stats, 'speed')}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center border-t border-border/50 p-2">
            <div aria-hidden />
            <div className="flex justify-center">
              <button
                type="button"
                aria-label="Volver a la tarjeta frontal"
                title="Voltear tarjeta"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                className="group/flip rounded-lg p-2 text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FlipHorizontal2 className="h-4 w-4 motion-safe:group-hover/flip:rotate-180 motion-safe:transition-transform motion-safe:duration-500" />
              </button>
            </div>
            <div aria-hidden />
          </div>
        </article>
      </div>
    </motion.div>
  );
}
