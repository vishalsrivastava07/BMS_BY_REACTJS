import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddBook from '../components/AddBook';
import booksReducer from '../components/redux/booksSlice';

const mockStore = configureStore({
  reducer: {
    books: booksReducer,
  },
});

describe('AddBook Component', () => {
  const mockOnAddBook = vi.fn();
  const validBook = {
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    publicationDate: '2024-02-17',
    genre: 'fiction',
    price: 29.99,
    purchaseLink: 'https://example.com/book',
    bookType: 'Ebook',
    description: ''
  };
  
  beforeEach(() => {
    mockOnAddBook.mockClear();
    render(
      <Provider store={mockStore}>
        <AddBook onAddBook={mockOnAddBook} editingBook={null} />
      </Provider>
    );
  });

  describe('Initial Render', () => {
    it('renders form with empty fields', () => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/author/i)).toHaveValue('');
      expect(screen.getByLabelText(/isbn/i)).toHaveValue('');
      expect(screen.getByLabelText(/publication date/i)).toHaveValue('');
      expect(screen.getByLabelText(/genre/i)).toHaveValue('fiction');
      expect(screen.getByLabelText(/book type/i)).toHaveValue('Ebook');
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
      expect(screen.getByLabelText(/purchase link/i)).toHaveValue('');
    });

    it('renders submit and clear buttons with correct text', () => {
      const submitButton = screen.getByRole('button', { name: /add book/i });
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      
      expect(submitButton).toHaveTextContent('Add Book');
      expect(clearButton).toHaveTextContent('Clear Form');
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

    // Verify onAddBook was not called
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });

  test('displays error for invalid purchase link', async () => {
    const user = userEvent.setup();
    render(<AddBook onAddBook={mockOnAddBook} editingBook={null} />);

    // Enter invalid URL
    await user.type(screen.getByPlaceholderText(/Enter purchase link/i), 'invalid-url');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /Add Book/i }));

    // Verify error message is displayed
    expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();

    // Verify onAddBook was not called
    expect(mockOnAddBook).not.toHaveBeenCalled();
  });
});


  describe('Form Validation', () => {
    it('displays specific error messages for empty required fields', async () => {
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const errors = await screen.findAllByText(/is required/i);
      expect(errors).toHaveLength(6); // Title, Author, ISBN, Publication date, Price, Purchase link

      const errorMessages = errors.map(error => error.textContent);
      expect(errorMessages).toContain('Title is required');
      expect(errorMessages).toContain('Author is required');
      expect(errorMessages).toContain('ISBN is required');
      expect(errorMessages).toContain('Publication date is required');
      expect(errorMessages).toContain('Purchase link is required');
    });

    it('validates ISBN format correctly', async () => {
      const isbnInput = screen.getByLabelText(/isbn/i);
      await userEvent.type(isbnInput, 'abc123');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('ISBN must contain only numbers');
      expect(error).toBeInTheDocument();
      expect(isbnInput).toHaveValue('123'); // Should only contain numbers
    });

    it('validates price must be positive', async () => {
      const priceInput = screen.getByLabelText(/price/i);
      await userEvent.type(priceInput, '-10.99');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('Price must be greater than 0');
      expect(error).toBeInTheDocument();
    });

    it('validates purchase link format', async () => {
      const purchaseLinkInput = screen.getByLabelText(/purchase link/i);
      await userEvent.type(purchaseLinkInput, 'invalid-url');
      
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      const error = await screen.findByText('Please enter a valid URL');
      expect(error).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('successfully submits form with valid data', async () => {
      const user = userEvent.setup();

      // Fill in form fields
      await user.type(screen.getByPlaceholderText(/Enter book title/i), validBook.title);
      await user.type(screen.getByPlaceholderText(/Enter author name/i), validBook.author);
      await user.type(screen.getByPlaceholderText(/Enter ISBN/i), validBook.isbn);
      await user.type(screen.getByLabelText(/Publication Date/i), validBook.publicationDate);
      await user.selectOptions(screen.getByLabelText(/Genre/i), validBook.genre);
      await user.selectOptions(screen.getByLabelText(/Book Type/i), validBook.bookType);
      await user.type(screen.getByPlaceholderText(/Enter price/i), validBook.price.toString());
      await user.type(screen.getByPlaceholderText(/Enter purchase link/i), validBook.purchaseLink);

      // Submit form
      await user.click(screen.getByRole('button', { name: /Add Book/i }));

      // Verify onAddBook was called with correct data
      expect(mockOnAddBook).toHaveBeenCalledTimes(1);
      expect(mockOnAddBook).toHaveBeenCalledWith(expect.objectContaining({
        ...validBook,
        id: expect.any(String)
      }));

      // Verify form is reset after submission
      expect(screen.getByPlaceholderText(/Enter book title/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/Enter author name/i)).toHaveValue('');
    });
  });

  describe('Form Reset', () => {
    it('clears all form fields when Clear Form button is clicked', async () => {
      // Fill form with data
      await userEvent.type(screen.getByLabelText(/title/i), 'Test Title');
      await userEvent.type(screen.getByLabelText(/author/i), 'Test Author');
      await userEvent.type(screen.getByLabelText(/isbn/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/publication date/i), '2024-03-15');
      await userEvent.type(screen.getByLabelText(/price/i), '29.99');
      await userEvent.type(screen.getByLabelText(/purchase link/i), 'https://example.com');

      // Click clear button
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      fireEvent.click(clearButton);

      // Verify all fields are cleared
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/author/i)).toHaveValue('');
      expect(screen.getByLabelText(/isbn/i)).toHaveValue('');
      expect(screen.getByLabelText(/publication date/i)).toHaveValue('');
      expect(screen.getByLabelText(/genre/i)).toHaveValue('fiction');
      expect(screen.getByLabelText(/book type/i)).toHaveValue('Ebook');
      expect(screen.getByLabelText(/price/i)).toHaveValue(0);
      expect(screen.getByLabelText(/purchase link/i)).toHaveValue('');
    });

    it('clears error messages when form is reset', async () => {
      // Submit empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /add book/i });
      fireEvent.click(submitButton);

      // Verify errors are shown
      expect(await screen.findAllByText(/is required/i)).toHaveLength(6);

      // Clear form
      const clearButton = screen.getByRole('button', { name: /clear form/i });
      fireEvent.click(clearButton);

      // Verify errors are cleared
      expect(screen.queryAllByText(/is required/i)).toHaveLength(0);
    });
  });
});