import { fetchApi } from './apiClient';

interface GenerationPokemon {
  name: string;
  url: string;
}

export interface Generation {
  id: number;
  name: string;
  pokemon: GenerationPokemon[];
}

export async function getGeneration(idOrName: string | number): Promise<Generation> {
  return fetchApi<Generation>(`/generation/${idOrName}`);
}
