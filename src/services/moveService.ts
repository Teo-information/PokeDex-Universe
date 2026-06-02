import type { Move, PokemonListResult } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getMoveList(limit = 50, offset = 0): Promise<PokemonListResult> {
  return fetchApi<PokemonListResult>(`/move?limit=${limit}&offset=${offset}`);
}

export async function getMove(idOrName: string | number): Promise<Move> {
  return fetchApi<Move>(`/move/${idOrName}`);
}
