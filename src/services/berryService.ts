import type { Berry, PokemonListResult } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getBerryList(limit = 64, offset = 0): Promise<PokemonListResult> {
  return fetchApi<PokemonListResult>(`/berry?limit=${limit}&offset=${offset}`);
}

export async function getBerry(idOrName: string | number): Promise<Berry> {
  return fetchApi<Berry>(`/berry/${idOrName}`);
}
