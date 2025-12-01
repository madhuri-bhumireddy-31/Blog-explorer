import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPosts } from '../app/infiniteloop/getPosts';

describe('getPosts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: 'Post 1' }]),
      })
    ) as any;

    const result = await getPosts(1);
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toBe('Post 1');
  });

  it('throws error if response is not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false })
    ) as any;

    await expect(getPosts(1)).rejects.toThrow('Failed to fetch posts');
  });

  it('throws error if fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject('API down')) as any;

    await expect(getPosts(1)).rejects.toEqual('API down');
  });
});
