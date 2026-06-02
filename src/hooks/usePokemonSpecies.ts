import { useQuery } from '@tanstack/react-query';
import { getPokemonSpecies } from '@/services/pokemonService';

export function usePokemonSpecies(idOrName: string | undefined) {
  return useQuery({
    queryKey: ['pokemon-species', idOrName],
    queryFn: () => getPokemonSpecies(idOrName!),
    enabled: !!idOrName,
  });
}
