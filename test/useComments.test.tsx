// test/usePostCommentsComponent.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostComments } from '../app/hooks/usePostComments';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('usePostComments Hook Component Test', () => {
  beforeEach(() => {
    (fetch as any).mockClear();
  });

  // Test component to render comments
  function TestComments({ postId, enabled }: { postId: number; enabled: boolean }) {
    const { data, isLoading, isError } = usePostComments(postId, enabled);

    if (!enabled) return <div data-testid="disabled">Disabled</div>;
    if (isLoading) return <div data-testid="loading">Loading...</div>;
    if (isError) return <div data-testid="error">Error</div>;

    return (
      <div data-testid="comments">
        {data.map((comment: any) => (
          <p key={comment.id}>{comment.body}</p>
        ))}
      </div>
    );
  }

  it('renders comments successfully', async () => {
    // Mock successful fetch
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, body: 'Comment 1' },
        { id: 2, body: 'Comment 2' },
      ],
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComments postId={1} enabled={true} />
      </QueryClientProvider>
    );

    // Wait for comments to render
    await waitFor(() => screen.getByTestId('comments'));
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Comment 2')).toBeInTheDocument();
  });

  it('renders disabled state when enabled is false', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComments postId={1} enabled={false} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('disabled')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (fetch as any).mockRejectedValue(new Error('Failed fetch'));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComments postId={1} enabled={true} />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByTestId('error'));
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
