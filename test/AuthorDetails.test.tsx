// test/AuthorDetails.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorDetails from '../app/page/AuthorDetails';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('AuthorDetails Component', () => {
  const userId = 1;

  // Wrapper for React Query
  function Wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }


  //test rendering of Author button
  it('renders the Author button', () => {
    render(<Wrapper><AuthorDetails userId={userId} /></Wrapper>);

    const btn = screen.getByTestId('author-component');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Author');
  });


  //test button functionality
  it('toggles showAuthor state when button is clicked', () => {
    render(<Wrapper><AuthorDetails userId={userId} /></Wrapper>);

    const btn = screen.getByTestId('author-component');

    // Click to show author details
    fireEvent.click(btn);
    expect(btn).toHaveStyle('background-color: #ccc');
    expect(screen.getByText(/Loading author details/i)).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(btn);
    expect(btn).toHaveStyle('background-color: #2196f3');
    expect(screen.queryByText(/Loading author details/i)).not.toBeInTheDocument();
  });
});
