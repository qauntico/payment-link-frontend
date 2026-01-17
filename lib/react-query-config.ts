import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Refetch settings - always refetch when window regains focus or reconnects
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      staleTime: 0, // Data is immediately considered stale
      gcTime: 0, // Don't keep any data in cache - remove immediately when unused
      
      // Don't show cached data while fetching
      placeholderData: undefined,
      
      // Retry settings
      retry: 1,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Network settings
      refetchInterval: false, // Don't auto-refetch on interval
      refetchIntervalInBackground: false,
    },
  },
};

export function createQueryClient() {
  return new QueryClient(queryClientConfig as QueryClientConfig);
}
