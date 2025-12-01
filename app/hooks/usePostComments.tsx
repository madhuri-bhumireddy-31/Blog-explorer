'use client';
import { useQuery } from '@tanstack/react-query';

export function usePostComments(id: number, enabled: boolean) {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`
      );
      return res.json();
    },
    enabled,
  });
}
