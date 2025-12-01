'use client';
import { ErrorBoundary } from './hooks/useErrorBoundary';
import PostsPage from './infiniteloop/PostInfiniteScroll';

export default function Page() {
  return (
  <ErrorBoundary fallback={<p>Failed to load posts.</p>}>
      <PostsPage />
  </ErrorBoundary>
  );
}
