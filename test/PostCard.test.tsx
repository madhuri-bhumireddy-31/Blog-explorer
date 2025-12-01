// test/PostCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostCard from '../app/page/PostCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

//  post data
const post = { id: 1, userId: 1, title: 'Test Post', body: 'This is a test.' };

// router stub (necessary for Next.js)
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('PostCard Component', () => {
    //test post details rendering
  it('renders post details correctly', () => {
    render( <Wrapper> <PostCard post={post} onHover={() => {}} /> </Wrapper>);

    expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test/i)).toBeInTheDocument();
    expect(screen.getByText(/ID:/i)).toBeInTheDocument();
  });

  //test onHover callback
  it('calls onHover when mouse enters the post', () => {
    const onHover = vi.fn();
    render(<Wrapper><PostCard post={post} onHover={onHover} /> </Wrapper>);

    const div = screen.getByText(/Test Post/i).closest('div')!;
    fireEvent.mouseEnter(div);
    expect(onHover).toHaveBeenCalled();
  });

  //test navigation on click
  it('calls router.push on click', () => {
    render(<Wrapper><PostCard post={post} onHover={() => {}} /> </Wrapper>);

    const div = screen.getByText(/Test Post/i).closest('div')!;
    fireEvent.click(div);
    expect(pushMock).toHaveBeenCalledWith(`/post/${post.id}`);
  });


});
