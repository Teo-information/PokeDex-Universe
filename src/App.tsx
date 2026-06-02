import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/cache';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
