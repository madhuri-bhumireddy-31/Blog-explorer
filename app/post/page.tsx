import { QueryClient, dehydrate } from '@tanstack/react-query';
import { TanstackProvider } from '../components/providers/tanstack-provider';
import PostsPage from '../post/PostPage';
import { usePost } from '../hooks/usePost';


export default async function PostsServerPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['post', 1],
    queryFn: () => usePost(1),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <TanstackProvider dehydratedState={dehydratedState}>
      <PostsPage/>
    </TanstackProvider>
  );
}
