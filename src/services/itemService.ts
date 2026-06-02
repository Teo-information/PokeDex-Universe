import type { Item, PokemonListResult } from '@/types/pokemon.types';
import { fetchApi } from './apiClient';

export async function getItemList(limit = 50, offset = 0): Promise<PokemonListResult> {
  return fetchApi<PokemonListResult>(`/item?limit=${limit}&offset=${offset}`);
}

export async function getItem(idOrName: string | number): Promise<Item> {
  return fetchApi<Item>(`/item/${idOrName}`);
}
