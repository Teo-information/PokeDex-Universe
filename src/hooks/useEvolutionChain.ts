import { useQuery } from '@tanstack/react-query';
import { getEvolutionChain } from '@/services/evolutionService';

export function useEvolutionChain(chainId: number | undefined) {
  return useQuery({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => getEvolutionChain(chainId!),
    enabled: !!chainId && chainId > 0,
  });
}
