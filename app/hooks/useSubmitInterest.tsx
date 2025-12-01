'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface InterestPost {
  name: string;
  email: string;
  message: string;
  id?: number;
}

export function useSubmitInterest() {
  const queryClient = useQueryClient();

  const submitInterest = async (newPost: InterestPost) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (!res.ok) throw new Error('Failed to submit');
    return res.json();
  };

  return useMutation({
    mutationFn: submitInterest,

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['interestCount'] });

      const previousPosts = queryClient.getQueryData<InterestPost[]>(['posts']);
      const previousCount = queryClient.getQueryData<number>(['interestCount']) ?? 0;

      // Optimistic update: add the post immediately
      queryClient.setQueryData<InterestPost[]>(['posts'], (old) => [
        ...(old ?? []),
        { ...newPost, id: Date.now() },
      ]);

      // Optimistic update: increase count immediately
      queryClient.setQueryData(['interestCount'], previousCount + 1);

      return { previousPosts, previousCount };
    },

    onError: (_error, _newPost, context) => {
      // Rollback to previous state if mutation fails
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
        queryClient.setQueryData(['interestCount'], context.previousCount);
      }
    },

    onSettled: () => {
      // Refetch queries after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
