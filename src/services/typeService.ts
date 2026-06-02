import type { PokemonType } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getType(idOrName: string): Promise<PokemonType> {
  return fetchApi<PokemonType>(`/type/${idOrName}`);
}
