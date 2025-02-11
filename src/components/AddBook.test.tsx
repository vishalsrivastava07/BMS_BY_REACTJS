import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddBook } from './AddBook';
import { Book } from './types';

describe('AddBook Component', () => {
  const mockOnAddBook = vi.fn();
  const user = userEvent.setup();

  const mockBook: Book = {
    id: '123',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    publicationDate: '2024-02-10',
    genre: 'fiction',
    price: 29.99,
    purchaseLink: 'https://example.com',
    bookType: 'Ebook'
  };

  beforeEach(() => {
    mockOnAddBook.mockClear();
  });

  it('renders the form with correct initial state', () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter book title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter author name')).toHaveValue('');
  });

  it('loads editing book data correctly', () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={mockBook} />);
    
    expect(screen.getByText('Edit Book')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter book title')).toHaveValue(mockBook.title);
    expect(screen.getByPlaceholderText('Enter author name')).toHaveValue(mockBook.author);
    expect(screen.getByPlaceholderText('Enter ISBN (numbers only)')).toHaveValue(mockBook.isbn);
  });

  it('clears form when clear button is clicked', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={mockBook} />);
    
    const clearButton = screen.getByText('Clear Form');
    await user.click(clearButton);

    expect(screen.getByPlaceholderText('Enter book title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter author name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter ISBN (numbers only)')).toHaveValue('');
  });
});



