import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookDetailsModal } from './BookDetailsModal';
import { Book } from './types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'John Doe',
  isbn: '1234567890',
  publicationDate: '2023-01-01',
  genre: 'fiction',
  price: 19.99,
  purchaseLink: 'https://example.com',
  bookType: 'Ebook',
};

describe('BookDetailsModal', () => {
  it('renders book details correctly', () => {
    render(<BookDetailsModal book={mockBook} onClose={() => {}} />);

    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
    expect(screen.getByText(mockBook.isbn)).toBeInTheDocument();
    expect(screen.getByText(mockBook.publicationDate)).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

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
