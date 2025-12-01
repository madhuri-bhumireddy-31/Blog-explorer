// test/PostsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostsPage from '../app/post/PostPage';
import { usePost } from '../app/hooks/usePost';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';


//Test Wrapper for React Query
function TestWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('PostsPage Component', () => {



//to check page rendered correctly
  it('renders the page title', () => {
    render( <TestWrapper> <PostsPage/></TestWrapper>)
    expect(screen.getByText(/Blog Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Express Your Interest/i)).toBeInTheDocument();
  });


  it('renders Express Your Interest button linking to /post/interestform', () => {
  render(<TestWrapper><PostsPage /></TestWrapper>);
  const linkButton = screen.getByText(/Express Your Interest/i);
  expect(linkButton.closest('a')).toHaveAttribute('href', '/post/interestform');
});


});



















  // // Mock hooks
  // vi.mock('../app/hooks/useDebounce', () => ({
  //   useDebounce: (value: string) => value,
  // }));

  // vi.mock('../app/hooks/usePostsSearch', () => ({
  //   usePostsSearch: (searchTerm: string) => {
  //     if (searchTerm === 'error') return { data: null, isFetching: false, error: { message: 'Search Error' } };
  //     if (searchTerm === 'empty') return { data: [], isFetching: false, error: null };
  //     return {
  //       data: [
  //         { id: 101, title: 'Search Post 1', body: 'Body 1' },
  //         { id: 102, title: 'Search Post 2', body: 'Body 2' },
  //       ],
  //       isFetching: false,
  //       error: null,
  //     };
  //   },
  // }));

  // vi.mock('../app/hooks/usePost', () => ({
  //   usePost: vi.fn((userId: number) => ({
  //     data: [
  //       { id: 1, title: 'Post 1', body: 'Body 1' },
  //       { id: 2, title: 'Post 2', body: 'Body 2' },
  //     ],
  //     isFetching: false,
  //     error: null,
  //   })),
  // }));


  // vi.mock('../app/page/PostCard', () => ({
  //   default: ({ post }: any) => (
  //     <div data-testid="post-card">
  //       <h2>{post.title}</h2>
  //       <button onClick={() => post.showComments && post.showComments(['Great!', 'Nice!'])}>Comments</button>
  //       <button onClick={() => post.showAuthor && post.showAuthor({ name: 'John Doe' })}>Author</button>
  //     </div>
  //   ),
  // }));

  // vi.mock('../app/page/search', () => ({
  //   default: ({ searchTerm, setSearchTerm }: any) => (
  //     <input
  //       data-testid="search-input"
  //       value={searchTerm}
  //       onChange={(e) => setSearchTerm(e.target.value)}
  //     />
  //   ),
  // }));

  // vi.mock('../app/page/InterestForm', () => ({
  //   default: () => <div data-testid="interest-form">InterestForm</div>,
  // }));

  // vi.mock('../app/page/NextButton', () => ({
  //   default: ({ userId, setUserId }: any) => (
  //     <button data-testid="next-button" onClick={() => setUserId(userId + 1)}>Next</button>
  //   ),
  // }));

  // vi.mock('../app/page/PrevButton', () => ({
  //   default: ({ userId, setUserId }: any) => (
  //     <button data-testid="prev-button" onClick={() => setUserId(userId - 1)}>Prev</button>
  //   ),
  // }));



  // // Utility to render with React Query
  // const renderWithQueryClient = (ui: JSX.Element) => {
  //   const queryClient = new QueryClient();
  //   return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  // };


  // // Test Cases-
  // describe('PostsPage Component', () => {
  //   //rendering tests
  //   it('renders the page title', () => {
  //     renderWithQueryClient(<PostsPage />);
  //     expect(screen.getByText(/Blog Explorer/i)).toBeInTheDocument();
  //   });


  //   // Check if SearchBar and InterestForm are rendered
  //   it('renders search bar and interest form', () => {
  //     renderWithQueryClient(<PostsPage />);
  //     expect(screen.getByTestId('search-input')).toBeInTheDocument();
  //     expect(screen.getByTestId('interest-form')).toBeInTheDocument();
  //   });


  //   // Check if posts from pagination are rendered when no search term
  //   it('renders posts from pagination when no search term', () => {
  //     renderWithQueryClient(<PostsPage />);
  //     expect(screen.getAllByTestId('post-card')).toHaveLength(2);
  //     expect(screen.getByText('Post 1')).toBeInTheDocument();
  //     expect(screen.getByText('Post 2')).toBeInTheDocument();
  //   });


  //   // Check if search results are rendered when search term is provided
  //   it('renders search results when search term is provided', async () => {
  //     renderWithQueryClient(<PostsPage />);
  //     const input = screen.getByTestId('search-input');
  //     await userEvent.type(input, 'abc');
  //     expect(screen.getAllByTestId('post-card')).toHaveLength(2);
  //     expect(screen.getByText('Search Post 1')).toBeInTheDocument();
  //   });


  //   // Check error state during search
  //   it('renders error state during search', async () => {
  //     renderWithQueryClient(<PostsPage />);
  //     const input = screen.getByTestId('search-input');
  //     await userEvent.type(input, 'error');
  //     const errorMsg = await screen.findByText(/Error loading posts: Search Error/i);
  //     expect(errorMsg).toBeInTheDocument();
  //   });


  //   // check loading state
  //   it('renders loading state', () => {
  //     vi.mocked(usePost).mockReturnValueOnce({
  //       data: null,
  //       isFetching: true,
  //       error: null,
  //     });

  //     renderWithQueryClient(<PostsPage />);
  //     expect(screen.getByText(/Loading posts/i)).toBeInTheDocument();
  //   });

  //   // check empty state
  //   it('renders empty state when no posts', () => {
  //     vi.mocked(usePost).mockReturnValueOnce({
  //       // data: [],
  //     //   isFetching: false,
  //     //   error: null,
  //     });

  //     renderWithQueryClient(<PostsPage />);
  //     expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  //   });

  //   it('updates userId when pagination buttons clicked', async () => {
  //     renderWithQueryClient(<PostsPage />);
  //     const nextBtn = screen.getByTestId('next-button');
  //     const prevBtn = screen.getByTestId('prev-button');
  //     await userEvent.click(nextBtn);
  //     await userEvent.click(prevBtn);
  //     expect(screen.getAllByTestId('post-card')).toHaveLength(2);
  //   });


  // });
