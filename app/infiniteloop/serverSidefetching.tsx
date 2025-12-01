import { QueryClient, dehydrate } from '@tanstack/react-query';
import { TanstackProvider } from '../components/providers/tanstack-provider';
import PostInfiniteScroll from './PostInfiniteScroll';
import {getPosts} from "./getPosts"

export default async function PostsInfiniteServerPage() {
  const queryClient = new QueryClient();
  // Prefetch first page of posts
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(1, 10),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanstackProvider dehydratedState={dehydratedState}>
      <PostInfiniteScroll dehydratedState={dehydratedState} />
    </TanstackProvider>
  );
}
