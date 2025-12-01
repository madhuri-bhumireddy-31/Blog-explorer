import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InterestForm from '../app/post/interestform/page';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Test Wrapper for React Query
function TestWrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('InterestForm Component', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // reset mock calls before each test
  });

  it('renders the form correctly', () => {
    render(<TestWrapper><InterestForm /></TestWrapper>);

    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });



  it('does not submit if any field is empty', async () => {
    render(<TestWrapper><InterestForm /></TestWrapper>);

    const button = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(button);

    expect(await screen.findByText(/Please fill out all fields before submitting./i)).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });










  it('submits the form successfully with valid data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 101 }),
    });

    render(<TestWrapper><InterestForm /></TestWrapper>);

    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

    const button = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(button);

    const successMsg = await screen.findByText(/Interest submitted successfully/i);
    expect(successMsg).toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    // fetch never resolves to simulate pending state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<TestWrapper><InterestForm /></TestWrapper>);

    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

    const button = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Submitting/i);
  });

  it('shows error message if submission fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<TestWrapper><InterestForm /></TestWrapper>);

    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

    const button = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(button);

    const errorMsg = await screen.findByText(/Error submitting your interest/i);
    expect(errorMsg).toBeInTheDocument();
  });
});



//   //enter invalid data and check for error message
//   it ("shows error on invalid mail", async () => {
//     render(<TestWrapper><InterestForm /></TestWrapper>);
//     await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
//     await userEvent.type(screen.getByPlaceholderText(/Email/i), 'invalid-email');
//     await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');
//     await userEvent.click(screen.getByRole('button', { name: /submit/i }));

//     await waitFor(() => {
//     expect(screen.getByText(/Please include an '@' in the email address./i)).toBeInTheDocument();
//   });

// });













































// //  Mock the fetch API for submission ---
// const mockFetch = vi.fn();
// global.fetch = mockFetch as any;

// //test cases
// describe('InterestForm Component', () => {

//   beforeEach(() => {
//     vi.resetAllMocks();
//   });

//   // Test to check if all input fields and button render
//   it('renders all input fields and submit button', () => {
//     render(
//       <TestWrapper>
//         <InterestForm />
//       </TestWrapper>
//     );

//     expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
//   });


//   // Test to check if submit button is disabled while submitting
//   it('disables submit button while submitting', async () => {
//     mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves
//     render(
//       <TestWrapper>
//         <InterestForm />
//       </TestWrapper>
//     );

//     await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
//     await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
//     await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

//     const button = screen.getByRole('button', { name: /submit/i });
//     await userEvent.click(button);

//     expect(button).toBeDisabled();
//     expect(button).toHaveTextContent(/Submitting/i);
//   });


//   // Test to check success message on successful submission
//   it('shows success message after successful submission', async () => {
//     mockFetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({ id: 101 }),
//     });

//     render(
//       <TestWrapper>
//         <InterestForm />
//       </TestWrapper>
//     );

//     await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
//     await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
//     await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

//     await userEvent.click(screen.getByRole('button', { name: /submit/i }));

//     const successMsg = await screen.findByText(/Interest submitted successfully/i);
//     expect(successMsg).toBeInTheDocument();
//   });

//   // Test to check error message on failed submission
//   it('shows error message on failed submission', async () => {
//     mockFetch.mockResolvedValueOnce({
//       ok: false,
//     });

//     render(
//       <TestWrapper>
//         <InterestForm />
//       </TestWrapper>
//     );

//     await userEvent.type(screen.getByPlaceholderText(/Name/i), 'Test Name');
//     await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
//     await userEvent.type(screen.getByPlaceholderText(/Message/i), 'Hello');

//     await userEvent.click(screen.getByRole('button', { name: /submit/i }));

//     const errorMsg = await screen.findByText(/Error submitting your interest/i);
//     expect(errorMsg).toBeInTheDocument();
//   });

//   // Test to ensure form does not submit if fields are empty
//   it('does not submit if any field is empty', async () => {
//     render(
//       <TestWrapper>
//         <InterestForm />
//       </TestWrapper>
//     );

//     const button = screen.getByRole('button', { name: /submit/i });
//     await userEvent.click(button);

//     expect(mockFetch).not.toHaveBeenCalled();
//   });

// });
