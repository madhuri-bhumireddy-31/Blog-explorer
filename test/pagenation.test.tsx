// test/PaginationButtons.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NextButton from '../app/page/NextButton';
import PrevButton from '../app/page/PrevButton';


//next button tests
describe('NextButton Component', () => {

    //test rendering and disabled state
  it('renders correctly and is enabled when userId < maxUserId', () => {
    const setUserId = vi.fn();
    render(<NextButton userId={5} setUserId={setUserId} />);
    const btn = screen.getByTestId('next-button') as HTMLButtonElement;
    expect(btn).toBeInTheDocument();
    expect(btn.disabled).toBe(false);
  });


  //test disabled state when at max userId
  it('is disabled when userId >= maxUserId', () => {
    const setUserId = vi.fn();
    render(<NextButton userId={10} setUserId={setUserId} />);
    const btn = screen.getByTestId('next-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });


  //test click functionality
  it('calls setUserId with incremented value when clicked', () => {
    const setUserId = vi.fn();
    render(<NextButton userId={5} setUserId={setUserId} />);
    const btn = screen.getByTestId('next-button');
    fireEvent.click(btn);
    expect(setUserId).toHaveBeenCalledWith(6);
  });
});




//previous button tests
describe('PrevButton Component', () => {
    //test rendering and disabled state
  it('renders correctly and is enabled when userId > minUserId', () => {
    const setUserId = vi.fn();
    render(<PrevButton userId={5} setUserId={setUserId} />);
    const btn = screen.getByTestId('prev-button') as HTMLButtonElement;
    expect(btn).toBeInTheDocument();
    expect(btn.disabled).toBe(false);
  });

  //test disabled state when at min userId
  it('is disabled when userId <= minUserId', () => {
    const setUserId = vi.fn();
    render(<PrevButton userId={1} setUserId={setUserId} />);
    const btn = screen.getByTestId('prev-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

    //test click functionality
  it('calls setUserId with decremented value when clicked', () => {
    const setUserId = vi.fn();
    render(<PrevButton userId={5} setUserId={setUserId} />);
    const btn = screen.getByTestId('prev-button');
    fireEvent.click(btn);
    expect(setUserId).toHaveBeenCalledWith(4);
  });
});
