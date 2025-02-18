import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookListHeader } from './BookListHeader';

describe('BookListHeader', () => {
  it('renders total books and filtered count correctly', () => {
    render(<BookListHeader totalBooks={10} filteredCount={5} />);
    
    expect(screen.getByText('Total Books: 10')).toBeInTheDocument();
    expect(screen.getByText('Showing 5 books')).toBeInTheDocument();
  });

  it('displays correct text when all books are shown', () => {
    render(<BookListHeader totalBooks={7} filteredCount={7} />);
    
    expect(screen.getByText('Total Books: 7')).toBeInTheDocument();
    expect(screen.getByText('Showing 7 books')).toBeInTheDocument();
  });
});
