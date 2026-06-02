import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPokemon } from '@/services/pokemonService';

export function usePrefetchPokemon() {
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHoverStart = useCallback(
    (idOrName: string | number) => {
      timerRef.current = setTimeout(() => {
        void queryClient.prefetchQuery({
          queryKey: ['pokemon', String(idOrName)],
          queryFn: () => getPokemon(idOrName),
        });
      }, 300);
    },
    [queryClient],
  );

  const onHoverEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { onHoverStart, onHoverEnd };
}
