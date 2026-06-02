import { POKEAPI_BASE_URL } from '@/constants/api';

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${POKEAPI_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PokeAPI error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
