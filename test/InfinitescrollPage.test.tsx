import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import PostInfiniteScroll from '../app/infiniteloop/PostInfiniteScroll';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as getPostsModule from '../app/infiniteloop/getPosts';

// Mock IntersectionObserver globally
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = IntersectionObserverMock as any;

// Optional: mock useIntersection for Mantine
vi.mock('@mantine/hooks', () => ({
  useIntersection: () => ({
    ref: vi.fn(),
    entry: { isIntersecting: true },
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('PostInfiniteScroll', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the title', () => {
    render(<PostInfiniteScroll />, { wrapper: createWrapper() });
    expect(screen.getByText(/Blog Explorer - Infitinite Scroll/i)).toBeInTheDocument();
  });

  it('renders posts from getPosts', async () => {
    vi.spyOn(getPostsModule, 'getPosts').mockResolvedValueOnce({
      posts: [
        { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
        { id: 2, title: 'Post 2', body: 'Body 2', userId: 2 },
      ],
      nextPageToken: undefined,
    });

    render(<PostInfiniteScroll />, { wrapper: createWrapper() });

    expect(await screen.findByText(/Post 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Post 2/i)).toBeInTheDocument();
  });

  it('shows loading when fetching next page', async () => {
    vi.spyOn(getPostsModule, 'getPosts').mockResolvedValueOnce({
      posts: [{ id: 1, title: 'Post 1', body: 'Body 1', userId: 1 }],
      nextPageToken: 2,
    });

    render(<PostInfiniteScroll />, { wrapper: createWrapper() });

    expect(await screen.findByText(/Loading more posts/i)).toBeInTheDocument();
  });
});
