import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
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
    
    const clearButton = screen.getByRole('button', { name: /Clear Form/i });
    await user.click(clearButton);

    expect(screen.getByPlaceholderText('Enter book title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter author name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter ISBN (numbers only)')).toHaveValue('');
  });

  it('successfully adds a book with valid data', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    const validBook: Book = {
      id: '',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '1234567890',
      publicationDate: '2024-02-11',
      genre: 'fiction',
      price: 29.99,
      purchaseLink: 'https://example.com',
      bookType: 'Ebook'
    };

    await user.type(screen.getByPlaceholderText(/Enter book title/i), validBook.title);
    await user.type(screen.getByPlaceholderText(/Enter author name/i), validBook.author);
    await user.type(screen.getByPlaceholderText(/Enter ISBN/i), validBook.isbn);
    
    const dateInput = screen.getByLabelText(/Publication Date/i);
    await user.type(dateInput, validBook.publicationDate);

    const priceInput = screen.getByPlaceholderText(/Enter price/i);
    await user.type(priceInput, validBook.price.toString());

    await user.type(screen.getByPlaceholderText(/Enter purchase link/i), validBook.purchaseLink);

    const submitButton = screen.getByRole('button', { name: /Add Book/i });
    await user.click(submitButton);

    expect(mockOnAddBook).toHaveBeenCalledTimes(1);
    expect(mockOnAddBook).toHaveBeenCalledWith(expect.objectContaining({
      ...validBook,
      id: expect.any(String)
    }));

    expect(screen.getByPlaceholderText(/Enter book title/i)).toHaveValue('');
  });

  it('displays validation errors for invalid data', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);

    const submitButton = screen.getByRole('button', { name: /Add Book/i });
    await user.click(submitButton);

    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Author is required/i)).toBeInTheDocument();
    expect(screen.getByText(/ISBN is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Publication date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Price must be greater than 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchase link is required/i)).toBeInTheDocument();

    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  it('clears form data when Clear Form button is clicked', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    await user.type(screen.getByPlaceholderText(/Enter book title/i), 'Test Book');
    await user.type(screen.getByPlaceholderText(/Enter author name/i), 'Test Author');
    
    const clearButton = screen.getByRole('button', { name: /Clear Form/i });
    await user.click(clearButton);
    
    expect(screen.getByPlaceholderText(/Enter book title/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Enter author name/i)).toHaveValue('');
  });

});
