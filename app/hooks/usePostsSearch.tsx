'use client';
import { useQuery } from '@tanstack/react-query';

export function usePostsSearch(search: string) {
  return useQuery({
    queryKey: ['posts', search],
    queryFn: async () => {
      const url = `https://jsonplaceholder.typicode.com/posts?title_like=${search}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    enabled: !!search,
  });
}
