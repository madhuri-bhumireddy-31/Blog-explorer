// test/useSubmitInterest.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubmitInterest, InterestPost } from '../app/hooks/useSubmitInterest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';

global.fetch = vi.fn();

describe('useSubmitInterest Hook Component Test', () => {
  beforeEach(() => {
    (fetch as any).mockClear();
  });

  // Test component to trigger the mutation
  function TestComponent() {
    const { mutate, isPending, isError, isSuccess } = useSubmitInterest();
    const [submittedPost, setSubmittedPost] = useState<InterestPost | null>(null);

    const handleSubmit = () => {
      const post: InterestPost = { name: 'Madhuri', email: 'madhuri@example.com', message: 'Hello' };
      setSubmittedPost(post);
      mutate(post);
    };

    return (
      <div>
        <button data-testid="submit-btn" onClick={handleSubmit}>Submit</button>
        {isPending && <p data-testid="loading">Submitting...</p>}
        {isError && <p data-testid="error">Error</p>}
        {isSuccess && <p data-testid="success">Submitted!</p>}
        {submittedPost && <p data-testid="post-name">{submittedPost.name}</p>}
      </div>
    );
  }

  it('submits successfully', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 101, name: 'Madhuri', email: 'madhuri@example.com', message: 'Hello' }),
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => screen.getByTestId('success'));

    expect(screen.getByTestId('success')).toBeInTheDocument();
    expect(screen.getByTestId('post-name')).toHaveTextContent('Madhuri');
  });

  it('handles mutation error', async () => {
    (fetch as any).mockResolvedValue({ ok: false });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 101 }),
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('submit-btn'));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
