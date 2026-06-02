import { QueryClient } from '@tanstack/react-query';
import { STALE_TIME_MS } from '@/constants/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
