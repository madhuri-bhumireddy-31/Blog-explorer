'use client';
import { useQuery } from '@tanstack/react-query';

export function usePost(id: number, options?: { initialData?: any }) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      return res.json();
    },
    retry: 2, // retries failed queries 2 times
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60 * 5, // 5 min
    enabled: !!id,
    initialData: options?.initialData,
  });
}
