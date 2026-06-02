import { DEFAULT_PAGE_SIZE } from '@/constants/api';
import type { Pokemon, PokemonListResult, PokemonSpecies } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getPokemonList(
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
): Promise<PokemonListResult> {
  return fetchApi<PokemonListResult>(`/pokemon?limit=${limit}&offset=${offset}`);
}

export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  return fetchApi<Pokemon>(`/pokemon/${idOrName}`);
}

export async function getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  return fetchApi<PokemonSpecies>(`/pokemon-species/${idOrName}`);
}
