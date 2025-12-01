// test/usePostComponent.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePost } from '../app/hooks/usePost';
import { useEffect, useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('usePost Hook Component Test', () => {
  beforeEach(() => {
    (fetch as any).mockClear();
  });

  function TestComponent({ userId }: { userId: number }) {
    const { data, isLoading, isError } = usePost(userId);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error</div>;
    return (
      <div data-testid="post-data">
        {data.map((post: any) => (
          <p key={post.id}>{post.title}</p>
        ))}
      </div>
    );
  }

  it('renders posts correctly', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, title: 'Post 1' }],
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={1} />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByTestId('post-data'));
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });


});
