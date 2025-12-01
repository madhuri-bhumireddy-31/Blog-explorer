'use client';

import { useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { hydrate } from '@tanstack/react-query';

interface TanstackProviderProps {
  children: ReactNode;
  dehydratedState?: unknown;
}

export const TanstackProvider = ({ children, dehydratedState }: TanstackProviderProps) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60, // 1 min
      },
    },
  }));

  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true} />}
    </QueryClientProvider>
  );
};
