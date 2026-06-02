import type { EvolutionChain } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
  return fetchApi<EvolutionChain>(`/evolution-chain/${id}`);
}

export function extractEvolutionChainId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1] ?? '0', 10);
}
