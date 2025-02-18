import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBook from './AddBook';
import { Book } from './types';
import '@testing-library/jest-dom';

describe('AddBook Component', () => {
  const mockOnAddBook = vi.fn();
  const user = userEvent.setup();

  const validBook: Book = {
    id: '',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    publicationDate: '2024-03-10',
    genre: 'fiction',
    price: 29.99,
    purchaseLink: 'https://example.com/book',
    bookType: 'Ebook',
    description: ''
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all required fields', () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/book type/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/author is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/isbn is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/publication date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/price must be greater than 0/i)).toBeInTheDocument();
    expect(await screen.findByText(/purchase link is required/i)).toBeInTheDocument();
  });

  // it('validates ISBN format correctly', async () => {
  //   render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
  //   const isbnInput = screen.getByLabelText(/Enter ISBN (numbers only)/i);
  //   await user.type(isbnInput, '1');
    
  //   const submitButton = screen.getByRole('button', { name: /add book/i });
  //   await user.click(submitButton);

  //   expect(await screen.findByText(/Enter ISBN (numbers only)/i)).toBeInTheDocument();
  // });

  // it('validates purchase link format', async () => {
  //   render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
  //   const purchaseLinkInput = screen.getByLabelText(/purchaseLink/i);
  //   await user.type(purchaseLinkInput, 'invalid-url');
    
  //   const submitButton = screen.getByRole('button', { name: /add book/i });
  //   await user.click(submitButton);

  //   expect(await screen.getByLabelText(/Enter purchase link/i)).toBeInTheDocument();
  // });

  it('successfully submits form with valid data', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    // Fill in form fields
    await user.type(screen.getByLabelText(/title/i), validBook.title);
    await user.type(screen.getByLabelText(/author/i), validBook.author);
    await user.type(screen.getByLabelText(/isbn/i), validBook.isbn);
    await user.type(screen.getByLabelText(/publication date/i), validBook.publicationDate);
    await user.type(screen.getByLabelText(/price/i), validBook.price.toString());
    await user.type(screen.getByLabelText(/purchase link/i), validBook.purchaseLink);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    // Verify onAddBook was called with correct data
    expect(mockOnAddBook).toHaveBeenCalledTimes(1);
    const submittedBook = mockOnAddBook.mock.calls[0][0];
    expect(submittedBook.title).toBe(validBook.title);
    expect(submittedBook.author).toBe(validBook.author);
    expect(submittedBook.isbn).toBe(validBook.isbn);
    expect(submittedBook.price).toBe(validBook.price);
  });

  it('clears form when Clear Form button is clicked', async () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    
    // Fill in some data
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Book');
    
    // Click clear button
    const clearButton = screen.getByRole('button', { name: /clear form/i });
    await user.click(clearButton);

    // Verify form is cleared
    expect(titleInput).toHaveValue('');
  });

  it('loads editing book data correctly', () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={validBook} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue(validBook.title);
    expect(screen.getByLabelText(/author/i)).toHaveValue(validBook.author);
    expect(screen.getByLabelText(/isbn/i)).toHaveValue(validBook.isbn);
    expect(screen.getByLabelText(/price/i)).toHaveValue(validBook.price);
    expect(screen.getByLabelText(/purchase link/i)).toHaveValue(validBook.purchaseLink);
  });

  it('updates button text when editing', () => {
    render(<AddBook onAddBook={mockOnAddBook} editingBook={validBook} />);
    
    expect(screen.getByRole('button', { name: /update book/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add book/i })).not.toBeInTheDocument();
  });
});

describe('AddBook Component', () => {
  const mockOnAddBook = vi.fn();
  const validBook = {
    title: 'Test',
    author: 'Author',
    isbn: '1',
    publicationDate: '2024-02-17',
    genre: 'fiction',
    price: 10,
    purchaseLink: 'https://x.com',
    bookType: 'Ebook',
    description: ''
  };
  beforeEach(() => {
    mockOnAddBook.mockClear();
  });
  test('successfully adds a book when all required fields are filled correctly', async () => {
    const user = userEvent.setup();
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    // Fill in the form fields
    await user.type(screen.getByPlaceholderText(/Enter book title/i), validBook.title);
    await user.type(screen.getByPlaceholderText(/Enter author name/i), validBook.author);
    await user.type(screen.getByPlaceholderText(/Enter ISBN/i), validBook.isbn);
    // Set publication date
    await user.type(screen.getByLabelText(/Publication Date/i), validBook.publicationDate);
    // Select genre and book type
    await user.selectOptions(screen.getByLabelText(/Genre/i), validBook.genre);
    await user.selectOptions(screen.getByLabelText(/Book Type/i), validBook.bookType);
    // Set price and purchase link
    await user.type(screen.getByPlaceholderText(/Enter price/i), validBook.price.toString());
    await user.type(screen.getByPlaceholderText(/Enter purchase link/i), validBook.purchaseLink);
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Add Book/i }));
    // Verify onAddBook was called with the correct data
    expect(mockOnAddBook).toHaveBeenCalledTimes(1);
    expect(mockOnAddBook).toHaveBeenCalledWith(expect.objectContaining({
      ...validBook,
      id: expect.any(String) // UUID will be generated
    }));
    // Verify form is reset after successful submission
    expect(screen.getByPlaceholderText(/Enter book title/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Enter author name/i)).toHaveValue('');
  });
  test('displays error messages when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    // Submit form without filling any fields
    await user.click(screen.getByRole('button', { name: /Add Book/i }));
    // Verify error messages are displayed
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Author is required/i)).toBeInTheDocument();
    expect(screen.getByText(/ISBN is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Publication date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Price must be greater than 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Purchase link is required/i)).toBeInTheDocument();
    // Verify onAddBook was not called
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });
  test('displays error for invalid ISBN format', async () => {
    const user = userEvent.setup();
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    // Enter invalid ISBN (with letters)
    await user.type(screen.getByPlaceholderText(/Enter ISBN/i), 'abc123');
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Add Book/i }));
    // Verify error message is displayed
    expect(screen.getByText(/ISBN must contain only numbers/i)).toBeInTheDocument();
  });
  test('displays error for invalid purchase link', async () => {
    const user = userEvent.setup();
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);
    // Enter invalid URL
    await user.type(screen.getByPlaceholderText(/Enter purchase link/i), 'invalid-url');
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

  });
});