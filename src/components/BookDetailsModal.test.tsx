import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookDetailsModal } from './BookDetailsModal';
import { Book } from './types';

const mockBook: Book = {
  id: '1',
  title: 'Test',
  author: 'Vish',
  isbn: '1',
  publicationDate: '2023-01-01',
  genre: 'fiction',
  price: 10,
  purchaseLink: 'https://example.com',
  bookType: 'Ebook',
  description: ''
};

describe('BookDetailsModal', () => {

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<BookDetailsModal book={mockBook} onClose={onCloseMock} />);
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('has a functional purchase link', () => {
    render(<BookDetailsModal book={mockBook} onClose={() => {}} />);
    
    const purchaseLink = screen.getByText('Buy Now');
    expect(purchaseLink.closest('a')).toHaveAttribute('href', mockBook.purchaseLink);
  });
});
