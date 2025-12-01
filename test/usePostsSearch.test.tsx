import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react'; // import waitFor correctly
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostsSearch } from '../app/hooks/usePostsSearch';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};


describe('usePostsSearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns posts when search matches', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: 'Test Post' }]),
      })
    ) as any;

    const { result } = renderHook(() => usePostsSearch('Test'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].title).toBe('Test Post');
  });

  it('returns all posts when search is empty', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' },
          ]),
      })
    ) as any;

    const { result } = renderHook(() => usePostsSearch(''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
  });

  it('throws error when fetch fails', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('Network Error'))) as any;

  const { result } = renderHook(() => usePostsSearch('Fail'), {
    wrapper: createWrapper(),
  });

  // Wait for the error to appear in the query result
  await waitFor(() => {
    if (!result.current.isError) throw new Error('Not errored yet');
  });

  expect(result.current.isError).toBe(true);
  expect(result.current.error).toBeDefined();
  expect((result.current.error as Error).message).toBe('Network Error');
});


});
