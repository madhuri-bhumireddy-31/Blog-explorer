'use client';
import { useQuery } from '@tanstack/react-query';

export function usePostAuthor(userId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['author', userId],
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      return res.json();
    },
    enabled,
  });
}
