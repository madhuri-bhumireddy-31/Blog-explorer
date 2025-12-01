'use client';
import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PostCard from '../page/PostCard';
import SearchBar from '../page/search';
import NextButton from '../page/NextButton';
import PrevButton from '../page/PrevButton';
import Link from 'next/link';
import { usePostsSearch } from '../hooks/usePostsSearch';
import { usePost } from '../hooks/usePost';

const fetchPostById = async (id: number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
};

export default function PostsPage() {
  const [userId, setUserId] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const queryClient = useQueryClient();
  const serverPosts = queryClient.getQueryData(['post', 1]);

  const { data: paginatedPosts, isFetching: isFetchingPaginated, error: paginatedError } =
    usePost(userId, { initialData: userId === 1 ? serverPosts : undefined });

  const { data: searchResults, isFetching: isFetchingSearch, error: searchError } =
    usePostsSearch(searchValue);

  // Only recalculate posts to render if data actually changes
  const postsToRender = searchValue ? searchResults : paginatedPosts;

  const isFetching = searchValue ? isFetchingSearch : isFetchingPaginated;
  const error = searchValue ? searchError : paginatedError;

  // Prefetch function
const getPostHoverHandler = useCallback(
  (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['post', postId],
      queryFn: () => fetchPostById(postId),
      staleTime: 1000 * 60 * 2,
    });
  },
  [queryClient]
);


  const handleSearch = useCallback((value: string) => setSearchValue(value), []);

  // Memoized post list rendering to prevent unnecessary rerenders
  const postList = useMemo(
    () =>
      postsToRender?.map((post: any) => (
        <PostCard key={post.id} post={post} onHover={() => getPostHoverHandler(post.id)}  />
      )),
    [postsToRender, getPostHoverHandler]
  );

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 uppercase tracking-wide mb-8 drop-shadow-lg">
        Blog Explorer
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <SearchBar onDebouncedSearch={handleSearch} />
      </div>
<br/>
      <div className="flex justify-center mb-6">
        <Link href="/post/interestform">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Express Your Interest
          </button>
        </Link>
      </div>

      <div className="mt-6">
        {isFetching && <p className="text-center text-gray-500 py-10">Loading posts...</p>}
        {error && <p className="text-center text-red-500 py-10">Error: {error.message}</p>}
        {!isFetching && (!postsToRender || postsToRender.length === 0) && (
          <p className="text-center text-gray-400 py-10">No posts found.</p>
        )}

        <div className="space-y-6">{postList}</div>
      </div>

      {!searchValue && (
        <div className="flex justify-between mt-6">
          <PrevButton userId={userId} setUserId={setUserId} />
          <NextButton userId={userId} setUserId={setUserId} />
        </div>
      )}
    </div>
  );
}
