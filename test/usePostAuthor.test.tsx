// test/usePostAuthorComponent.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostAuthor } from '../app/hooks/usePostAuthor';
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn();

function TestAuthor({ userId, enabled }: { userId: number; enabled: boolean }) {
  const { data, isLoading, isError } = usePostAuthor(userId, enabled);

  if (!enabled) return <div>Disabled</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return <div data-testid="author">{data.name}</div>;
}

describe('usePostAuthor Hook Component Test', () => {
  beforeEach(() => {
    (fetch as any).mockClear();
  });

  it('renders author when enabled', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: 'John Doe' }),
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestAuthor userId={1} enabled={true} />
      </QueryClientProvider>
    );

    await waitFor(() => screen.getByTestId('author'));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestAuthor userId={1} enabled={false} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });
});
