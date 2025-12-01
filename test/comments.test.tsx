// test/Comments.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Comments from '../app/page/Comments';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


  const postId = 1;

  function Wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

describe('Comments Component', () => {

//test rendering of Comments button
  it('renders the Comments button', () => {
    render(<Wrapper><Comments postId={postId} /></Wrapper>);

    const btn = screen.getByTestId('comments-component');

    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Comments');
  });

  //test button functionality
  it('toggles showComments state when button is clicked', () => {
    render(<Wrapper><Comments postId={postId} /></Wrapper>);

    const btn = screen.getByTestId('comments-component');
    fireEvent.click(btn);
    expect(btn).toHaveStyle('background-color: #ccc');
    expect(screen.getByText(/Loading comments/i)).toBeInTheDocument();

    fireEvent.click(btn);
    expect(btn).toHaveStyle('background-color: #4caf50');
    expect(screen.queryByText(/Loading comments/i)).not.toBeInTheDocument();
  });
});
