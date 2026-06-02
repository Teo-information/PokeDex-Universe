import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { POKEMON_SPRITES_URL } from '@/constants/api';
import { formatPokemonName } from '@/utils/formatters';
import type { EvolutionChainLink } from '@/types/pokemon.types';
import { extractIdFromUrl } from '@/utils/formatters';

interface EvolutionTreeProps {
  chain: EvolutionChainLink;
}

function EvolutionNode({ link }: { link: EvolutionChainLink }) {
  const id = extractIdFromUrl(link.species.url);
  const detail = link.evolution_details[0];
  const condition = detail
    ? detail.min_level
      ? `Nv. ${detail.min_level}`
      : detail.item
        ? formatPokemonName(detail.item.name)
        : 'Evolución'
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <Link to={`/pokemon/${id}`} className="group flex flex-col items-center">
        <img
          src={`${POKEMON_SPRITES_URL}/${id}.png`}
          alt=""
          loading="lazy"
          className="h-20 w-20 object-contain transition-transform group-hover:scale-110"
        />
        <span className="text-sm font-semibold">{formatPokemonName(link.species.name)}</span>
      </Link>
      {condition && (
        <span className="text-xs text-foreground-secondary">{condition}</span>
      )}
      {link.evolves_to.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {link.evolves_to.map((next, i) => (
            <div key={i} className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-accent" />
              <EvolutionNode link={next} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EvolutionTree({ chain }: EvolutionTreeProps) {
  return (
    <div className="overflow-x-auto py-4">
      <EvolutionNode link={chain} />
    </div>
  );
}
