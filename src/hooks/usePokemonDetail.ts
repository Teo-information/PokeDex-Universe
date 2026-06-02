import { useQuery } from '@tanstack/react-query';
import { getPokemon } from '@/services/pokemonService';

export function usePokemonDetail(idOrName: string | undefined) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => getPokemon(idOrName!),
    enabled: !!idOrName,
  });
}
